import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column - Brand and Description */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <div className="flex items-center">
                <Image 
                  src="/ConnectX-logo.png" 
                  alt="ConnectX" 
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                  width={150}
                  height={48}
                />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Connect<span className="text-blue-500">X</span> delivers cutting-edge crypto trading strategies for partners worldwide. 
              Experience verified, automated trading solutions in both retail and institutional markets.
            </p>
          </div>
          
          {/* Middle Column - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Right Column - Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status Page</a></li>
              <li>
                <Link 
                  to="/admin" 
                  className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section - Copyright and Legal Links */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2025 Connect<span className="text-blue-500">X</span>. All rights reserved.</p>
          <div className="flex space-x-6 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;