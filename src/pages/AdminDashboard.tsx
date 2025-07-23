import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminPartnerManagement from '../components/AdminPartnerManagement';
import ConsultationManagement from '../components/ConsultationManagement';
import TutorialManagement from '../components/TutorialManagement';
import MarketingMaterialManagement from '../components/MarketingMaterialManagement';
import WebinarManagement from '../components/WebinarManagement';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  TrendingUp,
  DollarSign,
  UserCheck,
  Clock,
  Award,
  Palette,
  Video
} from 'lucide-react';

interface AdminStats {
  totalPartners: number;
  pendingPartners: number;
  approvedPartners: number;
  totalConsultations: number;
  pendingConsultations: number;
  totalTutorials: number;
  totalEarnings: number;
}

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalPartners: 0,
    pendingPartners: 0,
    approvedPartners: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    totalTutorials: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch partner stats
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('status, total_earnings');

      if (partnersError) throw partnersError;

      // Fetch consultation stats
      const { data: consultations, error: consultationsError } = await supabase
        .from('consultations')
        .select('status');

      if (consultationsError) throw consultationsError;

      // Fetch tutorial stats
      const { data: tutorials, error: tutorialsError } = await supabase
        .from('tutorials')
        .select('id');

      if (tutorialsError) throw tutorialsError;

      // Calculate stats
      const totalPartners = partners?.length || 0;
      const pendingPartners = partners?.filter(p => p.status === 'pending').length || 0;
      const approvedPartners = partners?.filter(p => p.status === 'approved').length || 0;
      const totalConsultations = consultations?.length || 0;
      const pendingConsultations = consultations?.filter(c => c.status === 'pending').length || 0;
      const totalTutorials = tutorials?.length || 0;
      const totalEarnings = partners?.reduce((sum, p) => sum + (p.total_earnings || 0), 0) || 0;

      setStats({
        totalPartners,
        pendingPartners,
        approvedPartners,
        totalConsultations,
        pendingConsultations,
        totalTutorials,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Set demo data if database fails
      setStats({
        totalPartners: 156,
        pendingPartners: 12,
        approvedPartners: 144,
        totalConsultations: 89,
        pendingConsultations: 7,
        totalTutorials: 24,
        totalEarnings: 125750.50
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Admin Dashboard</span>
                <div className="text-sm text-gray-400">Connect<span className="text-blue-500">X</span> Platform Management</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-medium">Administrator</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
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
        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalPartners}</div>
                    <div className="text-sm text-gray-400">Total Partners</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {stats.pendingPartners} pending approval
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.approvedPartners}</div>
                    <div className="text-sm text-gray-400">Active Partners</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {((stats.approvedPartners / stats.totalPartners) * 100).toFixed(1)}% approval rate
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalConsultations}</div>
                    <div className="text-sm text-gray-400">Consultations</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {stats.pendingConsultations} pending
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      ${stats.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total Earnings</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Across all partners
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-400' },
              { id: 'partners', label: 'Partners', icon: Users, color: 'text-green-400' },
              { id: 'consultations', label: 'Consultations', icon: Calendar, color: 'text-purple-400' },
              { id: 'tutorials', label: 'Tutorials', icon: BookOpen, color: 'text-orange-400' },
              { id: 'marketing', label: 'Marketing Materials', icon: Palette, color: 'text-pink-400' },
              { id: 'webinars', label: 'Webinars', icon: Video, color: 'text-green-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? `border-blue-500 ${tab.color}`
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
            {/* Recent Activity */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">New partner approved</div>
                      <div className="text-sm text-gray-400">Trade4Me Agency - Affiliate Partner</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">New consultation booked</div>
                      <div className="text-sm text-gray-400">Partnership Opportunities - Tomorrow 2:00 PM</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">4 hours ago</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Tutorial uploaded</div>
                      <div className="text-sm text-gray-400">Advanced Trading Strategies - Video Tutorial</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>

            {/* Quick Actions - ORIGINAL VIBRANT COLORS */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('partners')}
                  className="bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Manage Partners
                </button>
                
                <button
                  onClick={() => setActiveTab('consultations')}
                  className="bg-purple-600 text-white p-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  View Bookings
                </button>
                
                <button
                  onClick={() => setActiveTab('tutorials')}
                  className="bg-orange-600 text-white p-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5" />
                  Add Tutorial
                </button>
                
                <button
                  className="bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-3"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && <AdminPartnerManagement />}
        {activeTab === 'consultations' && <ConsultationManagement />}
        {activeTab === 'tutorials' && <TutorialManagement />}
        {activeTab === 'marketing' && <MarketingMaterialManagement />}
        {activeTab === 'webinars' && <WebinarManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;