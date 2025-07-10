import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  Eye, 
  EyeOff,
  Save,
  X,
  Play,
  Mail,
  Download,
  ExternalLink,
  Video,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WebinarSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: number;
  max_participants: number;
  zoom_meeting_id: string | null;
  zoom_join_url: string | null;
  zoom_password: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WebinarRegistration {
  id: string;
  webinar_session_id: string;
  name: string;
  email: string;
  registration_date: string;
  status: 'confirmed' | 'cancelled' | 'attended' | 'no_show';
  zoom_registrant_id: string | null;
  created_at: string;
}

interface SessionFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: string;
  max_participants: string;
  zoom_meeting_id: string;
  zoom_join_url: string;
  zoom_password: string;
  is_active: boolean;
}

const WebinarManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'registrations'>('sessions');
  const [sessions, setSessions] = useState<WebinarSession[]>([]);
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<WebinarSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');
  const [formData, setFormData] = useState<SessionFormData>({
    title: 'FREE Trade4me Education Webinar',
    description: 'Learn professional crypto trading strategies, risk management, and how to maximize your profits with our proven Trade4me system.',
    date: '',
    time: '14:00',
    duration_minutes: '60',
    max_participants: '100',
    zoom_meeting_id: '',
    zoom_join_url: '',
    zoom_password: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSessions(), fetchRegistrations()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('webinar_sessions')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Demo data fallback
      setSessions([
        {
          id: '1',
          title: 'FREE Trade4me Education Webinar',
          description: 'Learn professional crypto trading strategies and maximize your profits',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          duration_minutes: 60,
          max_participants: 100,
          zoom_meeting_id: '123456789',
          zoom_join_url: 'https://zoom.us/j/123456789',
          zoom_password: 'trade4me',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('webinar_registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      // Demo data fallback
      setRegistrations([
        {
          id: '1',
          webinar_session_id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registration_date: new Date().toISOString(),
          status: 'confirmed',
          zoom_registrant_id: null,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check for duplicate date/time combination when creating a new session
      if (!editingSession) {
        const duplicateSession = sessions.find(session => 
          session.date === formData.date && session.time === formData.time
        );
        
        if (duplicateSession) {
          alert('A webinar session already exists for this date and time. Please choose a different date or time.');
          return;
        }
      }

      const sessionData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration_minutes: parseInt(formData.duration_minutes),
        max_participants: parseInt(formData.max_participants),
        zoom_meeting_id: formData.zoom_meeting_id || null,
        zoom_join_url: formData.zoom_join_url || null,
        zoom_password: formData.zoom_password || null,
        is_active: formData.is_active
      };

      if (editingSession) {
        const { error } = await supabase
          .from('webinar_sessions')
          .update(sessionData)
          .eq('id', editingSession.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('webinar_sessions')
          .insert(sessionData);

        if (error) throw error;
      }

      await fetchSessions();
      resetForm();
      alert(`Webinar session ${editingSession ? 'updated' : 'created'} successfully!`);
    } catch (error: any) {
      console.error('Error saving session:', error);
      alert('Error saving webinar session. Please try again.');
    }
  };

  const handleEdit = (session: WebinarSession) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      date: session.date,
      time: session.time,
      duration_minutes: session.duration_minutes.toString(),
      max_participants: session.max_participants.toString(),
      zoom_meeting_id: session.zoom_meeting_id || '',
      zoom_join_url: session.zoom_join_url || '',
      zoom_password: session.zoom_password || '',
      is_active: session.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this webinar session? All registrations will also be deleted.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('webinar_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Error deleting webinar session. Please try again.');
    }
  };

  const toggleActive = async (session: WebinarSession) => {
    try {
      const { error } = await supabase
        .from('webinar_sessions')
        .update({ is_active: !session.is_active })
        .eq('id', session.id);

      if (error) throw error;
      await fetchSessions();
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  const updateRegistrationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('webinar_registrations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchRegistrations();
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: 'FREE Trade4me Education Webinar',
      description: 'Learn professional crypto trading strategies, risk management, and how to maximize your profits with our proven Trade4me system.',
      date: '',
      time: '14:00',
      duration_minutes: '60',
      max_participants: '100',
      zoom_meeting_id: '',
      zoom_join_url: '',
      zoom_password: '',
      is_active: true
    });
    setEditingSession(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Confirmed', icon: CheckCircle },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Cancelled', icon: XCircle },
      attended: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'Attended', icon: CheckCircle },
      no_show: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', text: 'No Show', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const getSessionTitle = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    return session ? `${session.title} - ${new Date(session.date).toLocaleDateString()} ${session.time}` : 'Unknown Session';
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    const matchesSession = selectedSessionId === 'all' || registration.webinar_session_id === selectedSessionId;
    
    return matchesSearch && matchesStatus && matchesSession;
  });

  const exportRegistrations = () => {
    const csvContent = [
      ['Name', 'Email', 'Session', 'Registration Date', 'Status'].join(','),
      ...filteredRegistrations.map(reg => [
        reg.name,
        reg.email,
        getSessionTitle(reg.webinar_session_id),
        new Date(reg.registration_date).toLocaleDateString(),
        reg.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webinar_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Webinar Management</h2>
          <p className="text-gray-400">Manage education webinars and registrations</p>
        </div>
        {activeTab === 'sessions' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-1 flex">
          {[
            { id: 'sessions', label: 'Webinar Sessions', icon: Video },
            { id: 'registrations', label: 'Registrations', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Integration Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-blue-400 font-semibold mb-3">🔗 Zoom Integration Setup</h3>
        <div className="space-y-3 text-blue-300/80 text-sm">
          <p><strong>Step 1:</strong> Create a Zoom meeting in your Zoom account</p>
          <p><strong>Step 2:</strong> Copy the Meeting ID, Join URL, and Password</p>
          <p><strong>Step 3:</strong> Paste them into the webinar session form below</p>
          <p><strong>Step 4:</strong> Participants will receive these details via email after registration</p>
        </div>
        <div className="mt-4">
          <a
            href="https://zoom.us/meeting/schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Schedule Zoom Meeting
          </a>
        </div>
      </div>

      {/* Add/Edit Session Form */}
      {showForm && activeTab === 'sessions' && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingSession ? 'Edit Webinar Session' : 'Add New Webinar Session'}
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
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
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Zoom Integration Fields */}
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Zoom Meeting Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Zoom Meeting ID
                  </label>
                  <input
                    type="text"
                    value={formData.zoom_meeting_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, zoom_meeting_id: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Zoom Join URL
                  </label>
                  <input
                    type="url"
                    value={formData.zoom_join_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, zoom_join_url: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meeting Password
                  </label>
                  <input
                    type="text"
                    value={formData.zoom_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, zoom_password: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-300">
                Active (visible for registration)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingSession ? 'Update Session' : 'Create Session'}
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

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Webinar Sessions ({sessions.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Session Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Participants</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Zoom Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">{session.title}</div>
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {session.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white text-sm">
                          {new Date(session.date + 'T00:00:00').toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {session.time} ({session.duration_minutes} min)
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      Max {session.max_participants}
                    </td>
                    <td className="px-4 py-3">
                      {session.zoom_join_url ? (
                        <div className="space-y-1">
                          <div className="text-green-400 text-xs">✓ Configured</div>
                          <div className="text-xs text-gray-400">ID: {session.zoom_meeting_id}</div>
                          {session.zoom_password && (
                            <div className="text-xs text-gray-400">Pass: {session.zoom_password}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-400 text-xs">Not configured</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(session)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          session.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {session.is_active ? (
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
                          onClick={() => handleEdit(session)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {session.zoom_join_url && (
                          <button
                            onClick={() => window.open(session.zoom_join_url!, '_blank')}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Join Zoom"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            console.log('DELETE WEBINAR CLICKED:', session.id);
                            handleDelete(session.id);
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
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-400 mb-2">No Webinar Sessions Yet</h4>
              <p className="text-gray-500">Create your first webinar session to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Sessions</option>
                  {sessions.map(session => (
                    <option key={session.id} value={session.id}>
                      {session.title} - {new Date(session.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="attended">Attended</option>
                  <option value="no_show">No Show</option>
                </select>
                
                <button
                  onClick={exportRegistrations}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Webinar Registrations ({filteredRegistrations.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Participant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Session</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Registration Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-white font-medium">{registration.name}</div>
                          <div className="text-xs text-gray-400">{registration.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-sm">
                        <div className="max-w-xs truncate">
                          {getSessionTitle(registration.webinar_session_id)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-sm">
                        {new Date(registration.registration_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={registration.status}
                          onChange={(e) => updateRegistrationStatus(registration.id, e.target.value)}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:ring-1 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="attended">Attended</option>
                          <option value="no_show">No Show</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No Registrations Found</h4>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || selectedSessionId !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'No webinar registrations yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarManagement;