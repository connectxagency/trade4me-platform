import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebinarBookingModal from '../components/WebinarBookingModal';
import Image from '../components/Image';
import { Squares } from '@/components/ui/squares-background';
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
  const [actualAffiliateCode, setActualAffiliateCode] = useState<string | null>(null);
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Extract affiliate code from URL path
    const pathParts = window.location.pathname.split('/');
    const codeFromPath = pathParts[pathParts.length - 1];
    
    const finalCode = affiliateCode || codeFromPath;
    
    // Always set the affiliate code and use demo data for development
    if (finalCode && finalCode !== 'trade4me') {
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

  const strategyStats = [
    { label: "Total Return", value: "+18.7%", icon: TrendingUp, color: "text-green-400" },
    { label: "Followers", value: "1,247", icon: Users, color: "text-blue-400" },
    { label: "AUM", value: "$2.4M", icon: DollarSign, color: "text-purple-400" },
    { label: "Win Rate", value: "73.2%", icon: Target, color: "text-orange-400" },
    { label: "Max Drawdown", value: "-4.8%", icon: BarChart3, color: "text-red-400" },
    { label: "Active Days", value: "156", icon: Clock, color: "text-cyan-400" }
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
          <p className="text-gray-400">Loading Trade4me Strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <Squares 
          direction="right"
          speed={0.4}
          squareSize={45}
          borderColor="#059669" 
          hoverFillColor="#047857"
        />
      </div>
      {/* Header */}
      <header className="relative z-10 bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <img 
                  src="/trade4me-logo-final.png" 
                  alt="Trade4me" 
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Clean header without partner info */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900/80 via-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> <span className="text-blue-500">500+</span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-300">Professional BTC Strategy</span>
            </h1>
            
            <p className="lcp-text text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Access the same institutional-grade automated trading strategy that was previously 
              exclusive to professional investors. Now available starting from just <strong className="text-blue-400">500 USDC</strong> 
              on Phemex Exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleFollowStrategy}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                Follow Strategy on Phemex
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsWebinarModalOpen(true)}
                className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                FREE Education Webinar
              </button>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {strategyStats.map((stat, index) => (
                <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color.includes('green') ? 'bg-green-500/20' :
                      stat.color.includes('blue') ? 'bg-blue-500/20' :
                      stat.color.includes('purple') ? 'bg-purple-500/20' :
                      stat.color.includes('orange') ? 'bg-orange-500/20' :
                      stat.color.includes('red') ? 'bg-red-500/20' :
                      'bg-cyan-500/20'
                    }`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> 500+ Strategy?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional algorithmic trading that was previously only available to institutional investors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Institutional-Grade Performance</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                The <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> 500+ strategy employs sophisticated algorithms that capitalize on small trend movements 
                in the liquid BTC and ETH markets. With strict risk management protocols and real-time monitoring, 
                this strategy generates numerous small but consistent profits while protecting capital from major losses.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white">Trend-following algorithm with proven track record</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white">Advanced risk management and position sizing</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white">24/7 automated execution and monitoring</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h4 className="text-xl font-bold text-white mb-6">Strategy Highlights</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">Minimum Investment</span>
                  <span className="text-blue-400 font-bold">500 USDC</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">Strategy Type</span>
                  <span className="text-white font-medium">Trend Following</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">Market Focus</span>
                  <span className="text-white font-medium">BTC/ETH</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">Risk Level</span>
                  <span className="text-yellow-400 font-medium">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/50 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phemex Exchange Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Image 
                src="/phemex-logo.png" 
                alt="Phemex Exchange" 
                className="h-16 md:h-20 object-contain"
                loading="lazy"
                width={200}
                height={80}
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by Phemex Exchange
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Trade on one of the world's leading cryptocurrency exchanges with institutional-grade infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {phemexFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleFollowStrategy}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto shadow-lg"
            >
              <Globe className="w-5 h-5" />
              Follow Strategy Now
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWebinarModalOpen(true)}
              className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              FREE Education Webinar
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How to Get Started with <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Follow these simple steps to start copying the <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> 500+ strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create Phemex Account</h3>
              <p className="text-gray-400">
                Sign up on Phemex Exchange using our exclusive partner link to access the strategy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Deposit Funds</h3>
              <p className="text-gray-400">
                Deposit a minimum of 500 USDC to your Phemex account to start copying the strategy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Follow Strategy</h3>
              <p className="text-gray-400">
                Navigate to copy trading and follow the <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> 500+ strategy to start automated trading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Professional Trading?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 1,200 followers who are already benefiting from this proven institutional strategy. 
            Start with just 500 USDC and experience automated professional trading.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleFollowStrategy}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Follow Strategy Now
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWebinarModalOpen(true)}
              className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              FREE Education Webinar
            </button>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-yellow-500/10 border-t border-yellow-500/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">Risk Disclaimer</h4>
              <p className="text-yellow-300/90 text-sm leading-relaxed">
                Trading cryptocurrencies involves substantial risk of loss and may not be suitable for all investors. 
                Past performance is not indicative of future results. The <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span> 500+ strategy, while professionally 
                managed, cannot guarantee profits and you should carefully consider whether trading is suitable for you 
                in light of your circumstances, knowledge, and financial resources. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <div className="flex justify-center">
              <img 
                src="/trade4me-logo-final.png" 
                alt="Trade4me" 
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Professional cryptocurrency trading strategies for institutional and retail investors.
          </p>
          <div className="text-gray-500 text-sm">
            © 2025 <span className="trade4me-text">Trade<span className="blue-4">4</span>me</span>. All rights reserved. | Strategy powered by Phemex Exchange | <a href="/login" className="text-red-400 hover:text-red-300 transition-colors">Partner Login</a>
          </div>
        </div>
      </footer>
      
      {/* Webinar Booking Modal */}
      <WebinarBookingModal 
        isOpen={isWebinarModalOpen} 
        onClose={() => setIsWebinarModalOpen(false)} 
      />
    </div>
  );
};

export default Trade4meLanding;