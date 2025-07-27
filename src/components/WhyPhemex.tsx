import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, BarChart3, Shield, TrendingUp, Globe, Clock } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

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
    <section id="partners" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Phemex Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img 
              src="/phemex-logo copy.png" 
              alt="Phemex Exchange" 
              className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain max-w-[200px] sm:max-w-none"
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
                const fallbackText = document.createElement('div');
                fallbackText.innerHTML = 'Phemex Exchange';
                fallbackText.className = 'text-xl sm:text-2xl md:text-3xl font-bold text-white';
                e.currentTarget.parentNode?.appendChild(fallbackText);
              }}
            />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 lg:mb-12">
            Why Phemex Exchange?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 mobile-card bg-gray-800/30 border border-gray-700 rounded-lg p-4 sm:p-5">
              <div className="flex-shrink-0 mt-1">
                <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${feature.color}`} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            to="/explore-strategies"
            className="mobile-button w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg min-h-[44px]"
          >
            <BarChart3 className="w-5 h-5" />
            View Strategy Details
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mobile-button w-full sm:w-auto border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px]"
            data-modal="consultation"
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