import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-2 sm:px-4 lg:px-8 bg-gray-900 min-h-screen flex items-center critical-content">
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-0">
        <div className="text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm mb-6 sm:mb-8">
            Professional Crypto Trading Solutions
          </div>
          
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Unlock the Power of
            <br />
            <span className="text-blue-500">Automated Trading</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            We deliver cutting-edge crypto trading strategies for affiliate partners, exchange KOLs, communities, and network partners. 
            Experience verified, automated trading solutions in both B2C retail and B2B institutional markets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-16 px-4">
            <Link
              to="/explore-strategies"
              className="mobile-button w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <TrendingUp className="w-5 h-5" />
              Explore Strategies
            </Link>
            <Link 
              to="/register"
              className="mobile-button w-full sm:w-auto border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Users className="w-5 h-5" />
              Partner With Us
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4">
            <div className="mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6 hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-400 text-sm sm:text-base">BTC Target Portfolio</div>
            </div>
            <div className="mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6 hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400 text-sm sm:text-base">Automated Execution</div>
            </div>
            <div className="mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6 hover:bg-gray-800/50 transition-colors">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">100%</div>
              <div className="text-gray-400 text-sm sm:text-base">Verified Performance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;