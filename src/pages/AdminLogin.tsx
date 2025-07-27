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
      setErrors({ submit: 'Please fill in all fields' });
      return;
    }

    // Check if email is admin email
    if (!formData.email.includes('info@connectx-agency.com')) {
      setErrors({ submit: 'Only administrator accounts have access to this area' });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      console.log('error', error)
      
      if (error) throw error;
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        setErrors({ submit: 'Incorrect email or password. Please check your credentials.' });
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
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto px-2 sm:px-0">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Administrator Login</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Login for administrators
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mobile-form">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                placeholder="admin@connectx.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 text-base"
                  placeholder="Your admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white icon-button"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-xs sm:text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
            >
              {loading ? 'Signing in...' : 'Sign in as Administrator'}
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;