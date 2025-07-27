import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{date: string, time: string}[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available slots from database
  React.useEffect(() => {
    if (isOpen) {
      fetchAvailableSlots();
    }
  }, [isOpen]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .select('date, time')
        .eq('is_available', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date')
        .order('time');

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to generated slots if database fails
      setAvailableSlots(getAvailableDates().flatMap(date => 
        timeSlots.map(time => ({ date: date.value, time }))
      ));
    } finally {
      setLoadingSlots(false);
    }
  };

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates.slice(0, 14); // Show next 14 business days
  };

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const topics = [
    'Partnership Opportunities',
    'Trading Strategy Discussion',
    'Commission Structure',
    'Technical Integration',
    'Marketing Collaboration',
    'Custom Solutions',
    'General Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert consultation booking
      const { error } = await supabase
        .from('consultations')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          topic: formData.topic,
          message: formData.message || null,
          consultation_date: selectedDate,
          consultation_time: selectedTime,
          status: 'pending'
        });

      if (error) throw error;

      // Mark the slot as unavailable
      await supabase
        .from('available_slots')
        .update({ is_available: false })
        .eq('date', selectedDate)
        .eq('time', selectedTime);

      setStep('success');
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('datetime');
    setSelectedDate('');
    setSelectedTime('');
    setFormData({
      name: '',
      email: '',
      company: '',
      topic: '',
      message: ''
    });
    onClose();
  };

  // Group available slots by date
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot.time);
    return acc;
  }, {} as Record<string, string[]>);

  const availableDates = Object.keys(groupedSlots).map(date => ({
    value: date,
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="mobile-modal bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Schedule Consultation</h2>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Let's discuss your partnership</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors icon-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {step === 'datetime' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Select Date and Time</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
                    Available Dates {loadingSlots && '(Loading...)'}
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-2 sm:p-3 text-left rounded-lg border transition-all text-sm min-h-[44px] ${
                          selectedDate === date.value
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300'
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
                      Available Times for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(groupedSlots[selectedDate] || []).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-center rounded-lg border transition-all text-sm min-h-[44px] ${
                            selectedTime === time
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : 'border-gray-600 hover:border-gray-500 text-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep('details')}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Your Contact Information</h3>
                
                {/* Selected DateTime Display */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-blue-400 font-medium text-sm sm:text-base">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-blue-300 text-xs sm:text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedTime}
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mobile-form form-container">
                  <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Your company (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Topic *
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      required
                    >
                      <option value="">Please select a topic</option>
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="Briefly describe what you'd like to discuss..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      className="flex-1 border border-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base min-h-[44px]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.email || !formData.topic}
                      className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
                    >
                      {loading ? 'Submitting...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Appointment Booked Successfully!</h3>
              
              <div className="bg-gray-700/30 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-left">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Appointment Details:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">{formData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">{formData.topic}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm">
                You will receive a confirmation email shortly with the access details for the online meeting.
              </p>
              
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;