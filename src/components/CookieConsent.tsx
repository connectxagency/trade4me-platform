import React, { useState, useEffect } from 'react';
import { X, Cookie, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookieConsentProps {
  theme?: 'dark' | 'light';
}

const CookieConsent: React.FC<CookieConsentProps> = ({ theme = 'dark' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    
    // Only show if they haven't consented yet
    if (!hasConsented) {
      // Small delay to avoid immediate popup on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Consent Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Cookie className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Cookie Consent
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies.
            </p>
            <button 
              onClick={handleCustomize}
              className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
            >
              {showDetails ? 'Hide Details' : 'Customize Settings'}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 md:mt-0">
            <button
              onClick={handleDecline}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark' 
                  ? 'border border-gray-600 text-white hover:bg-gray-800' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              } transition-colors`}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              Accept All
            </button>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className={`absolute top-4 right-4 p-1 rounded-full ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Detailed Settings */}
        {showDetails && (
          <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="essential-cookies"
                    checked
                    disabled
                    className={`w-4 h-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'} rounded`}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="essential-cookies" className={`block font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Essential Cookies
                  </label>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    These cookies are necessary for the website to function and cannot be switched off.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="analytics-cookies"
                    defaultChecked
                    className={`w-4 h-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'} rounded`}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="analytics-cookies" className={`block font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Analytics Cookies
                  </label>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    These cookies help us understand how visitors interact with our website.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="marketing-cookies"
                    defaultChecked
                    className={`w-4 h-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'} rounded`}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="marketing-cookies" className={`block font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Marketing Cookies
                  </label>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    These cookies are used to deliver relevant advertisements and track campaign performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAccept}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Save Preferences
              </button>
            </div>
            
            <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-100'}`}>
              <Info className={`w-4 h-4 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                For more information about how we use cookies, please see our <Link to="/cookie-policy" className="underline">Cookie Policy</Link>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;