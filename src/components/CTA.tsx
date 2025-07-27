import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

const CTA: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-purple-900/20">
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Ready to Start Your <span className="text-blue-500">Trade4me Project</span>?
        </h2>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
          Join our network of successful partners and start leveraging 
          professional crypto trading strategies today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 lg:mb-16">
          <Link 
            to="/register"
            className="mobile-button w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 min-h-[44px]"
          >
            <Users className="w-5 h-5" />
            Become a Partner
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mobile-button w-full sm:w-auto border border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 min-h-[44px]"
            data-modal="consultation"
          >
            <Calendar className="w-5 h-5" />
            Schedule Consultation
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">1000+</div>
            <div className="text-gray-400 text-sm sm:text-base">Active Partners</div>
          </div>
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">$50M+</div>
            <div className="text-gray-400 text-sm sm:text-base">Assets Under Management</div>
          </div>
          <div className="text-center mobile-card bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500 mb-2">99.9%</div>
            <div className="text-gray-400 text-sm sm:text-base">Uptime Guarantee</div>
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