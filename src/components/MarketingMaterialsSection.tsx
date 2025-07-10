import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Image, 
  FileText, 
  Video,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Eye,
  Calendar,
  Tag,
  Palette
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MarketingMaterial {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video' | 'banner' | 'social' | 'document';
  file_url: string;
  file_name: string;
  file_size: number | null;
  category: string;
  dimensions?: string;
  format: string;
  is_active: boolean;
  created_at: string;
}

const MarketingMaterialsSection: React.FC = () => {
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketingMaterials();
  }, []);

  const fetchMarketingMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching marketing materials:', error);
      // Set demo data if database fails
      setMaterials([
        {
          id: '1',
          title: 'Trade4me Strategy Banner',
          description: 'High-quality banner for website headers and social media',
          type: 'banner',
          file_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
          file_name: 'trade4me-banner-1200x400.jpg',
          file_size: 245000,
          category: 'web',
          dimensions: '1200x400',
          format: 'JPG',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Instagram Story Template',
          description: 'Ready-to-use Instagram story template with Trade4me branding',
          type: 'social',
          file_url: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=600',
          file_name: 'instagram-story-template.png',
          file_size: 180000,
          category: 'social',
          dimensions: '1080x1920',
          format: 'PNG',
          is_active: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Performance Infographic',
          description: 'Visual representation of Trade4me strategy performance',
          type: 'image',
          file_url: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=800',
          file_name: 'performance-infographic.png',
          file_size: 320000,
          category: 'marketing',
          dimensions: '800x1200',
          format: 'PNG',
          is_active: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          title: 'Partner Presentation Deck',
          description: 'Complete presentation for partner meetings and proposals',
          type: 'document',
          file_url: '/marketing/partner-presentation.pdf',
          file_name: 'partner-presentation-deck.pdf',
          file_size: 2500000,
          category: 'presentations',
          format: 'PDF',
          is_active: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          title: 'YouTube Thumbnail Template',
          description: 'Eye-catching thumbnail template for YouTube videos',
          type: 'image',
          file_url: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=800',
          file_name: 'youtube-thumbnail-template.png',
          file_size: 150000,
          category: 'social',
          dimensions: '1280x720',
          format: 'PNG',
          is_active: true,
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          title: 'Email Newsletter Template',
          description: 'Professional email template for partner communications',
          type: 'document',
          file_url: '/marketing/email-template.html',
          file_name: 'email-newsletter-template.html',
          file_size: 45000,
          category: 'email',
          format: 'HTML',
          is_active: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
      case 'banner':
        return Image;
      case 'video':
        return Video;
      case 'social':
        return Palette;
      case 'document':
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
      case 'banner':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'video':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'social':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'document':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategories = () => {
    const categories = [...new Set(materials.map(m => m.category))];
    return categories.sort();
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      web: 'Web Banners',
      social: 'Social Media',
      marketing: 'Marketing',
      presentations: 'Presentations',
      email: 'Email Templates',
      print: 'Print Materials'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filteredMaterials = materials.filter(material => {
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadMaterial = (material: MarketingMaterial) => {
    // Create download link
    const link = document.createElement('a');
    link.href = material.file_url;
    link.download = material.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Marketing Materials</h3>
          <p className="text-gray-400 text-sm">Professional marketing assets for your campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-700/30 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="banner">Banners</option>
              <option value="social">Social Media</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type);
          
          return (
            <div key={material.id} className="bg-gray-700/30 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors h-full flex flex-col">
              {/* Preview Image */}
              <div className="h-48 bg-gray-800 relative overflow-hidden flex-shrink-0">
                {material.type === 'image' || material.type === 'banner' || material.type === 'social' ? (
                  <img 
                    src={material.file_url} 
                    alt={material.title}
                    className="w-full h-full object-contain bg-gray-900"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TypeIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(material.type)}`}>
                    {material.type.toUpperCase()}
                  </span>
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => window.open(material.file_url, '_blank')}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.5rem]">{material.title}</h4>
                    {material.description && (
                      <p className="text-gray-400 text-sm line-clamp-3 flex-grow min-h-[4.5rem]">{material.description}</p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 mt-auto">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {getCategoryLabel(material.category)}
                  </div>
                  {material.dimensions && (
                    <div>{material.dimensions}</div>
                  )}
                  <div>{material.format}</div>
                  <div>{formatFileSize(material.file_size)}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => downloadMaterial(material)}
                    className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  
                  <button
                    onClick={() => copyLink(material.file_url, material.id)}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === material.id ? 'Copied!' : ''}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-400 mb-2">No Marketing Materials Found</h4>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your filters.'
              : 'No marketing materials available yet.'
            }
          </p>
        </div>
      )}

      {/* Usage Guidelines */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h4 className="text-blue-400 font-semibold mb-3">📋 Usage Guidelines</h4>
        <div className="space-y-2 text-blue-300/80 text-sm">
          <p>• All materials are pre-approved for partner use</p>
          <p>• Maintain original branding and messaging</p>
          <p>• Do not modify logos or core design elements</p>
          <p>• Add your partner referral links where appropriate</p>
          <p>• Contact support for custom material requests</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingMaterialsSection;