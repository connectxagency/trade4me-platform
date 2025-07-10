import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';

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
        </div>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Partner Referral Link (Phemex)
                  </label>
                  <input
                    type="url"
                    value={editingPartner.partner_referral_link || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, partner_referral_link: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=partner-code"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Direct link to Trade4me strategy on Phemex with partner's referral code
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phemex UID
                  </label>
                  <input
                    type="text"
                    value={editingPartner.phemex_uid || ''}
                    onChange={(e) => setEditingPartner(prev => prev ? { ...prev, phemex_uid: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345678"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Partner's Phemex Account UID for commission tracking
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

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Partner Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Referral Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phemex UID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-white font-medium">
                        {partner.company_name || 'Individual Partner'}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Code: {partner.affiliate_referral_code}
                      </div>
                      {partner.website_url && (
                        <div className="text-blue-400 text-sm">
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                            {partner.website_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {partner.partner_type}
                      </span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          partner.status === 'approved' ? 'bg-green-100 text-green-800' :
                          partner.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        } ${
                          partner.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          partner.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}>
                          {partner.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    <div className="space-y-1">
                      <div>Rate: {partner.commission_rate || 0}%</div>
                      <div>Bonus: ${partner.customer_onboarding_bonus || 0}</div>
                      <div>Profit: {partner.profit_share_rate || 0}%</div>
                      <div>Rebate: {partner.rebate_rate || 0}%</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    {partner.partner_referral_link ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs">✓ Configured</span>
                        <button
                          onClick={() => window.open(partner.partner_referral_link!, '_blank')}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Open Referral Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-red-400 text-xs">Not configured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    {partner.phemex_uid || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {/* Landing Page Link */}
                    {partner.partner_referral_link && partner.affiliate_referral_code && (
                      <div className="mb-2">
                        <button
                          onClick={() => {
                            const landingUrl = `${window.location.origin}/trade4me/${partner.affiliate_referral_code}`;
                            window.open(landingUrl, '_blank');
                          }}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="View Landing Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit Partner"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePartner(partner.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No partners found.</p>
          </div>
        )}
      </div>
    </div>
  );
}