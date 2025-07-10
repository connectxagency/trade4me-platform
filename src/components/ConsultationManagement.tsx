import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Eye, 
  Mail, 
  User, 
  Building, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
}

interface Consultation {
  id: string;
  name: string;
  email: string;
  company: string | null;
  topic: string;
  message: string | null;
  consultation_date: string;
  consultation_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

interface ConsultationDetailsModalProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

const ConsultationDetailsModal: React.FC<ConsultationDetailsModalProps> = ({
  consultation,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  if (!isOpen || !consultation) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'Pending', icon: AlertCircle },
      confirmed: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'Confirmed', icon: CheckCircle },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Cancelled', icon: XCircle },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Completed', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Consultation Details</h2>
            {getStatusBadge(consultation.status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Termin Information */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white font-medium">
                    {new Date(consultation.consultation_date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Time</div>
                  <div className="text-white font-medium">{consultation.consultation_time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kontakt Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Name</div>
                  <div className="text-white">{consultation.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="text-white">{consultation.email}</div>
                </div>
              </div>
              {consultation.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Company</div>
                    <div className="text-white">{consultation.company}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gesprächsdetails */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Consultation Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Topic</div>
                <div className="text-white">{consultation.topic}</div>
              </div>
              {consultation.message && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Message</div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-white leading-relaxed">
                    {consultation.message}
                  </div>
                </div>
              )}
              {!consultation.message && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Message</div>
                  <div className="text-gray-500 italic">No message provided</div>
                </div>
              )}
            </div>
          </div>

          {/* Status ändern */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Change Status</h3>
            <select
              value={consultation.status}
              onChange={(e) => onStatusUpdate(consultation.id, e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Buchungsdatum */}
          <div className="text-sm text-gray-400">
            Booked on: {new Date(consultation.created_at).toLocaleDateString('en-US')} at {new Date(consultation.created_at).toLocaleTimeString('en-US')}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConsultationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'slots' | 'bookings'>('slots');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New slot form
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAvailableSlots(), fetchConsultations()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    const { data, error } = await supabase
      .from('available_slots')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .order('time');

    if (error) {
      console.error('Error fetching slots:', error);
    } else {
      setAvailableSlots(data || []);
    }
  };

  const fetchConsultations = async () => {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('consultation_date', { ascending: false })
      .order('consultation_time', { ascending: false });

    if (error) {
      console.error('Error fetching consultations:', error);
    } else {
      setConsultations(data || []);
    }
  };

  const addTimeSlot = async () => {
    if (!newSlotDate || !newSlotTime) return;

    setAddingSlot(true);
    try {
      const { error } = await supabase
        .from('available_slots')
        .insert({
          date: newSlotDate,
          time: newSlotTime,
          is_available: true
        });

      if (error) throw error;

      setNewSlotDate('');
      setNewSlotTime('');
      await fetchAvailableSlots();
    } catch (error) {
      console.error('Error adding slot:', error);
      alert('Error adding time slot');
    } finally {
      setAddingSlot(false);
    }
  };

  const toggleSlotAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .update({ is_available: !currentAvailability })
        .eq('id', id);

      if (error) throw error;
      await fetchAvailableSlots();
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  };

  const deleteSlot = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this time slot?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAvailableSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Error deleting time slot. Please try again.');
    }
  };

  const updateConsultationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id ? { ...consultation, status: status as any } : consultation
        )
      );

      // Update selected consultation if it's the one being updated
      if (selectedConsultation?.id === id) {
        setSelectedConsultation(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  const openConsultationDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const closeConsultationDetails = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'Pending', icon: AlertCircle },
      confirmed: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'Confirmed', icon: CheckCircle },
      cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Cancelled', icon: XCircle },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Completed', icon: CheckCircle }
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

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportConsultations = () => {
    const csvContent = [
      ['Name', 'Email', 'Company', 'Topic', 'Message', 'Date', 'Time', 'Status', 'Booked On'].join(','),
      ...filteredConsultations.map(consultation => [
        consultation.name,
        consultation.email,
        consultation.company || '',
        consultation.topic,
        consultation.message || '',
        consultation.consultation_date,
        consultation.consultation_time,
        consultation.status,
        new Date(consultation.created_at).toLocaleDateString('en-US')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-1 flex">
          {[
            { id: 'slots', label: 'Available Times', icon: Clock },
            { id: 'bookings', label: 'Bookings', icon: Calendar }
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

      {activeTab === 'slots' && (
        <div className="space-y-6">
          {/* Add New Slot */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Time Slot</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addTimeSlot}
                disabled={!newSlotDate || !newSlotTime || addingSlot}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {addingSlot ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Available Slots List */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Available Time Slots ({availableSlots.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {availableSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-white">
                        {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-white">{slot.time}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          slot.is_available 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {slot.is_available ? 'Available' : 'Booked'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSlotAvailability(slot.id, slot.is_available)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              slot.is_available
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {slot.is_available ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => {
                              console.log('DELETE SLOT CLICKED:', slot.id);
                              deleteSlot(slot.id);
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
            {availableSlots.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No Time Slots Available</h4>
                <p className="text-gray-500">Add new time slots to enable appointments.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Filters and Export */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button
                  onClick={exportConsultations}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Consultations Table */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Consultation Bookings ({filteredConsultations.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Appointment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Booked</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-white font-medium text-sm">{consultation.name}</div>
                          <div className="text-xs text-gray-400">{consultation.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-sm">
                        {consultation.company || '-'}
                      </td>
                      <td className="px-4 py-3 text-white text-sm">
                        {consultation.topic}
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          {consultation.message ? (
                            <div className="text-white text-sm truncate" title={consultation.message}>
                              {consultation.message}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No message</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-white text-sm">
                            {new Date(consultation.consultation_date + 'T00:00:00').toLocaleDateString('en-US')}
                          </div>
                          <div className="text-xs text-gray-400">{consultation.consultation_time}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(consultation.status)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(consultation.created_at).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openConsultationDetails(consultation)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={consultation.status}
                            onChange={(e) => updateConsultationStatus(consultation.id, e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent min-w-[90px]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredConsultations.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No Bookings Found</h4>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters.'
                    : 'No consultation bookings yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consultation Details Modal */}
      <ConsultationDetailsModal
        consultation={selectedConsultation}
        isOpen={isModalOpen}
        onClose={closeConsultationDetails}
        onStatusUpdate={updateConsultationStatus}
      />
    </div>
  );
};

export default ConsultationManagement;