import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/ConnectX-logo-final copy copy copy.png" 
              alt="ConnectX" 
              className="h-20 w-auto object-contain"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('partners')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Partners
            </button>
            <Link to="/explore-strategies" className="text-gray-300 hover:text-white transition-colors">Strategies</Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={() => {
                scrollToSection('services');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
            >
              Services
            </button>
            <button 
              onClick={() => {
                scrollToSection('projects');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
            >
              Projects
            </button>
            <button 
              onClick={() => {
                scrollToSection('partners');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
            >
              Partners
            </button>
            <Link to="/explore-strategies" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Strategies</Link>
            <Link to="/login" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link 
              to="/register" 
              className="block w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
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