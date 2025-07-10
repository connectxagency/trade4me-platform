import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, DollarSign, BarChart3, ExternalLink, Shield, Clock, Target } from 'lucide-react';

const ExploreStrategies: React.FC = () => {
  const strategyData = {
    name: "Trade4me 500+",
    followers: 1247,
    pnl: "+18.7%",
    aum: "$2.4M",
    description: "Trade4me 500+ primarily trades the liquid BTC and ETH markets, capitalizing on small trend movements to generate numerous small but consistent profits. Strict risk management and real-time monitoring protect capital from major losses.",
    followLink: "https://phemex.com/copy-trading/follower-view/home?id=8086397"
  };

  const performanceMetrics = [
    { label: "Total Return", value: "+18.7%", color: "text-green-400", icon: TrendingUp },
    { label: "Followers", value: "1,247", color: "text-blue-400", icon: Users },
    { label: "AUM", value: "$2.4M", color: "text-purple-400", icon: DollarSign },
    { label: "Win Rate", value: "73.2%", color: "text-orange-400", icon: Target },
    { label: "Max Drawdown", value: "-4.8%", color: "text-red-400", icon: BarChart3 },
    { label: "Active Days", value: "156", color: "text-cyan-400", icon: Clock }
  ];

  const riskMetrics = [
    { label: "Risk Level", value: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
    { label: "Strategy Type", value: "Trend Following", color: "bg-blue-500/20 text-blue-400" },
    { label: "Market Focus", value: "BTC/ETH", color: "bg-purple-500/20 text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <img 
                  src="/ConnectX-logo-final copy.png" 
                  alt="ConnectX" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <span className="text-gray-400">Trading Strategies</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Trading Strategies
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover professional trading strategies with verified performance and transparent metrics
          </p>
        </div>

        {/* Phemex Partnership Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Phemex Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/phemex-logo copy.png" 
                  alt="Phemex Exchange" 
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Powered by Phemex</h3>
                <p className="text-purple-300">
                  Professional trading strategies on one of the world's leading crypto exchanges
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-semibold">Verified Performance</span>
            </div>
          </div>
        </div>

        {/* Strategy Card */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden mb-8">
          {/* Strategy Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">{strategyData.name}</h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  {strategyData.description}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={strategyData.followLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 whitespace-nowrap"
                >
                  <TrendingUp className="w-5 h-5" />
                  Follow Strategy
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Strategy ID: 8086397</div>
                  <div className="text-sm text-blue-400 font-medium">Trade4me Strategy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold text-white">Performance Overview</h3>
              <span className="text-sm text-blue-400 font-medium bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                Trade4me Strategy
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metric.color.includes('green') ? 'bg-green-500/20' :
                      metric.color.includes('blue') ? 'bg-blue-500/20' :
                      metric.color.includes('purple') ? 'bg-purple-500/20' :
                      metric.color.includes('orange') ? 'bg-orange-500/20' :
                      metric.color.includes('red') ? 'bg-red-500/20' :
                      'bg-cyan-500/20'
                    }`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Risk Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {riskMetrics.map((risk, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">{risk.label}</div>
                  <span className={`px-3 py-1 rounded-full text-sm border ${risk.color} border-current`}>
                    {risk.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Strategy Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trading Approach */}
              <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Trading Approach</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Focuses on liquid BTC and ETH markets for optimal execution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Capitalizes on small trend movements with high frequency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Generates numerous small but consistent profits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Employs strict risk management protocols</span>
                  </li>
                </ul>
              </div>

              {/* Risk Management */}
              <div className="bg-gray-700/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Risk Management</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time monitoring protects against major losses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Defined max market exposure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Automated stop-loss and take-profit mechanisms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Annual performance/ risk rate 1:1</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Following?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join over 1,200 followers who are already benefiting from this proven trading strategy. 
            Start copying trades automatically on Phemex Exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={strategyData.followLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <TrendingUp className="w-5 h-5" />
              Follow on Phemex
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/register"
              className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
            >
              <Users className="w-5 h-5" />
              Become a Partner
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">Risk Disclaimer</h4>
              <p className="text-yellow-300/90 text-sm leading-relaxed">
                Trading cryptocurrencies involves substantial risk of loss. Past performance is not indicative of future results. 
                You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and 
                financial resources. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreStrategies;