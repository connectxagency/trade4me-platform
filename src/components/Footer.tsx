import React from 'react';
import { Link } from 'react-router-dom';
import ConnectXLogo from '../assets/ConnectX-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Left Column - ConnectX Logo and Description */}
          <div className="md:col-span-1 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-4">
              <span className="text-xl sm:text-2xl font-bold text-white">
                <img src={ConnectXLogo} alt="ConnectX" className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto object-contain transition-all duration-200 max-w-[120px] sm:max-w-none" />
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md text-sm sm:text-base">
              ConnectX delivers cutting-edge crypto trading solution technology for partners worldwide. 
              Experience verified, automated trading solutions in both retail and institutional markets.
            </p>
          </div>
          
          {/* Middle Column - Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Projects</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Partners</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Contact</Link></li>
            </ul>
          </div>
          
          {/* Right Column - Support */}
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="mailto:support@connectx-consulting.com" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">support@connectx-consulting.com</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Status Page</a></li>
              <li>
                <Link 
                  to="/admin" 
                  className="text-gray-500 hover:text-gray-400 transition-colors text-xs sm:text-sm"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section - Copyright and Legal Links */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0 text-sm">© 2025 All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;