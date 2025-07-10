import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrors({ submit: 'Bitte füllen Sie alle Felder aus' });
      return;
    }

    // Check if email is admin email
    if (!formData.email.includes('admin@connectx.com')) {
      setErrors({ submit: 'Nur Administrator-Accounts haben Zugriff auf diesen Bereich' });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) throw error;
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        setErrors({ submit: 'Falsche E-Mail oder Passwort. Bitte überprüfen Sie Ihre Anmeldedaten.' });
      } else {
        setErrors({ submit: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.submit) {
      setErrors({});
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Administrator Login</h1>
            <p className="text-gray-400">
              Anmeldung für Administratoren
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@connectx.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                  placeholder="Ihr Admin-Passwort"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Anmeldung läuft...' : 'Als Administrator anmelden'}
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Passwort vergessen?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;