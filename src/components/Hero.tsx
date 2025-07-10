import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-8">
            Professional Crypto Trading Solutions
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Unlock the Power of
            <br />
            <span className="text-blue-500">Automated Trading</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect<span className="text-blue-500">X</span> delivers cutting-edge crypto trading strategies for affiliate partners, exchange KOLs, communities, and network partners. 
            Experience verified, automated trading solutions in both B2C retail and B2B institutional markets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/explore-strategies"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Explore Strategies
            </Link>
            <Link 
              to="/register"
              className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Partner With Us
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-400">BTC Target Portfolio</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-400">Automated Execution</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">100%</div>
              <div className="text-gray-400">Verified Performance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;