import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, BarChart3, Shield, TrendingUp, Globe, Clock } from 'lucide-react';
import ConsultationModal from './ConsultationModal';
import Image from './Image';

const WhyPhemex: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const features = [
    {
      icon: DollarSign,
      title: 'Zero Trading Fees',
      description: 'Zero trading fees for spot trading',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Engine',
      description: 'Advanced trading engine (1M+ TPS)',
      color: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Institutional Security',
      description: 'Institutional-grade security',
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Multi-Asset Platform',
      description: 'Multi-asset trading platform',
      color: 'text-purple-500'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Global regulatory compliance',
      color: 'text-purple-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: '24/7 professional support',
      color: 'text-purple-500'
    }
  ];

  return (
    <section id="partners" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-bl from-gray-800 via-slate-900 to-gray-900 overflow-hidden" style={{ scrollMarginTop: '80px' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-24 right-1/3 w-36 h-36 border border-blue-500/15 rotate-6 animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute bottom-24 left-1/4 w-16 h-16 border border-cyan-500/15 rotate-45 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Hexagon Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {/* Phemex Logo */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/phemex-logo.png" 
              alt="Phemex Exchange" 
              className="h-12 md:h-16 object-contain"
              loading="lazy"
              width={200}
              height={64}
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            Why Phemex Exchange?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/explore-strategies"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            View Strategy Details
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            Schedule Consultation
          </button>
        </div>
      </div>
      
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default WhyPhemex;