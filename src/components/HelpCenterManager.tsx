import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  BookOpen,
  FileText,
  Video,
  Eye, 
  EyeOff,
  Search,
  Filter,
  Upload,
  AlertCircle,
  Info,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

interface HelpItem {
  id: string;
  title: string;
  description: string | null;
  type: 'text' | 'video' | 'pdf';
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: bigint | null;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HelpItemFormData {
  title: string;
  description: string;
  type: 'text' | 'video' | 'pdf'; 
  content: string;
  category: string;
  is_active: boolean;
}

const HelpCenterManager: React.FC = () => {
  const navigate = useNavigate();
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<HelpItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Add state for file upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<HelpItemFormData>({
    title: '',
    description: '',
    type: 'text',
    content: '',
    category: 'general',
    is_active: true
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'features', label: 'Features' },
    { value: 'troubleshooting', label: 'Troubleshooting' },
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' }
  ];

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchHelpItems = async () => {
    try {
      const { data, error } = await supabase
        .from('help_center')
        .select('*')
        .order('category')
        .order('created_at');

      if (error) throw error;
      console.log('Fetched help items:', data);
      setHelpItems(data || []);
    } catch (error) {
      console.error('Error fetching help items:', error);
      console.log('Setting demo data due to fetch error');
      // Set demo data if database fails
      setHelpItems([
        {
          id: '1',
          title: 'Getting Started Guide',
          description: 'Learn the basics of using our platform',
          type: 'text' as const,
          content: 'Welcome to our platform! This guide will help you get started...',
          file_url: null,
          file_name: null,
          file_size: null,
          category: 'getting-started',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Video Tutorial: Dashboard Overview',
          description: 'A comprehensive video walkthrough of the dashboard',
          type: 'video' as const,
          content: null,
          file_url: 'https://example.com/video.mp4',
          file_name: 'dashboard-overview.mp4',
          file_size: BigInt(15728640),
          category: 'features',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpItems();
    
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'text',
      content: '',
      category: 'general',
      is_active: true
    });
    setEditingItem(null);
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields first
    if (!formData.title || !formData.title.trim()) {
      // Show validation error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.bottom = '20px';
      errorNotification.style.right = '20px';
      errorNotification.style.backgroundColor = '#EF4444';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '12px 20px';
      errorNotification.style.borderRadius = '8px';
      errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorNotification.style.zIndex = '9999';
      errorNotification.textContent = 'Please enter a title for the help item';
      document.body.appendChild(errorNotification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
      return;
    }

    if (formData.type === 'text' && (!formData.content || !formData.content.trim())) {
      // Show validation error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.bottom = '20px';
      errorNotification.style.right = '20px';
      errorNotification.style.backgroundColor = '#EF4444';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '12px 20px';
      errorNotification.style.borderRadius = '8px';
      errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorNotification.style.zIndex = '9999';
      errorNotification.textContent = 'Please enter content for text articles';
      document.body.appendChild(errorNotification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
      return;
    }

    if (formData.type !== 'text' && !selectedFile && !editingItem?.file_url) {
      // Show validation error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.bottom = '20px';
      errorNotification.style.right = '20px';
      errorNotification.style.backgroundColor = '#EF4444';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '12px 20px';
      errorNotification.style.borderRadius = '8px';
      errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorNotification.style.zIndex = '9999';
      errorNotification.textContent = `Please select a ${formData.type} file to upload`;
      document.body.appendChild(errorNotification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
      return;
    }

    setUploading(true);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      let fileUrl = editingItem?.file_url || null;
      let fileName = editingItem?.file_name || '';
      let fileSize = editingItem?.file_size ? Number(editingItem.file_size) : 0;

      // Handle file upload
      if (selectedFile) {
        // Check file size
        const maxVideoSize = 25 * 1024 * 1024; // 25MB for WebContainer environment
        const maxPdfSize = 5 * 1024 * 1024; // 5MB
        
        if (formData.type === 'video' && selectedFile.size > maxVideoSize) {
          // Show file size error notification
          const errorNotification = document.createElement('div');
          errorNotification.style.position = 'fixed';
          errorNotification.style.bottom = '20px';
          errorNotification.style.right = '20px';
          errorNotification.style.backgroundColor = '#EF4444';
          errorNotification.style.color = 'white';
          errorNotification.style.padding = '12px 20px';
          errorNotification.style.borderRadius = '8px';
          errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          errorNotification.style.zIndex = '9999';
          errorNotification.textContent = `Video file is too large. Maximum size is 25MB in this environment.`;
          document.body.appendChild(errorNotification);
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            document.body.removeChild(errorNotification);
          }, 5000);
          setUploading(false);
          setIsUploading(false);
          return;
        }
        
        if (formData.type === 'pdf' && selectedFile.size > maxPdfSize) {
          // Show file size error notification
          const errorNotification = document.createElement('div');
          errorNotification.style.position = 'fixed';
          errorNotification.style.bottom = '20px';
          errorNotification.style.right = '20px';
          errorNotification.style.backgroundColor = '#EF4444';
          errorNotification.style.color = 'white';
          errorNotification.style.padding = '12px 20px';
          errorNotification.style.borderRadius = '8px';
          errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          errorNotification.style.zIndex = '9999';
          errorNotification.textContent = 'PDF file is too large. Maximum size is 5MB.';
          document.body.appendChild(errorNotification);
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            document.body.removeChild(errorNotification);
          }, 5000);
          setUploading(false);
          setIsUploading(false);
          return;
        }

        // Convert file to base64 for storage in database
        try {
          // Read file as base64
          const reader = new FileReader();
          fileUrl = await new Promise((resolve, reject) => {
            reader.onload = () => {
              setUploadProgress(100);
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error('Failed to read file'));
            };
            reader.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
              }
            };
            reader.readAsDataURL(selectedFile);
          });
          
          fileName = selectedFile.name;
          fileSize = selectedFile.size;
        } catch (error) {
          console.error('Error converting file to base64:', error);
          
          // Show file processing error notification
          const errorNotification = document.createElement('div');
          errorNotification.style.position = 'fixed';
          errorNotification.style.bottom = '20px';
          errorNotification.style.right = '20px';
          errorNotification.style.backgroundColor = '#EF4444';
          errorNotification.style.color = 'white';
          errorNotification.style.padding = '12px 20px';
          errorNotification.style.borderRadius = '8px';
          errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          errorNotification.style.zIndex = '9999';
          errorNotification.textContent = `Error processing file: ${error instanceof Error ? error.message : 'Please try again.'}`;
          document.body.appendChild(errorNotification);
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            document.body.removeChild(errorNotification);
          }, 5000);
          setUploading(false);
          setIsUploading(false);
          return;
        }
      }

      const helpItemData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type as 'text' | 'video' | 'pdf',
        content: formData.type === 'text' ? formData.content : null,
        file_url: formData.type !== 'text' ? fileUrl : null,
        file_name: formData.type !== 'text' ? fileName : null,
        file_size: formData.type !== 'text' ? fileSize : null,
        category: formData.category,
        is_active: formData.is_active
      };      

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('help_center')
          .update(helpItemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('help_center')
          .insert([helpItemData]);

        if (error) throw error;
      }

      console.log('Help item saved successfully');
      await fetchHelpItems();
      resetForm();
      // Use a non-blocking notification instead of alert to prevent navigation issues
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#10B981';
      notification.style.color = 'white';
      notification.style.padding = '12px 20px';
      notification.style.borderRadius = '8px';
      notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      notification.style.zIndex = '9999';
      notification.textContent = `Help item ${editingItem ? 'updated' : 'created'} successfully!`;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error saving help item:', error instanceof Error ? error.message : error);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.bottom = '20px';
      errorNotification.style.right = '20px';
      errorNotification.style.backgroundColor = '#EF4444';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '12px 20px';
      errorNotification.style.borderRadius = '8px';
      errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorNotification.style.zIndex = '9999';
      errorNotification.textContent = `Error saving help item: ${error instanceof Error ? error.message : 'Please try again.'}`;
      document.body.appendChild(errorNotification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
    } finally {
      setIsUploading(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (item: HelpItem) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      content: item.content || '',
      category: item.category,
      is_active: item.is_active
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDeleteItem = async (itemId: string, itemTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${itemTitle}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('help_center')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchHelpItems();
      
      // Show success notification
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#10B981';
      notification.style.color = 'white';
      notification.style.padding = '12px 20px';
      notification.style.borderRadius = '8px';
      notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      notification.style.zIndex = '9999';
      notification.textContent = `Help item deleted successfully!`;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error('Error deleting help item:', error instanceof Error ? error.message : error);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.bottom = '20px';
      errorNotification.style.right = '20px';
      errorNotification.style.backgroundColor = '#EF4444';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '12px 20px';
      errorNotification.style.borderRadius = '8px';
      errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorNotification.style.zIndex = '9999';
      errorNotification.textContent = `Error deleting help item: ${error instanceof Error ? error.message : 'Please try again.'}`;
      document.body.appendChild(errorNotification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
    }
  };

  const toggleActive = async (item: HelpItem) => {
    try {
      console.log('Toggling active state for item:', item.id);
      const { error } = await supabase
        .from('help_center')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      await fetchHelpItems();
    } catch (error) {
      console.error('Error updating help item status:', error instanceof Error ? error.message : error);
    }
  };

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading help center...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Help Center Manager</h1>
            <p className="text-gray-400">Manage help articles, videos, and documentation</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Help Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search help items..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Help Item' : 'Add New Help Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter help item title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the help item"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'text' | 'video' | 'pdf' })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text Article</option>
                      <option value="video">Video</option>
                      <option value="pdf">PDF Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.type === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the help article content"
                      rows={8}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      File Upload *
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept={formData.type === 'video' ? 'video/mp4,video/mov,video/avi,video/webm' : '.pdf,application/pdf'}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Click to select {formData.type === 'video' ? 'video' : 'PDF'} file
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.type === 'video' 
                          ? 'Supported formats: MP4, MOV, AVI, WebM (max 100MB)'
                          : 'Supported format: PDF (max 5MB)'
                        }
                      </p>
                      {selectedFile && (
                        <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                          <p className="text-green-400 text-sm">{selectedFile.name}</p>
                          <p className="text-green-300 text-xs">{formatFileSize(selectedFile.size)}</p>
                          {isUploading && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                  className="bg-green-600 h-2.5 rounded-full" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Uploading: {uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                      )}
                      {editingItem && !selectedFile && formData.type !== 'text' && editingItem.file_url && (
                        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                          <p className="text-blue-400 text-sm">Current: {editingItem.file_name}</p>
                          <p className="text-blue-300 text-xs">Size: {formatFileSize(Number(editingItem.file_size))}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingItem ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingItem ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Help Items Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type/Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      <Info className="w-8 h-8 mx-auto mb-2" />
                      No help items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {item.type === 'text' && <FileText className="w-4 h-4 text-blue-400" />}
                            {item.type === 'video' && <Video className="w-4 h-4 text-green-400" />}
                            {item.type === 'pdf' && <BookOpen className="w-4 h-4 text-red-400" />}
                            <span className="text-white font-medium">{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-sm">
                        {getCategoryLabel(item.category)}
                      </td>
                      <td className="px-4 py-3 text-white text-sm whitespace-nowrap">
                        {item.type === 'text' ? (
                          <span>Text Article</span>
                        ) : item.file_size ? (
                          formatFileSize(Number(item.file_size))
                        ) : (
                          <span>Unknown size</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(item)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            item.is_active
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }`}
                        >
                          {item.is_active ? (
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
                            onClick={() => handleEdit(item)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {item.type !== 'text' && item.file_url && (
                            <button
                              onClick={() => {
                                console.log('Opening file URL:', item.file_url);
                                if (item.file_url && item.file_url.startsWith('data:')) {
                                  // For data URLs, create a temporary link
                                  const link = document.createElement('a');
                                  link.href = item.file_url;
                                  link.download = item.file_name || 'download';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else if (item.file_url) {
                                  window.open(item.file_url, '_blank');
                                }
                              }}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              console.log('DELETE HELP ITEM CLICKED:', item.id);
                              handleDeleteItem(item.id, item.title);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Total Items</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{helpItems.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Active</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {helpItems.filter(item => item.is_active).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Videos</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {helpItems.filter(item => item.type === 'video').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">PDFs</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {helpItems.filter(item => item.type === 'pdf').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterManager;