import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

const CTA: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/30 via-gray-900 to-blue-900/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-64 -left-64 w-128 h-128 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute -bottom-64 -right-64 w-128 h-128 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-4">
          <div className="absolute top-20 left-1/6 w-48 h-48 border border-purple-500/10 rotate-45 animate-spin" style={{ animationDuration: '40s' }}></div>
          <div className="absolute bottom-20 right-1/6 w-32 h-32 border border-blue-500/10 rotate-12 animate-spin" style={{ animationDuration: '28s', animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Subtle Wave Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(147,51,234,0.01)_25%,transparent_25%,transparent_50%,rgba(59,130,246,0.01)_50%,rgba(59,130,246,0.01)_75%,transparent_75%)] bg-[size:100px_100px]"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Start Your <span className="text-blue-500">Trade4me Project</span>?
        </h2>
        
        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join our network of successful partners and start leveraging 
          professional crypto trading strategies today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <Users className="w-5 h-5" />
            Become a Partner
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            Schedule Consultation
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">1000+</div>
            <div className="text-gray-400">Active Partners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">$50M+</div>
            <div className="text-gray-400">Assets Under Management</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime Guarantee</div>
          </div>
        </div>
      </div>
      
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default CTA;