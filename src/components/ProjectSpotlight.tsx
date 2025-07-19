import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProjectSpotlight: React.FC = () => {
  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-800 via-gray-900 to-slate-800 overflow-hidden" style={{ scrollMarginTop: '80px' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-green-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-32 right-1/4 w-28 h-28 border border-green-500/20 rotate-12 animate-spin" style={{ animationDuration: '25s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 border border-orange-500/20 rotate-45 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Subtle Diamond Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center">
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