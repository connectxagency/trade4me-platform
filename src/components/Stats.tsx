import React from 'react';

const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">2,500+</div>
            <div className="text-gray-300 text-lg">Active Partners</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">$50M+</div>
            <div className="text-gray-300 text-lg">Assets Under Management</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-gray-300 text-lg">Uptime Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;