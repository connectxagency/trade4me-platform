import React, { useState } from 'react';
import { Users, Star, Network, Check } from 'lucide-react';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('B2C Retail');

  const b2cServices = [
    {
      icon: Users,
      title: 'Affiliate Partners',
      badge: 'Popular',
      description: 'Comprehensive partnership programs with competitive commission structures',
      features: [
        'Multi-tier commission system',
        'Real-time performance tracking',
        'Marketing support materials',
        'Dedicated partner dashboard',
        'Direct CPA Deals'
      ]
    },
    {
      icon: Star,
      title: 'Exchange KOLs',
      description: 'Specialized programs for key opinion leaders and influencers',
      features: [
        'Exclusive strategy access',
        'Content collaboration',
        'Performance bonuses',
        'Community building tools'
      ]
    },
    {
      icon: Network,
      title: 'Community Networks',
      description: 'Tailored solutions for trading communities and groups',
      features: [
        'Group licensing options',
        'Community management tools',
        'Educational resources',
        'Collective performance tracking',
        'Free White Label solutions'
      ]
    }
  ];

  return (
    <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden" style={{ scrollMarginTop: '80px' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-32 h-32 border border-purple-500/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 border border-blue-500/20 rotate-12 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto">
            Comprehensive trading solutions tailored for different market segments and partnership models
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-1 flex">
            {['B2C Retail', 'B2B Institutional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'B2C Retail' ? (
          /* B2C Services Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {b2cServices.map((service, index) => (
              <div key={index} className="group bg-gray-800/30 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/50 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 ease-out transform-gpu">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300 ease-out">
                    <service.icon className="w-6 h-6 text-white group-hover:rotate-6 transition-transform duration-300 ease-out" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">{service.title}</h3>
                    {service.badge && (
                      <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mt-1 group-hover:bg-purple-500 group-hover:scale-105 transition-all duration-300">
                        {service.badge}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          /* B2B Institutional Content */
          <div className="text-center py-20">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              B2B Institutional Solutions
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade trading solutions designed for institutional clients and large-scale operations. Contact us to learn more about our B2B offerings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;