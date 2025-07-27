import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProjectSpotlight: React.FC = () => {
  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-7xl mx-auto text-center px-2 sm:px-0">
        {/* Badge */}
        <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 text-xs sm:text-sm mb-6 sm:mb-8">
          Current Project Spotlight
        </div>
        
        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 lg:mb-16">
          Phemex Exchange & Trade4me Partnership
        </h2>
        
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 sm:mb-12">
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        
        {/* Strategy Title */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
          Trade4me 500+ Strategy
        </h3>
        
        {/* Description */}
        <p className="text-base sm:text-lg text-gray-400 max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16 leading-relaxed">
          Our flagship <span className="text-white font-semibold">Trade4me 500+</span> strategy is now live on Phemex Exchange, one of the world's 
          leading cryptocurrency derivatives trading platforms. Experience institutional-grade automated 
          BTC/USDC trading with verified performance and 24/7 execution.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-2"><span className="text-green-500">500</span><span className="text-green-500">+</span></div>
            <div className="text-gray-400 text-sm sm:text-base">BTC Target Portfolio</div>
          </div>
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-2"><span className="text-green-500">24/7</span></div>
            <div className="text-gray-400 text-sm sm:text-base">Automated Execution</div>
          </div>
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-2"><span className="text-green-500">98</span><span className="text-green-500">%</span></div>
            <div className="text-gray-400 text-sm sm:text-base">Win Rate</div>
          </div>
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-2"><span className="text-green-500">100</span><span className="text-green-500">%</span></div>
            <div className="text-gray-400 text-sm sm:text-base">Verified Performance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSpotlight;