import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ConnectXLogo from '../assets/ConnectX-logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    console.log(`🖱️ CLICKING: ${sectionId}`);
    
    // If not on homepage, redirect with hash
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Try to find the element
    const element = document.getElementById(sectionId);
    console.log(`🔍 FOUND ELEMENT:`, element);
    
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      console.log(`📐 SCROLLING TO: ${elementPosition}`);
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    } else {
      console.log(`❌ ELEMENT NOT FOUND: ${sectionId}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 critical-content">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={ConnectXLogo}
                alt="ConnectX" 
                className="h-8 sm:h-10 md:h-12 lg:h-16 w-auto object-contain transition-all duration-200 max-w-[120px] sm:max-w-none"
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base py-2 px-3 rounded-md hover:bg-gray-800/50"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base py-2 px-3 rounded-md hover:bg-gray-800/50"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('partners')}
              className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base py-2 px-3 rounded-md hover:bg-gray-800/50"
            >
              Partners
            </button>
            <Link to="/explore-strategies" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base py-2 px-3 rounded-md hover:bg-gray-800/50">Strategies</Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base py-2 px-3 rounded-md hover:bg-gray-800/50">Login</Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base font-medium"
            >
              Get Started
            </Link>
          </nav>

          <button 
            className="md:hidden text-white p-2 rounded-md hover:bg-gray-800/50 transition-colors icon-button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 mobile-nav">
          <div className="px-2 py-2 space-y-1 max-h-screen overflow-y-auto">
            {/* Mobile menu items */}
            <button 
              onClick={() => {
                scrollToSection('services');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors min-h-[44px]"
            >
              Services
            </button>
            <button 
              onClick={() => {
                scrollToSection('projects');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors min-h-[44px]"
            >
              Projects
            </button>
            <button 
              onClick={() => {
                scrollToSection('partners');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors min-h-[44px]"
            >
              Partners
            </button>
            <Link to="/explore-strategies" className="block px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors min-h-[44px]" onClick={() => setIsMenuOpen(false)}>Strategies</Link>
            <Link to="/login" className="block px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors min-h-[44px]" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link 
              to="/register" 
              className="block w-full mt-2 bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;