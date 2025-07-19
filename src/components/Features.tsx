import React from 'react';
import { CheckCircle, Zap, TrendingUp, Headphones } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Strategies',
      description: 'All trading strategies are thoroughly tested and verified before deployment',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Automated Execution',
      description: 'Fully automated trading systems eliminate human error and emotional decisions',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'Track record of consistent performance across various market conditions',
      color: 'from-purple-500 to-blue-600'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: 'Dedicated support team and resources to ensure partner success',
      color: 'from-pink-500 to-purple-600'
    }
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-tl from-slate-900 via-gray-800 to-slate-900 overflow-hidden">
      <div id="features"></div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-56 -right-56 w-112 h-112 bg-teal-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.2s' }}></div>
        <div className="absolute -bottom-56 -left-56 w-112 h-112 bg-indigo-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute top-16 left-1/5 w-40 h-40 border border-teal-500/12 rotate-12 animate-spin" style={{ animationDuration: '35s' }}></div>
          <div className="absolute bottom-16 right-1/5 w-24 h-24 border border-indigo-500/12 rotate-45 animate-spin" style={{ animationDuration: '22s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Star Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(20,184,166,0.015)_1px,transparent_1px),radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.015)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose Connect<span className="text-blue-500">X</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Join the growing network of successful partners leveraging our proven trading strategies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-gray-800/30 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/50 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500 ease-out transform-gpu">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out`}>
                <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 ease-out" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;