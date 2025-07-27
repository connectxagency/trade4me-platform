import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Star, Network, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    partnerType: 'affiliate' as 'affiliate' | 'kol' | 'community',
    companyName: '',
    websiteUrl: '',
    socialMediaLinks: '',
    audienceSize: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for affiliate referral code in URL
  const affiliateCode = searchParams.get('affiliate');

  const partnerTypes = [
    {
      id: 'affiliate',
      title: 'Affiliate Partner',
      description: 'Earn commissions by promoting our trading strategies',
      icon: Users,
      features: ['Multi-tier commission system', 'Real-time tracking', 'Marketing materials', 'Direct CPA deals']
    },
    {
      id: 'kol',
      title: 'Key Opinion Leader',
      description: 'Exclusive programs for influencers and thought leaders',
      icon: Star,
      features: ['Exclusive strategy access', 'Content collaboration', 'Performance bonuses', 'Priority support']
    },
    {
      id: 'community',
      title: 'Community Network',
      description: 'Solutions for trading communities and groups',
      icon: Network,
      features: ['Group licensing', 'Community tools', 'Educational resources', 'White label solutions']
    }
  ];


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (error) throw error;

      if (data.user) {
        // Create partner profile
        const partnerInsert = {
          user_id: data.user.id,
          partner_type: formData.partnerType,
          company_name: formData.companyName || null,
          website_url: formData.websiteUrl || null,
          social_media_links: formData.socialMediaLinks || null,
          audience_size: formData.audienceSize ? parseInt(formData.audienceSize) : null,
          experience_level: formData.experienceLevel,
          status: 'pending',
          total_earnings: 0,
          total_referrals: 0,
        };

        const { data: partnerData, error: profileError } = await supabase
          .from('partners')
          .insert(partnerInsert)
          .select()
          .single();

        if (profileError) throw profileError;

        // If there's an affiliate code, create the referral relationship
        if (affiliateCode && partnerData) {
          try {
            // Find the referrer partner by affiliate code
            const { data: referrerPartner, error: referrerError } = await supabase
              .from('partners')
              .select('id')
              .eq('affiliate_referral_code', affiliateCode)
              .eq('status', 'approved')
              .single();

            if (!referrerError && referrerPartner) {
              // Create the referral relationship
              await supabase
                .from('partner_referrals')
                .insert({
                  referrer_partner_id: referrerPartner.id,
                  referred_partner_id: partnerData.id,
                  referral_code: affiliateCode,
                  status: 'pending'
                });
            }
          } catch (referralError) {
            console.error('Error creating referral relationship:', referralError);
            // Don't fail the registration if referral creation fails
          }
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle specific Supabase errors
      if (error.message && error.message.includes('User already registered')) {
        setErrors({ 
          email: 'This email is already registered. Please use a different email or sign in instead.' 
        });
      } else if (error.code === 'user_already_exists') {
        setErrors({ 
          email: 'This email is already registered. Please use a different email or sign in instead.' 
        });
      } else {
        setErrors({ submit: error.message || 'An error occurred during registration. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  return (
    <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Become a Partner</h1>
            {affiliateCode && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <p className="text-orange-300 text-sm">
                  <strong>Affiliate Invitation:</strong> You're joining through a partner referral (Code: {affiliateCode})
                </p>
              </div>
            )}
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              Join our network of successful partners and start earning today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 mobile-form form-container">
            {/* Partner Type Selection */}
            <div>
              <label className="block text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Choose Your Partner Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {partnerTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                      formData.partnerType === type.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, partnerType: type.id as any }))}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <type.icon className="w-8 h-8 text-blue-500" />
                      <h3 className="text-base sm:text-lg font-bold text-white">{type.title}</h3>
                    </div>
                    <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{type.description}</p>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Your first name"
                />
                {errors.firstName && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Your last name"
                />
                {errors.lastName && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Account Information */}
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  placeholder="Your company name"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Repeat your password"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-website.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audience Size
                </label>
                <input
                  type="number"
                  name="audienceSize"
                  value={formData.audienceSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of followers/members"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Social Media Links
              </label>
              <textarea
                name="socialMediaLinks"
                value={formData.socialMediaLinks}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Twitter, Instagram, YouTube, etc. (one link per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{errors.submit}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Become a Partner'}
              </button>
              <Link
                to="/login"
                className="flex-1 border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 text-center"
              >
                Already registered? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;