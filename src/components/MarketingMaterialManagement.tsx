import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image, 
  FileText, 
  Video,
  Eye, 
  EyeOff,
  Save,
  X,
  Download,
  Palette,
  Tag,
  Monitor,
  Smartphone
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
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface MaterialFormData {
  title: string;
  description: string;
  type: 'image' | 'video' | 'banner' | 'social' | 'document';
  category: string;
  dimensions: string;
  format: string;
  is_active: boolean;
  sort_order: string;
}

const MarketingMaterialManagement: React.FC = () => {
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketingMaterial | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    description: '',
    type: 'image',
    category: 'web',
    dimensions: '',
    format: '',
    is_active: true,
    sort_order: '0'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = [
    { value: 'web', label: 'Web Banners' },
    { value: 'social', label: 'Social Media' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'presentations', label: 'Presentations' },
    { value: 'email', label: 'Email Templates' },
    { value: 'print', label: 'Print Materials' }
  ];

  const materialTypes = [
    { value: 'image', label: 'Image', icon: Image },
    { value: 'banner', label: 'Banner', icon: Monitor },
    { value: 'social', label: 'Social Media', icon: Smartphone },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'document', label: 'Document', icon: FileText }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_materials')
        .select('*')
        .order('sort_order')
        .order('created_at');

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
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields first
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.type) {
      alert('Please select a type');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (!selectedFile && !editingMaterial) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      let fileUrl = editingMaterial?.file_url || '';
      let fileName = editingMaterial?.file_name || '';
      let fileSize = editingMaterial?.file_size || null;
      let fileFormat = editingMaterial?.format || formData.format;

      // Handle file upload
      if (selectedFile) {
        // Convert file to base64 for storage
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        
        fileUrl = base64;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        fileFormat = selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem(`marketing_material_${fileName}`, base64);
        } catch (error) {
          console.warn('Failed to store file in localStorage:', error);
        }
      }

      const materialData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        category: formData.category,
        dimensions: formData.dimensions || null,
        format: fileFormat,
        is_active: formData.is_active,
        sort_order: parseInt(formData.sort_order)
      };

      if (editingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from('marketing_materials')
          .update(materialData)
          .eq('id', editingMaterial.id);

        if (error) throw error;
      } else {
        // Create new material
        const { error } = await supabase
          .from('marketing_materials')
          .insert(materialData);

        if (error) throw error;
      }

      await fetchMaterials();
      resetForm();
      alert(`Marketing material ${editingMaterial ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving marketing material:', error);
      alert('Error saving marketing material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (material: MarketingMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      type: material.type,
      category: material.category,
      dimensions: material.dimensions || '',
      format: material.format,
      is_active: material.is_active,
      sort_order: material.sort_order.toString()
    });
    setShowForm(true);
  };

  const handleDeleteMaterial = async (materialId: string, materialTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${materialTitle}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('marketing_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
      await fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Error deleting material. Please try again.');
    }
  };

  const toggleActive = async (material: MarketingMaterial) => {
    try {
      const { error } = await supabase
        .from('marketing_materials')
        .update({ is_active: !material.is_active })
        .eq('id', material.id);

      if (error) throw error;
      await fetchMaterials();
    } catch (error) {
      console.error('Error updating material status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'image',
      category: 'web',
      dimensions: '',
      format: '',
      is_active: true,
      sort_order: '0'
    });
    setSelectedFile(null);
    setEditingMaterial(null);
    setShowForm(false);
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

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.label || category;
  };

  const getTypeIcon = (type: string) => {
    const typeObj = materialTypes.find(t => t.value === type);
    return typeObj?.icon || FileText;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketing Material Management</h2>
          <p className="text-gray-400">Manage marketing assets for partners</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingMaterial ? 'Edit Marketing Material' : 'Add New Marketing Material'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Material title"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={uploading}
                >
                  {materialTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Material description"
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={uploading}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="1200x400"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Upload {!editingMaterial && '*'}
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploading 
                  ? 'border-gray-500 bg-gray-800/50' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.html"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className={`font-medium transition-colors ${
                      uploading 
                        ? 'cursor-not-allowed text-gray-500' 
                        : 'cursor-pointer text-purple-400 hover:text-purple-300'
                    }`}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Click to upload file'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: Images, Videos, PDFs, Documents (max 50MB recommended)
                </p>
                {selectedFile && (
                  <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 text-sm">Selected: {selectedFile.name}</p>
                    <p className="text-green-300 text-xs">Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                )}
                {editingMaterial && !selectedFile && (
                  <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                    <p className="text-purple-400 text-sm">Current: {editingMaterial.file_name}</p>
                    <p className="text-purple-300 text-xs">Size: {formatFileSize(editingMaterial.file_size)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                disabled={uploading}
              />
              <label htmlFor="is_active" className="text-sm text-gray-300">
                Active (visible to partners)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Saving...' : editingMaterial ? 'Update Material' : 'Create Material'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">All Marketing Materials ({materials.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Preview</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Dimensions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {materials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                
                return (
                  <tr key={material.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden">
                        {(material.type === 'image' || material.type === 'banner' || material.type === 'social') ? (
                          <img 
                            src={material.file_url} 
                            alt={material.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">{material.title}</div>
                        {material.description && (
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            {material.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(material.type)}`}>
                        {material.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      {getCategoryLabel(material.category)}
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      {material.dimensions || '-'}
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      {formatFileSize(material.file_size)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(material)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          material.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {material.is_active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(material)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(material.file_url, '_blank')}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          title="Preview"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            console.log('DELETE MATERIAL CLICKED:', material.id);
                            handleDeleteMaterial(material.id, material.title);
                          }}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title={`Delete ${material.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {materials.length === 0 && (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-400 mb-2">No Marketing Materials Yet</h4>
            <p className="text-gray-500">Create your first marketing material to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingMaterialManagement;