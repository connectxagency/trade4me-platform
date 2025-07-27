import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, CheckCircle, Users, Play, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WebinarSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: number;
  max_participants: number;
  zoom_join_url: string | null;
  zoom_password: string | null;
}

interface WebinarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebinarBookingModal: React.FC<WebinarBookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'selection' | 'details' | 'success'>('selection');
  const [selectedSession, setSelectedSession] = useState<WebinarSession | null>(null);
  const [availableSessions, setAvailableSessions] = useState<WebinarSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSessions();
    }
  }, [isOpen]);

  const fetchAvailableSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from('webinar_sessions')
        .select('*')
        .eq('is_active', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date')
        .order('time');

      if (error) throw error;
      setAvailableSessions(data || []);
    } catch (error) {
      console.error('Error fetching webinar sessions:', error);
      // Fallback demo data
      setAvailableSessions([
        {
          id: '1',
          title: 'FREE Trade4me Education Webinar',
          description: 'Learn professional crypto trading strategies and maximize your profits',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          duration_minutes: 60,
          max_participants: 100,
          zoom_join_url: null,
          zoom_password: null
        },
        {
          id: '2',
          title: 'FREE Trade4me Education Webinar',
          description: 'Learn professional crypto trading strategies and maximize your profits',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '16:00',
          duration_minutes: 60,
          max_participants: 100,
          zoom_join_url: null,
          zoom_password: null
        }
      ]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSession || !formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('webinar_registrations')
        .insert({
          webinar_session_id: selectedSession.id,
          name: formData.name,
          email: formData.email,
          status: 'confirmed'
        });

      if (error) throw error;
      
      setStep('success');
    } catch (error: any) {
      console.error('Error registering for webinar:', error);
      if (error.message?.includes('duplicate key')) {
        alert('You are already registered for this webinar session.');
      } else {
        alert('Error registering for webinar. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('selection');
    setSelectedSession(null);
    setFormData({ name: '', email: '' });
    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="mobile-modal bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">FREE Education Webinar</h2>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Learn Professional Trading Strategies</p>
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
          {step === 'selection' && (
            <div className="space-y-6">
              {/* Webinar Benefits */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">🎓 What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">Professional Trading Strategies</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Learn the same strategies used by institutional traders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">Risk Management</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Protect your capital with proven risk management techniques</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">Trade4me System</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">How to maximize profits with our automated trading system</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">Live Q&A Session</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Get your questions answered by trading experts</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Choose Your Webinar Session</h3>
                
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 sm:max-h-48 overflow-y-auto">
                    {availableSessions.map((session) => (
                      <button
                         key={session.id}
                         onClick={() => setSelectedSession(session)}
                         className={`p-3 sm:p-4 text-left rounded-lg border transition-all text-sm min-h-[44px] ${
                           selectedSession?.id === session.id
                             ? 'border-green-500 bg-green-500/10 text-green-400'
                             : 'border-gray-600 hover:border-gray-500 text-gray-300'
                         }`}
                       >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium text-xs sm:text-sm">{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">{formatTime(session.time)} ({session.duration_minutes} min)</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Users className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Max {session.max_participants} participants</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep('details')}
                  disabled={!selectedSession}
                  className="bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
                >
                  Continue to Registration
                </button>
              </div>
            </div>
          )}

          {step === 'details' && selectedSession && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Registration Details</h3>
                
                {/* Selected Session Display */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-green-400 font-medium">{formatDate(selectedSession.date)}</div>
                      <div className="text-green-300 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(selectedSession.time)} ({selectedSession.duration_minutes} minutes)
                      </div>
                    </div>
                  </div>
                  <p className="text-green-300 text-sm">{selectedSession.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      <strong>📧 Important:</strong> You will receive a confirmation email with the Zoom meeting link and calendar invitation after registration.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('selection')}
                      className="flex-1 border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.name || !formData.email}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Registering...' : 'Confirm Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'success' && selectedSession && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Registration Successful! 🎉</h3>
              
              <div className="bg-gray-700/30 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Webinar Details:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{formatDate(selectedSession.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{formatTime(selectedSession.time)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{formData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{formData.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-green-300 text-sm">
                  📧 <strong>Check your email!</strong> You will receive a confirmation email with:
                </p>
                <ul className="text-green-300 text-sm mt-2 space-y-1">
                  <li>• Zoom meeting link and password</li>
                  <li>• Calendar invitation (.ics file)</li>
                  <li>• Webinar preparation materials</li>
                  <li>• Reminder notifications</li>
                </ul>
              </div>
              
              <button
                onClick={handleClose}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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

export default WebinarBookingModal;