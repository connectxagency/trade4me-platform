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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div id="features"></div>
      <div className="max-w-7xl mx-auto">
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
            <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/50 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;