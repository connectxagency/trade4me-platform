import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import WebinarBookingModal from '../components/WebinarBookingModal';
import CookieConsent from '../components/CookieConsent';
import ContactModal from '../components/ContactModal';
import HelpCenterButton from '../components/HelpCenterButton';

// Import logos
import phemexLogo from '../assets/phemex-logo.png';
import trade4meLogo from '../assets/trade4me-logo-final.png';
import connectXLogo from '../assets/ConnectX-logo.png';
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  DollarSign,
  Target,
  Zap,
  Globe,
  Award,
  ExternalLink,
  Copy,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PartnerData {
  id: string;
  company_name: string | null;
  partner_referral_link: string | null;
  affiliate_referral_code: string | null;
}

const Trade4meLanding: React.FC = () => {
  const { affiliateCode } = useParams<{ affiliateCode: string }>();
  const navigate = useNavigate();
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [actualAffiliateCode, setActualAffiliateCode] = useState<string | null>('D75F0B9C');
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter out the AUM stat
  useEffect(() => {
    // Extract affiliate code from URL path
    const finalCode = affiliateCode || 'D75F0B9C';
    
    // Always set the affiliate code and use demo data for development
    if (finalCode) {
      setActualAffiliateCode(finalCode);
      
      // Use demo data immediately for development
      setPartnerData({
        id: 'demo-partner-id',
        company_name: finalCode === 'DEMO1234' ? 'Demo Community Network' : 'Demo Partner',
        partner_referral_link: 'https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=' + finalCode,
        affiliate_referral_code: finalCode
      });
      setLoading(false);
    } else {
      // Default fallback
      setActualAffiliateCode('D75F0B9C');
      setPartnerData({
        id: 'demo-partner-id',
        company_name: 'Demo Community Network',
        partner_referral_link: 'https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=D75F0B9C',
        affiliate_referral_code: 'D75F0B9C'
      });
      setLoading(false);
    }
  }, [affiliateCode, window.location.pathname]);

  const handleFollowStrategy = () => {
    // Always use the partner's specific Phemex referral link if available
    const targetLink = partnerData?.partner_referral_link || 'https://phemex.com/copy-trading/follower-view/home?id=8086397';
    window.open(targetLink, '_blank');
  };

  const copyLink = () => {
    // Copy the partner's Phemex referral link
    const linkToCopy = partnerData?.partner_referral_link || 'https://phemex.com/copy-trading/follower-view/home?id=8086397';
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Removed AUM from stats
  const strategyStats = [ 
    { label: "Verified Performance", value: "100%", icon: TrendingUp, color: "text-green-400" }, 
    { label: "Support", value: "24/7", icon: Clock, color: "text-green-400" },
    { label: "BTC Target Portfolio", value: "500+", icon: Users, color: "text-blue-400" }, 
    { label: "Win Rate", value: "98.1%", icon: Target, color: "text-orange-400" }, 
    { label: "Automated Execution", value: "24/7", icon: BarChart3, color: "text-green-400" }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Institutional Grade Security",
      description: "Bank-level security protocols protect your investments 24/7"
    },
    {
      icon: Zap,
      title: "Fully Automated",
      description: "No manual trading required - the algorithm handles everything"
    },
    {
      icon: Clock,
      title: "24/7 Market Coverage",
      description: "Never miss an opportunity with round-the-clock trading"
    },
    {
      icon: BarChart3,
      title: "Proven Performance",
      description: "Verified track record with transparent performance metrics"
    },
    {
      icon: Users,
      title: "Professional Management",
      description: "Managed by experienced institutional trading professionals"
    },
    {
      icon: Globe,
      title: "Global Market Access",
      description: "Trade on one of the world's leading crypto exchanges"
    }
  ];

  const phemexFeatures = [
    "Zero trading fees for spot trading",
    "Advanced trading engine (1M+ TPS)",
    "Institutional-grade security",
    "Multi-asset trading platform",
    "Global regulatory compliance",
    "24/7 professional support"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Loading <img src={trade4meLogo} alt="Trade4me" className="h-5 w-auto" /> Strategy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900/30">
      <CookieConsent theme="dark" />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-20 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden critical-content">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
              Professional Crypto Trading Strategy
            </div>
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img src={trade4meLogo} alt="Trade4me" className="h-12 sm:h-20 md:h-20 lg:h-16 w-auto" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">500+</span>
              </div>
              <div className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">Professional BTC Strategy</div>
            </h1>
            
            <div className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 sm:mb-14 max-w-4xl mx-auto leading-relaxed text-center">
              <p className="mb-2">
                Access the same institutional-grade automated trading strategy that was previously 
                exclusive to professional investors. Now available starting from just <strong className="text-blue-400">500 USDC</strong>
              </p>
              <p className="flex items-center justify-center gap-2">
                on <img src={phemexLogo} alt="Phemex" className="h-6 w-auto" /> Exchange.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 lg:mb-20">
              {/* <button
                onClick={handleFollowStrategy}
                className="mobile-button w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px] shadow-lg shadow-blue-600/20 transform hover:translate-y-[-2px]"
              >
                <TrendingUp className="w-5 h-5" />
                Start Following Strategy
              </button> */}
              <button
                onClick={() => setIsWebinarModalOpen(true)}
               className="mobile-button w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px] shadow-lg shadow-green-600/20 transform hover:translate-y-[-2px]"
              >
                <Play className="w-5 h-5" />
                FREE Education Webinar
              </button>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
              {strategyStats.map((stat, index) => (
                <div key={index} className="mobile-card bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-5 lg:p-6 hover:bg-gray-800/60 transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg shadow-black/5">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                      stat.color.includes('green') ? 'bg-green-500/20' :
                      stat.color.includes('blue') ? 'bg-blue-500/20' :
                      stat.color.includes('purple') ? 'bg-purple-500/20' :
                      stat.color.includes('orange') ? 'bg-orange-500/20' :
                      stat.color.includes('red') ? 'bg-red-500/20' :
                      'bg-cyan-500/20'
                    }`}>
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Details */}
      <section className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-800/20 backdrop-blur-sm border-y border-gray-700/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
              Professional Trading Strategy
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 flex items-center justify-center gap-3 flex-wrap">
              Why <img src={trade4meLogo} alt="Trade4me" className="h-10 md:h-12 w-auto" /> 500+ Strategy?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional algorithmic trading that was previously only available to institutional investors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 mb-8">Institutional-Grade Performance</h3>
              <p className="text-gray-300 mb-10 leading-relaxed text-lg flex items-center gap-2 flex-wrap">
                The <img src={trade4meLogo} alt="Trade4me" className="h-5 w-auto" /> 500+ strategy employs sophisticated algorithms that capitalize on small trend movements 
                in the liquid BTC and ETH markets. With strict risk management protocols and real-time monitoring, 
                this strategy generates numerous small but consistent profits while protecting capital from major losses.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center gap-5 p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg transform hover:translate-y-[-2px] transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-white text-lg">Trend-following algorithm with proven track record</span>
                </div>
                <div className="flex items-center gap-5 p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg transform hover:translate-y-[-2px] transition-all duration-300">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-white text-lg">Advanced risk management and position sizing</span>
                </div>
                <div className="flex items-center gap-5 p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg transform hover:translate-y-[-2px] transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-white text-lg">24/7 automated execution and monitoring</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
              <h4 className="text-2xl font-bold text-white mb-8">Strategy Highlights</h4>
              <div className="space-y-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-xl blur-3xl"></div>
                <div className="relative flex items-center justify-between p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg">
                  <span className="text-gray-200 text-lg">Minimum Investment</span>
                  <span className="text-blue-400 font-bold text-xl">500 USDC</span>
                </div>
                <div className="relative flex items-center justify-between p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg">
                  <span className="text-gray-200 text-lg">Strategy Type</span>
                  <span className="text-white font-medium text-lg">Trend Following</span>
                </div>
                <div className="relative flex items-center justify-between p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg">
                  <span className="text-gray-200 text-lg">Market Focus</span>
                  <span className="text-white font-medium text-lg">BTC/ETH</span>
                </div>
                <div className="relative flex items-center justify-between p-5 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/30 shadow-lg">
                  <span className="text-gray-200 text-lg">Risk Level</span>
                  <span className="text-yellow-400 font-medium text-lg">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-xl blur-3xl"></div>
            {benefits.map((benefit, index) => (
              <div key={index} className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/60 transition-all duration-300 transform hover:translate-y-[-4px] shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <benefit.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phemex Exchange Section */}
      <section className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-900/95">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Phemex Logo */}
            <div className="flex justify-center mb-6">
              <img src={phemexLogo} alt="Phemex Exchange" className="h-16 md:h-20 w-auto" />
            </div>
            
            <div className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <img src={phemexLogo} alt="Phemex" className="h-6 w-auto" /> Exchange
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-8 flex items-center justify-center gap-3 flex-wrap">
              Powered by <img src={phemexLogo} alt="Phemex" className="h-10 md:h-12 w-auto" /> Exchange
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trade on one of the world's leading cryptocurrency exchanges with institutional-grade infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {phemexFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-5 p-6 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg transform hover:translate-y-[-2px] transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-white font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 lg:mb-20">
              <button
                onClick={handleFollowStrategy}
                className="mobile-button w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px] shadow-lg shadow-blue-600/20 transform hover:translate-y-[-2px]"
              >
                <TrendingUp className="w-5 h-5" />
                Start Following Strategy
              </button>
              <button
                onClick={() => setIsWebinarModalOpen(true)}
               className="mobile-button w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px] shadow-lg shadow-green-600/20 transform hover:translate-y-[-2px]"
              >
                <Play className="w-5 h-5" />
                FREE Education Webinar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-800/20 backdrop-blur-sm border-y border-gray-700/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
              Simple 3-Step Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-8 flex items-center justify-center gap-3 flex-wrap">
              How to Get Started with <img src={trade4meLogo} alt="Trade4me" className="h-10 md:h-12 w-auto" />
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto flex items-center justify-center gap-2 flex-wrap">
              Follow these simple steps to start copying the <img src={trade4meLogo} alt="Trade4me" className="h-6 w-auto" /> 500+ strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-600/20 via-blue-600/40 to-blue-600/20 transform -translate-y-1/2"></div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-2xl font-bold shadow-lg shadow-blue-600/30 border-4 border-gray-900">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-5 flex items-center justify-center gap-2">
                Create <img src={phemexLogo} alt="Phemex" className="h-6 w-auto" /> Account
              </h3>
              <p className="text-gray-300 text-lg flex items-center justify-center gap-2 flex-wrap">
                Sign up on <img src={phemexLogo} alt="Phemex" className="h-5 w-auto" /> Exchange using our exclusive partner link to access the strategy
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-2xl font-bold shadow-lg shadow-blue-600/30 border-4 border-gray-900">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Deposit Funds</h3>
              <p className="text-gray-300 text-lg flex items-center justify-center gap-2 flex-wrap">
                Deposit a minimum of 500 USDC to your <img src={phemexLogo} alt="Phemex" className="h-5 w-auto" /> account to start copying the strategy
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-2xl font-bold shadow-lg shadow-blue-600/30 border-4 border-gray-900">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-5">Follow Strategy</h3>
              <p className="text-gray-300 text-lg flex items-center justify-center gap-2 flex-wrap">
                Navigate to copy trading and follow the <img src={trade4meLogo} alt="Trade4me" className="h-5 w-auto" /> 500+ strategy to start automated trading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 mb-8">
            Ready to Start Professional Trading?
          </h2>
          
          <p className="text-xl text-gray-200 mb-14 max-w-3xl mx-auto leading-relaxed">
            Join over 1,200 followers who are already benefiting from this proven institutional strategy. 
            Learn more about our professional trading strategies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleFollowStrategy}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-blue-600/20 transform hover:translate-y-[-2px]"
            >
              <TrendingUp className="w-5 h-5" />
              Start Following Strategy
            </button>
            <button
              onClick={() => setIsWebinarModalOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-green-600/20 transform hover:translate-y-[-2px]"
            >
              <Play className="w-5 h-5" />
              FREE Education Webinar
            </button>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-yellow-500/10 backdrop-blur-sm border-t border-yellow-500/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold text-lg mb-3">Risk Disclaimer</h4>
              <p className="text-yellow-300/90 text-base leading-relaxed flex items-center gap-2 flex-wrap">
                Trading cryptocurrencies involves substantial risk of loss and may not be suitable for all investors. 
                Past performance is not indicative of future results. The <img src={trade4meLogo} alt="Trade4me" className="h-4 w-auto" /> 500+ strategy, while professionally 
                managed, cannot guarantee profits and you should carefully consider whether trading is suitable for you 
                in light of your circumstances, knowledge, and financial resources. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <img src={trade4meLogo} alt="Trade4me" className="h-8 mx-auto" />
          </div>
          <div className="mb-8">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors underline text-lg mr-4"
            >
              Contact Us
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors underline text-lg mr-4"
            >
              Support
            </button>
            <Link 
              to="/cookie-policy" 
              className="text-blue-400 hover:text-blue-300 transition-colors underline text-lg"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="text-gray-500 text-base flex items-center justify-center gap-2">
            © 2025 <img src={trade4meLogo} alt="Trade4me" className="h-4 w-auto" />. All rights reserved. | <a href="/login" className="text-red-400 hover:text-red-300 transition-colors">Partner Login</a>
          </div>
        </div>
      </footer>
      
      {/* Webinar Booking Modal */}
      <WebinarBookingModal 
        isOpen={isWebinarModalOpen} 
        onClose={() => setIsWebinarModalOpen(false)} 
      />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      {/* Help Center Button */}
      <HelpCenterButton position="bottom-right" color="blue" />
    </div>
  );
};

export default Trade4meLanding;