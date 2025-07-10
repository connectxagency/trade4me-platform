import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProjectSpotlight: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-8">
          Current Project Spotlight
        </div>
        
        {/* Main Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          Phemex Exchange & Trade4me Partnership
        </h2>
        
        {/* Icon */}
        <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-12">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        
        {/* Strategy Title */}
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Trade4me 500+ Strategy
        </h3>
        
        {/* Description */}
        <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed">
          Our flagship <span className="text-white font-semibold">Trade4me 500+</span> strategy is now live on Phemex Exchange, one of the world's 
          leading cryptocurrency derivatives trading platforms. Experience institutional-grade automated 
          BTC/USDC trading with verified performance and 24/7 execution.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">500+</div>
            <div className="text-gray-400">BTC Target Portfolio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-gray-400">Automated Execution</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">15%</div>
            <div className="text-gray-400">Partner Commission</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">100%</div>
            <div className="text-gray-400">Verified Performance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSpotlight;