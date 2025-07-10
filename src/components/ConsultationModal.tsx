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
          label: date.toLocaleDateString('de-DE', { 
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
      alert('Fehler beim Buchen des Termins. Bitte versuchen Sie es erneut.');
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
    label: new Date(date + 'T00:00:00').toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Beratungstermin vereinbaren</h2>
              <p className="text-sm text-gray-400">Lassen Sie uns über Ihre Partnerschaft sprechen</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'datetime' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Wählen Sie Datum und Uhrzeit</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Verfügbare Termine {loadingSlots && '(Wird geladen...)'}
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-3 text-left rounded-lg border transition-all ${
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
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Verfügbare Uhrzeiten für {new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(groupedSlots[selectedDate] || []).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-center rounded-lg border transition-all ${
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
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter zu den Details
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Ihre Kontaktdaten</h3>
                
                {/* Selected DateTime Display */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-blue-400 font-medium">
                        {new Date(selectedDate).toLocaleDateString('de-DE', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-blue-300 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedTime} Uhr
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ihr vollständiger Name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ihre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unternehmen
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ihr Unternehmen (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gesprächsthema *
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Bitte wählen Sie ein Thema</option>
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nachricht
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Beschreiben Sie kurz, was Sie besprechen möchten..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      className="flex-1 border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Zurück
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.email || !formData.topic}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Wird gesendet...' : 'Termin bestätigen'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Termin erfolgreich gebucht!</h3>
              
              <div className="bg-gray-700/30 rounded-lg p-6 mb-6 text-left">
                <h4 className="text-lg font-semibold text-white mb-4">Termindetails:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">
                      {new Date(selectedDate).toLocaleDateString('de-DE', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{selectedTime} Uhr</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{formData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{formData.topic}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                Sie erhalten in Kürze eine Bestätigungs-E-Mail mit den Zugangsdaten für das Online-Meeting.
              </p>
              
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Schließen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;