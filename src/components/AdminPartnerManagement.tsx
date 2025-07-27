import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit, Trash2, Save, X, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';

// Import logos
import phemexLogo from '../assets/phemex-logo.png';
import trade4meLogo from '../assets/trade4me-logo-final.png';
import connectXLogo from '../assets/ConnectX-logo.png';

interface Partner {
  id: string;
  user_id: string;
  partner_type: string;
  company_name: string | null;
  website_url: string | null;
  social_media_links: string | null;
  audience_size: number | null;
  experience_level: string;
  preferred_strategies: string | null;
  status: string;
  commission_rate: number | null;
  total_earnings: number | null;
  total_referrals: number | null;
  created_at: string | null;
  updated_at: string | null;
  partner_referral_link: string | null;
  phemex_uid: string | null;
  customer_onboarding_bonus: number | null;
  profit_share_rate: number | null;
  rebate_rate: number | null;
  affiliate_referral_code: string | null;
}

export default function AdminPartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({
          status: partner.status,
          commission_rate: partner.commission_rate,
          partner_referral_link: partner.partner_referral_link,
          phemex_uid: partner.phemex_uid,
          customer_onboarding_bonus: partner.customer_onboarding_bonus,
          profit_share_rate: partner.profit_share_rate,
          rebate_rate: partner.rebate_rate,
        })
        .eq('id', partner.id);

      if (error) throw error;
      
      await fetchPartners();
      setEditingPartner(null);
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  const deletePartner = async (partnerId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this partner?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (error) throw error;
      await fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSocialMediaLinks = (links: string | null) => {
    if (!links) return [];
    return links.split('\n').filter(link => link.trim());
  };

  const formatStrategies = (strategies: string | null) => {
    if (!strategies) return [];
    return strategies.split(',').map(s => s.trim());
  };

  const togglePartnerExpansion = (partnerId: string) => {
    const newExpanded = new Set(expandedPartners);
    if (newExpanded.has(partnerId)) {
      newExpanded.delete(partnerId);
    } else {
      newExpanded.add(partnerId);
    }
    setExpandedPartners(newExpanded);
  };

  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const searchableFields = [
      partner.company_name || '',
      partner.affiliate_referral_code || '',
      partner.partner_type || '',
      partner.status || '',
      partner.experience_level || '',
      partner.phemex_uid || '',
      partner.website_url || '',
      partner.social_media_links || '',
      partner.preferred_strategies || '',
      partner.id || '',
      partner.user_id || ''
    ];
    
    return searchableFields.some(field => 
      field.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Partner Management</h2>
        <div className="text-sm text-gray-400">
          Total Partners: {partners.length}
          {searchTerm && (
            <div className="text-xs text-blue-400 mt-1">
              Showing {filteredPartners.length} of {partners.length} partners
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search partners by name, code, type, status, UID, website, or strategies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {editingPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Partner</h3>
              <button
                onClick={() => setEditingPartner(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={editingPartner.status}
                  onChange={(e) => setEditingPartner(prev => prev ? { ...prev, status: e.target.value } : null)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPartner.commission_rate || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, commission_rate: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Onboarding Bonus ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPartner.customer_onboarding_bonus || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, customer_onboarding_bonus: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profit Share Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPartner.profit_share_rate || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, profit_share_rate: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rebate Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPartner.rebate_rate || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, rebate_rate: parseFloat(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    Partner Referral Link 
                    <img src={phemexLogo} alt="Phemex" className="h-4 w-auto" />
                  </label>
                  <input
                    type="url"
                    value={editingPartner.partner_referral_link || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, partner_referral_link: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=partner-code"
                  />
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 flex-wrap">
                    Direct link to 
                    <img src={trade4meLogo} alt="Trade4me" className="h-3 w-auto" />
                    strategy on 
                    <img src={phemexLogo} alt="Phemex" className="h-3 w-auto" />
                    with partner's referral code
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <img src={phemexLogo} alt="Phemex" className="h-4 w-auto" />
                    UID
                  </label>
                  <input
                    type="text"
                    value={editingPartner.phemex_uid || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, phemex_uid: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345678"
                  />
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 flex-wrap">
                    Partner's 
                    <img src={phemexLogo} alt="Phemex" className="h-3 w-auto" />
                    Account UID for commission tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPartner(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updatePartner(editingPartner)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-gray-800 rounded-lg border border-gray-700/50">
            {/* Partner Header */}
            <div className="bg-gray-700 px-6 py-4 flex items-center justify-between border-b border-gray-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-lg">
                    {(partner.company_name || 'Individual Partner').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {partner.company_name || 'Individual Partner'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {partner.partner_type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      partner.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      partner.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {partner.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Code: {partner.affiliate_referral_code}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePartnerExpansion(partner.id)}
                  className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-600/50 rounded-lg"
                  title={expandedPartners.has(partner.id) ? "Show Less Details" : "Show More Details"}
                >
                  {expandedPartners.has(partner.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditingPartner(partner)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 rounded-lg"
                  title="Edit Partner"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePartner(partner.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 rounded-lg"
                  title="Delete Partner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Partner Details Grid */}
            <div className="p-6">
              {/* Always Visible Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {/* Quick Stats */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-green-400 font-semibold text-lg">
                      ${partner.total_earnings?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-400">
                      {partner.total_referrals || 0} referrals
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Contact</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-white">
                      {partner.experience_level} level
                    </div>
                    <div className="text-gray-400">
                      {partner.audience_size?.toLocaleString() || 'N/A'} audience
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Commission</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-white">
                      {partner.commission_rate || 0}% rate
                    </div>
                    <div className="text-green-400">
                      ${partner.customer_onboarding_bonus || 0} bonus
                    </div>
                  </div>
                </div>

                {/* Phemex Status */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
                    <img src={phemexLogo} alt="Phemex" className="h-3 w-auto" /> Status
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-white">
                      UID: {partner.phemex_uid || 'Not set'}
                    </div>
                    <div className={partner.partner_referral_link ? "text-green-400" : "text-red-400"}>
                      {partner.partner_referral_link ? "✓ Linked" : "Not linked"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Detailed View */}
              {expandedPartners.has(partner.id) && (
                <div className="border-t border-gray-600 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* System IDs */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    System IDs
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Partner ID:</span>
                      <span className="text-white ml-2 font-mono text-xs">{partner.id.substring(0, 8)}...</span>
                    </div>
                    <div>
                      <span className="text-gray-400">User ID:</span>
                      <span className="text-white ml-2 font-mono text-xs">{partner.user_id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Links */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Contact & Links
                  </h4>
                  <div className="space-y-2 text-sm">
                    {partner.website_url ? (
                      <div>
                        <span className="text-gray-400">Website:</span>
                        <a 
                          href={partner.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 ml-2 text-xs break-all"
                        >
                          {partner.website_url}
                        </a>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs">No website provided</div>
                    )}
                    
                    {partner.social_media_links ? (
                      <div>
                        <span className="text-gray-400">Social Media:</span>
                        <div className="mt-1 space-y-1">
                          {formatSocialMediaLinks(partner.social_media_links).map((link, index) => (
                            <a 
                              key={index}
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-blue-400 hover:text-blue-300 text-xs break-all"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs">No social media provided</div>
                    )}
                  </div>
                </div>

                {/* Additional Rates */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Additional Rates
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Profit Share:</span>
                      <span className="text-white ml-2">{partner.profit_share_rate || 0}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rebate Rate:</span>
                      <span className="text-white ml-2">{partner.rebate_rate || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* Preferred Strategies */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Preferred Strategies
                  </h4>
                  <div>
                    {partner.preferred_strategies ? (
                      <div className="space-y-1">
                        {formatStrategies(partner.preferred_strategies).map((strategy, index) => (
                          <span key={index} className="inline-block bg-gray-600 text-white text-xs px-2 py-1 rounded mr-1 mb-1">
                            {strategy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">No strategies specified</span>
                    )}
                  </div>
                </div>

                {/* Full Phemex Details */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <img src={phemexLogo} alt="Phemex" className="h-3 w-auto" /> Full Integration
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Referral Link:</span>
                      <div className="mt-1">
                        {partner.partner_referral_link ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 text-xs">✓ Configured</span>
                              <button
                                onClick={() => window.open(partner.partner_referral_link!, '_blank')}
                                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Open Referral Link"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-400 break-all">
                              {partner.partner_referral_link}
                            </div>
                          </div>
                        ) : (
                          <span className="text-red-400 text-xs">Not configured</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Timestamps
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white ml-2">{formatDate(partner.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Updated:</span>
                      <span className="text-white ml-2">{formatDate(partner.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Landing Page */}
                {partner.partner_referral_link && partner.affiliate_referral_code && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      Landing Page
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-xs">
                        Custom <img src={trade4meLogo} alt="Trade4me" className="h-3 w-auto inline" /> landing page
                      </p>
                      <button
                        onClick={() => {
                          const landingUrl = `${window.location.origin}/trade4me/${partner.affiliate_referral_code}`;
                          window.open(landingUrl, '_blank');
                        }}
                        className="w-full px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Landing Page
                      </button>
                    </div>
                  </div>
                )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {partners.length === 0 && !searchTerm && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Partners Yet</h3>
            <p className="text-gray-500">Partners who register will appear here with all their details.</p>
          </div>
        )}

        {filteredPartners.length === 0 && searchTerm && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400 text-2xl w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Partners Found</h3>
            <p className="text-gray-500">
              No partners match your search for "{searchTerm}". Try adjusting your search terms.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}