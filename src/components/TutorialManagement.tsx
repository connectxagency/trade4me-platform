import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Play, 
  FileText, 
  Eye, 
  EyeOff,
  Save,
  X,
  Clock,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  type: 'video' | 'pdf';
  file_url: string;
  file_name: string;
  file_size: number | null;
  duration: number | null;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface TutorialFormData {
  title: string;
  description: string;
  type: 'video' | 'pdf';
  category: string;
  duration: string;
  is_active: boolean;
  sort_order: string;
}

const TutorialManagement: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<TutorialFormData>({
    title: '',
    description: '',
    type: 'video',
    category: 'general',
    duration: '',
    is_active: true,
    sort_order: '0'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'basics', label: 'Basics' },
    { value: 'earnings', label: 'Earnings' },
    { value: 'referrals', label: 'Referrals' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'compliance', label: 'Compliance' }
  ];

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .order('sort_order')
        .order('created_at');

      if (error) throw error;
      setTutorials(data || []);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      // Set demo data if database fails
      setTutorials([
        {
          id: '1',
          title: 'Getting Started with Trade4me',
          description: 'Learn the basics of our trading platform and how to get started as a partner.',
          type: 'video',
          file_url: '/tutorials/getting-started.mp4',
          file_name: 'getting-started.mp4',
          file_size: 45000000,
          duration: 480,
          category: 'basics',
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Partner Dashboard Overview',
          description: 'Complete walkthrough of your partner dashboard and all available features.',
          type: 'video',
          file_url: '/tutorials/dashboard-overview.mp4',
          file_name: 'dashboard-overview.mp4',
          file_size: 62000000,
          duration: 720,
          category: 'basics',
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
    
    if (!selectedFile && !editingTutorial) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      let fileUrl = editingTutorial?.file_url || '';
      let fileName = editingTutorial?.file_name || '';
      let fileSize = editingTutorial?.file_size || null;

      // Handle file upload
      if (selectedFile) {
        // Convert file to base64 for storage with proper error handling
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            console.log('File converted to base64, size:', result.length);
            resolve(result);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(selectedFile);
        });
        
        // Validate the base64 data
        if (!base64 || !base64.startsWith('data:')) {
          throw new Error('Invalid file format or corrupted file');
        }
        
        fileUrl = base64;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        
        // Store the base64 data in localStorage for persistence with error handling
        try {
          localStorage.setItem(`tutorial_file_${fileName}`, base64);
          console.log('File stored in localStorage:', fileName);
        } catch (storageError) {
          console.warn('Failed to store file in localStorage (file might be too large):', storageError);
          // Continue with database storage even if localStorage fails
        }
      }

      const tutorialData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        duration: formData.duration ? parseInt(formData.duration) : null,
        category: formData.category,
        is_active: formData.is_active,
        sort_order: parseInt(formData.sort_order)
      };

      if (editingTutorial) {
        // Update existing tutorial
        const { error } = await supabase
          .from('tutorials')
          .update(tutorialData)
          .eq('id', editingTutorial.id);

        if (error) throw error;
      } else {
        // Create new tutorial
        const { error } = await supabase
          .from('tutorials')
          .insert(tutorialData);

        if (error) throw error;
      }

      await fetchTutorials();
      resetForm();
      alert(`Tutorial ${editingTutorial ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving tutorial:', error);
      alert(`Error saving tutorial: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      description: tutorial.description || '',
      type: tutorial.type,
      category: tutorial.category,
      duration: tutorial.duration?.toString() || '',
      is_active: tutorial.is_active,
      sort_order: tutorial.sort_order.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this tutorial?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTutorials();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      alert('Error deleting tutorial. Please try again.');
    }
  };

  const toggleActive = async (tutorial: Tutorial) => {
    try {
      const { error } = await supabase
        .from('tutorials')
        .update({ is_active: !tutorial.is_active })
        .eq('id', tutorial.id);

      if (error) throw error;
      await fetchTutorials();
    } catch (error) {
      console.error('Error updating tutorial status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'video',
      category: 'general',
      duration: '',
      is_active: true,
      sort_order: '0'
    });
    setSelectedFile(null);
    setEditingTutorial(null);
    setShowForm(false);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.label || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tutorial Management</h2>
          <p className="text-gray-400">Manage video tutorials and PDF guides for partners</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tutorial
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tutorial title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'video' | 'pdf' }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
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
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tutorial description"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="480"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                File Upload {!editingTutorial && '*'}
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
                  className="cursor-pointer text-blue-400 hover:text-blue-300"
                >
                  Click to upload {formData.type === 'video' ? 'video' : 'PDF'} file
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.type === 'video' 
                    ? 'Supported formats: MP4, MOV, AVI, WebM (max 100MB recommended)'
                    : 'Supported format: PDF (max 50MB recommended)'
                  }
                </p>
                {selectedFile && (
                  <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 text-sm">Selected: {selectedFile.name}</p>
                    <p className="text-green-300 text-xs">Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                )}
                {editingTutorial && !selectedFile && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 text-sm">Current: {editingTutorial.file_name}</p>
                    <p className="text-blue-300 text-xs">Size: {formatFileSize(editingTutorial.file_size)}</p>
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
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-300">
                Active (visible to partners)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Saving...' : editingTutorial ? 'Update Tutorial' : 'Create Tutorial'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tutorials List */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">All Tutorials ({tutorials.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Duration/Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tutorials.map((tutorial) => (
                <tr key={tutorial.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-white font-medium">{tutorial.title}</div>
                      {tutorial.description && (
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                          {tutorial.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tutorial.type === 'video' ? (
                        <Play className="w-4 h-4 text-red-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-green-400" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tutorial.type === 'video'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {tutorial.type.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    {getCategoryLabel(tutorial.category)}
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    <div className="flex items-center gap-2">
                      {tutorial.type === 'video' ? (
                        <>
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDuration(tutorial.duration)}
                        </>
                      ) : (
                        formatFileSize(tutorial.file_size)
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(tutorial)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        tutorial.is_active
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                    >
                      {tutorial.is_active ? (
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
                  <td className="px-4 py-3 text-white text-sm">
                    {tutorial.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(tutorial)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(tutorial.file_url, '_blank')}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Preview"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('DELETE TUTORIAL CLICKED:', tutorial.id);
                          handleDelete(tutorial.id);
                        }}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
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
        {tutorials.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-400 mb-2">No Tutorials Yet</h4>
            <p className="text-gray-500">Create your first tutorial to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialManagement;