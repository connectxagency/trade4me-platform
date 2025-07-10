import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import TutorialsSection from '../components/TutorialsSection';
import MarketingMaterialsSection from '../components/MarketingMaterialsSection';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
  CheckCircle,
  BookOpen
} from 'lucide-react';

interface PartnerData {
  id: string;
  partner_type: 'affiliate' | 'kol' | 'community';
  company_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  commission_rate: number | null;
  total_earnings: number;
  total_referrals: number;
  created_at: string;
  partner_referral_link?: string | null;
  phemex_uid?: string | null;
  customer_onboarding_bonus?: number | null;
  profit_share_rate?: number | null;
  rebate_rate?: number | null;
  affiliate_referral_code?: string | null;
}

interface AffiliatePartner {
  id: string;
  name: string;
  email: string;
  company_name: string | null;
  partner_type: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [editingPhemexUID, setEditingPhemexUID] = useState(false);
  const [phemexUID, setPhemexUID] = useState('');
  const [savingUID, setSavingUID] = useState(false);
  const [affiliatePartners, setAffiliatePartners] = useState<AffiliatePartner[]>([]);
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);

  useEffect(() => {
    // Check if this is a demo session
    const demoSession = localStorage.getItem('demo_session');
    if (demoSession) {
      const session = JSON.parse(demoSession);
      setIsDemo(true);
      // Set demo partner data
      setPartnerData({
        id: 'demo-partner-id',
        partner_type: 'community',
        company_name: 'Demo Community Network',
        status: 'approved',
        commission_rate: 15.0,
        total_earnings: 2500.00,
        total_referrals: 42,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        partner_referral_link: 'https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=demo-partner',
        phemex_uid: '12345678', // Demo UID
        customer_onboarding_bonus: 100,
        profit_share_rate: 2,
        rebate_rate: 15,
        affiliate_referral_code: 'DEMO1234'
      });
      setPhemexUID('12345678');
      setLoading(false);
    } else if (user) {
      fetchPartnerData();
    }
  }, [user]);

  const fetchPartnerData = async () => {
    try {
      setError(null);
      console.log('Fetching partner data for user:', user?.id);
      console.log('User email:', user?.email);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration is missing. Please check your environment variables.');
      }
      
      const { data, error } = await supabase
        .from('partners')
        .select(`
          id,
          partner_type,
          company_name,
          status,
          commission_rate,
          total_earnings,
          total_referrals,
          created_at,
          partner_referral_link,
          phemex_uid,
          customer_onboarding_bonus,
          profit_share_rate,
          rebate_rate,
          affiliate_referral_code
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      console.log('Supabase query result:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      } else if (!data) {
        // No partner profile found
        setError('No partner profile found. Please register again.');
      } else {
        console.log('Fetched partner data:', data); // Debug log
        setPartnerData(data);
        setPhemexUID(data.phemex_uid || '');
        
        // Additional debug logging
        console.log('Partner referral link:', data.partner_referral_link);
        console.log('Affiliate referral code:', data.affiliate_referral_code);
        
        if (data.status === 'approved') {
          fetchAffiliatePartners(data.id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching partner data:', error);
      
      // Handle different types of errors
      if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else if (error.message?.includes('Supabase configuration')) {
        setError('Application configuration error. Please contact support.');
      } else {
        setError('Error loading partner data: ' + (error.message || 'Unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliatePartners = async (partnerId: string) => {
    if (isDemo) {
      // Set demo affiliate partners
      setAffiliatePartners([
        {
          id: '1',
          name: 'Max Müller',
          email: 'max.mueller@example.com',
          company_name: 'Müller Trading',
          partner_type: 'affiliate',
          status: 'approved',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Anna Schmidt',
          email: 'anna.schmidt@example.com',
          company_name: null,
          partner_type: 'kol',
          status: 'pending',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Tom Weber',
          email: 'tom.weber@example.com',
          company_name: 'Weber Community',
          partner_type: 'community',
          status: 'approved',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      return;
    }

    setLoadingAffiliates(true);
    try {
      // Fetch partners referred by this partner
      const { data: referrals, error: referralsError } = await supabase
        .from('partner_referrals')
        .select(`
          referred_partner_id,
          status,
          created_at,
          partners!partner_referrals_referred_partner_id_fkey (
            id,
            company_name,
            partner_type,
            status,
            user_id
          )
        `)
        .eq('referrer_partner_id', partnerId);

      if (referralsError) throw referralsError;

      // Get user details for each referred partner
      const affiliates: AffiliatePartner[] = [];
      
      for (const referral of referrals || []) {
        const partner = referral.partners;
        if (partner) {
          // For demo purposes, we'll use simulated user data
          // In a real implementation, you'd fetch from auth.users or user profiles
          const userIdShort = partner.user_id.slice(0, 8);
          const names = ['Max Müller', 'Anna Schmidt', 'Tom Weber', 'Lisa Klein', 'Jan Fischer'];
          const randomName = names[Math.floor(Math.random() * names.length)];
          
          affiliates.push({
            id: partner.id,
            name: randomName,
            email: `${userIdShort}@example.com`,
            company_name: partner.company_name,
            partner_type: partner.partner_type,
            status: partner.status,
            created_at: referral.created_at
          });
        }
      }

      setAffiliatePartners(affiliates);
    } catch (error: any) {
      console.error('Error fetching affiliate partners:', error);
    } finally {
      setLoadingAffiliates(false);
    }
  };

  const handleSignOut = () => {
    if (isDemo) {
      localStorage.removeItem('demo_session');
      window.location.href = '/';
    } else {
      signOut();
    }
  };

  const savePhemexUID = async () => {
    if (isDemo) {
      // For demo, just update local state
      setPartnerData(prev => prev ? { ...prev, phemex_uid: phemexUID || null } : null);
      setEditingPhemexUID(false);
      return;
    }

    setSavingUID(true);
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('partners')
        .update({ phemex_uid: phemexUID || null })
        .eq('user_id', user?.id);

      if (error) throw error;

      setPartnerData(prev => prev ? { ...prev, phemex_uid: phemexUID || null } : null);
      setEditingPhemexUID(false);
    } catch (error: any) {
      console.error('Error saving Phemex UID:', error);
      // Show error message but don't break the UI
      const errorMessage = error.message || 'Error saving Phemex UID. Please try again.';
      alert(errorMessage);
      // Reset to previous value on error
      setPhemexUID(partnerData?.phemex_uid || '');
    } finally {
      setSavingUID(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'Pending' },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Approved' },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPartnerTypeLabel = (type: string) => {
    const types = {
      affiliate: 'Affiliate Partner',
      kol: 'Key Opinion Leader',
      community: 'Community Network'
    };
    return types[type as keyof typeof types];
  };

  const copyReferralLink = () => {
    const userId = isDemo ? 'demo-user-id' : user?.id;
    const referralLink = `https://connectx.com/register?ref=${userId}`;
    navigator.clipboard.writeText(referralLink);
    // You could add a toast notification here
  };

  const copyAffiliateReferralLink = () => {
    const affiliateCode = partnerData?.affiliate_referral_code;
    if (affiliateCode) {
      const affiliateLink = `https://connectx.com/register?affiliate=${affiliateCode}`;
      navigator.clipboard.writeText(affiliateLink);
      // You could add a toast notification here
    }
  };

  const getCurrentUser = () => {
    if (isDemo) {
      return {
        user_metadata: {
          first_name: 'Demo',
          last_name: 'Community'
        },
        email: 'demo.community@connectx.com',
        id: 'demo-user-id'
      };
    }
    return user;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !isDemo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  if (!partnerData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Partner Profile Not Found</h2>
          <p className="text-gray-400">There was a problem loading your partner data.</p>
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white flex items-center">
                Trade<span className="text-blue-500 text-2xl font-black">4</span>me
              </span>
              <span className="text-gray-400">Partner Dashboard</span>
              {isDemo && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                  DEMO MODE
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-medium">
                  {currentUser?.user_metadata?.first_name} {currentUser?.user_metadata?.last_name}
                </div>
                <div className="text-sm text-gray-400">{getPartnerTypeLabel(partnerData.partner_type)}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        {/* Status Alert */}
        {partnerData.status === 'pending' && !isDemo && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="text-yellow-400 font-semibold">Application Under Review</h3>
                <p className="text-yellow-300/80 text-sm">
                  Your partner application is currently being reviewed. You will receive an email once your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Direct Commission</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Phemex Account UID Box */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-2">Phemex Account UID</div>
                {editingPhemexUID ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={phemexUID}
                      onChange={(e) => setPhemexUID(e.target.value)}
                      placeholder="Enter your Phemex UID"
                      className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={savePhemexUID}
                      disabled={savingUID}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {savingUID ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPhemexUID(false);
                        setPhemexUID(partnerData?.phemex_uid || '');
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-white">
                      {partnerData?.phemex_uid || 'Not set'}
                    </div>
                    <button
                      onClick={() => setEditingPhemexUID(true)}
                      className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Onboarding Bonus Box */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {partnerData?.customer_onboarding_bonus || 100} USDT
                </div>
                <div className="text-sm text-gray-400">Customer Onboarding Bonus</div>
              </div>
            </div>
          </div>

          {/* Profit Share Box */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {partnerData?.profit_share_rate || 2}%
                </div>
                <div className="text-sm text-gray-400">Profit Share</div>
              </div>
            </div>
          </div>

          {/* Rebates Box */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {partnerData?.rebate_rate || partnerData.commission_rate || 15}%
                </div>
                <div className="text-sm text-gray-400">Rebates</div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tutorials', label: 'Tutorials & Guides', icon: BookOpen },
              { id: 'marketing', label: 'Marketing Materials', icon: Award },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Affiliate Partner Invitation */}
            {partnerData.status === 'approved' && (
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">Trade4me Landing Page</h3>
                <p className="text-gray-300 mb-4">
                  Your personalized Trade4me landing page for promoting the strategy to customers. 
                  This page includes your referral link and tracks all conversions.
                </p>
                <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg mb-4">
                  {partnerData?.affiliate_referral_code ? (
                    <>
                      <code className="flex-1 text-orange-400 text-lg font-medium">
                        {window.location.origin}/trade4me/{partnerData?.affiliate_referral_code || 'LOADING'}
                      </code>
                      <button
                        onClick={() => {
                          const landingUrl = `${window.location.origin}/trade4me/${partnerData?.affiliate_referral_code}`;
                          navigator.clipboard.writeText(landingUrl);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy Landing Page Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const landingUrl = `${window.location.origin}/trade4me/${partnerData?.affiliate_referral_code}`;
                          window.open(landingUrl, '_blank');
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Open Landing Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1">
                      {!partnerData?.affiliate_referral_code ? (
                        <div className="text-sky-400 text-sm italic">
                          Affiliate code not generated yet - please contact admin
                        </div>
                      ) : (
                        <div className="text-orange-400 text-lg font-medium">
                          {window.location.origin}/trade4me/{partnerData?.affiliate_referral_code}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Kurzer Hinweis für einfaches Teilen */}
                {/* Affiliate Partner Invitation */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-bold text-blue-400 mb-3">Invite Affiliate Partners</h4>
                  <p className="text-gray-300 mb-4 text-sm">
                    Share this link to invite new partners to join Trade4me under your referral. 
                    You'll earn bonuses for each successful partner you refer.
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg mb-4">
                    <code className="flex-1 text-blue-400 text-base font-medium">
                      {window.location.origin}/register?affiliate={partnerData?.affiliate_referral_code || 'LOADING'}
                    </code>
                    <button
                      onClick={() => {
                        const affiliateUrl = `${window.location.origin}/register?affiliate=${partnerData?.affiliate_referral_code}`;
                        navigator.clipboard.writeText(affiliateUrl);
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy Affiliate Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const affiliateUrl = `${window.location.origin}/register?affiliate=${partnerData?.affiliate_referral_code}`;
                        window.open(affiliateUrl, '_blank');
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Open Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Affiliate Partners List */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Your Affiliate Partners ({affiliatePartners.length})</h4>
                    {loadingAffiliates && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    )}
                  </div>
                  
                  {affiliatePartners.length > 0 ? (
                    <div className="space-y-3">
                      {affiliatePartners.map((affiliate) => (
                        <div key={affiliate.id} className="bg-gray-700/30 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="text-white font-medium">{affiliate.name}</div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  affiliate.status === 'approved' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : affiliate.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  {affiliate.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400">{affiliate.email}</div>
                              {affiliate.company_name && (
                                <div className="text-sm text-gray-500">{affiliate.company_name}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400 capitalize">{affiliate.partner_type}</div>
                              <div className="text-xs text-gray-500">
                                Joined: {new Date(affiliate.created_at).toLocaleDateString('en-US')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-700/20 rounded-lg">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <h5 className="text-gray-400 font-medium mb-2">No Affiliate Partners Yet</h5>
                      <p className="text-gray-500 text-sm">
                        Share your affiliate link to start building your partner network.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Recent Activity */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Account Created</div>
                    <div className="text-sm text-gray-400">
                      {new Date(partnerData.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-green-400">+$0</div>
                </div>
                {isDemo && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Commission Earned</div>
                        <div className="text-sm text-gray-400">2 days ago</div>
                      </div>
                      <div className="text-green-400">+$125.50</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="text-white font-medium">New Referral</div>
                        <div className="text-sm text-gray-400">5 days ago</div>
                      </div>
                      <div className="text-blue-400">+1 Referral</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <TutorialsSection />
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <MarketingMaterialsSection />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Partner Type
                </label>
                <div className="text-white">{getPartnerTypeLabel(partnerData.partner_type)}</div>
              </div>
              
              {partnerData.company_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <div className="text-white">{partnerData.company_name}</div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="text-white">{currentUser?.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Since
                </label>
                <div className="text-white">
                  {new Date(partnerData.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;