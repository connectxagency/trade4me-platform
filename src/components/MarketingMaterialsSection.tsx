import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  X,
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

interface PreviewModalProps {
  material: MarketingMaterial | null;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ material, isOpen, onClose }) => {
  if (!isOpen || !material) return null;

  const isImage = material.type === 'image' || material.type === 'banner' || material.type === 'social';
  const isVideo = material.type === 'video';
  const isDocument = material.type === 'document';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-white">{material.title}</h3>
            <p className="text-sm text-gray-400">{material.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {isImage && (
            <div className="flex justify-center">
              <img 
                src={material.file_url} 
                alt={material.title}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          )}

          {isVideo && (
            <div className="flex justify-center">
              <video 
                controls 
                className="max-w-full max-h-[60vh] rounded-lg"
                poster={material.file_url}
              >
                <source src={material.file_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {isDocument && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Document Preview</h4>
              <p className="text-gray-400 mb-6">
                {material.file_name} ({material.format})
              </p>
              <button
                onClick={() => window.open(material.file_url, '_blank')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Open Document
              </button>
            </div>
          )}
        </div>

        {/* Footer with Details */}
        <div className="border-t border-gray-700 p-4 bg-gray-700/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-400">
              <span>Category: {getCategoryLabel(material.category)}</span>
              {material.dimensions && <span>Size: {material.dimensions}</span>}
              <span>Format: {material.format}</span>
              {material.file_size && (
                <span>File Size: {formatFileSize(material.file_size)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = material.file_url;
                  link.download = material.file_name;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      web: 'Web Banners',
      social: 'Social Media',
      marketing: 'Marketing',
      presentations: 'Presentations',
      email: 'Email Templates',
      print: 'Print Materials'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  function formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  }
};

interface MarketingMaterialsSectionProps {
  cachedData?: MarketingMaterial[];
}

const MarketingMaterialsSection: React.FC<MarketingMaterialsSectionProps> = ({ cachedData = [] }) => {
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<MarketingMaterial | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 6; // Load 6 items at a time

  // Initialize with cached data if available
  useEffect(() => {
    if (cachedData && cachedData.length >= 0) {
      setMaterials(cachedData);
      setHasLoaded(true);
      setLoading(false);
      setHasMore(cachedData.length > ITEMS_PER_PAGE);
    } else if (cachedData === undefined) {
      // Only fetch if no cached data is provided
      fetchMarketingMaterials(1, false);
    }
  }, [cachedData]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchMarketingMaterials = useCallback(async (page = 1, append = false) => {
    if (hasLoaded && page === 1) return; // Prevent multiple fetches for first page
    
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Calculate offset for pagination
      const offset = (page - 1) * ITEMS_PER_PAGE;
      
      const { data, error } = await supabase
        .from('marketing_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) throw error;
      
      if (append) {
        setMaterials(prev => [...prev, ...(data || [])]);
      } else {
        setMaterials(data || []);
      }
      
      // Check if there are more items
      setHasMore((data || []).length === ITEMS_PER_PAGE);
      
      if (page === 1) {
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching marketing materials:', error);
      // No fallback data - just set empty array
      if (page === 1) {
        setMaterials([]);
        setHasMore(false);
        setHasLoaded(true);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasLoaded]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMarketingMaterials(nextPage, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchMarketingMaterials]);

  // Reset pagination when filters change
  useEffect(() => {
    // Only reset if we don't have cached data
    if (!cachedData || cachedData.length === 0) {
      setCurrentPage(1);
      setHasMore(true);
      setMaterials([]);
      setHasLoaded(false);
      fetchMarketingMaterials(1, false);
    }
  }, [selectedCategory, selectedType, searchTerm]); // Removed cachedData dependency

  // Memoize utility functions
  const formatFileSize = useCallback((bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  }, []);

  const getTypeIcon = useCallback((type: string) => {
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
  }, []);

  const getTypeColor = useCallback((type: string) => {
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
  }, []);

  const getCategories = useMemo(() => {
    const categories = [...new Set(materials.map(m => m.category))];
    return categories.sort();
  }, [materials]);

  const getCategoryLabel = useCallback((category: string) => {
    const labels: Record<string, string> = {
      web: 'Web Banners',
      social: 'Social Media',
      marketing: 'Marketing',
      presentations: 'Presentations',
      email: 'Email Templates',
      print: 'Print Materials'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }, []);

  // Memoize filtered materials to prevent unnecessary re-computations
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesType = selectedType === 'all' || material.type === selectedType;
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [materials, selectedCategory, selectedType, searchTerm]);

  const copyLink = useCallback((url: string, id: string) => {
    copyImageToClipboard(url, id);
  }, []);

  const copyImageToClipboard = useCallback(async (imageUrl: string, materialId: string) => {
    try {
      // For images, copy the actual image data
      if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Check if it's an image
        if (blob.type.startsWith('image/')) {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ]);
          setCopied(materialId);
          setTimeout(() => setCopied(null), 2000);
        } else {
          // Fallback to copying URL for non-images
          await navigator.clipboard.writeText(imageUrl);
          setCopied(materialId);
          setTimeout(() => setCopied(null), 2000);
        }
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(imageUrl);
        setCopied(materialId);
        setTimeout(() => setCopied(null), 2000);
      }
    } catch (error) {
      console.error('Failed to copy image:', error);
      // Fallback to copying URL if image copy fails
      try {
        await navigator.clipboard.writeText(imageUrl);
        setCopied(materialId);
        setTimeout(() => setCopied(null), 2000);
      } catch (urlError) {
        console.error('Failed to copy URL as fallback:', urlError);
        alert('Copy failed. Please try downloading the image instead.');
      }
    }
  }, []);

  const openPreview = useCallback((material: MarketingMaterial) => {
    setPreviewMaterial(material);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewMaterial(null);
  }, []);

  const downloadMaterial = useCallback((material: MarketingMaterial) => {
    // Create download link
    const link = document.createElement('a');
    link.href = material.file_url;
    link.download = material.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading && materials.length === 0 && !hasLoaded) {
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
              {getCategories.map(category => (
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
                    loading="lazy"
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
                    onClick={() => openPreview(material)}
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
                    title="Copy Image"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === material.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              'Load More Materials'
            )}
          </button>
        </div>
      )}

      {filteredMaterials.length === 0 && !loading && (
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

      {/* Preview Modal */}
      <PreviewModal
        material={previewMaterial}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />

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