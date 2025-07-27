import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const CookiePolicy: React.FC = () => {
  const location = useLocation();
  const isFromTrade4me = location.pathname.includes('trade4me') || document.referrer.includes('trade4me');
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to={isFromTrade4me ? "/trade4me" : "/"} 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFromTrade4me ? "Back to Trade4me" : "Back to Home"}
        </Link>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> January 1, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
              <p className="text-gray-300 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when 
                you visit our website. They are widely used to make websites work more efficiently 
                and provide information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-300 mb-4">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These cookies are necessary for the website to function and cannot be switched off:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Authentication and security cookies</li>
                  <li>Session management cookies</li>
                  <li>Load balancing cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Analytics Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These cookies help us understand how visitors use our website:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Google Analytics cookies</li>
                  <li>Performance monitoring cookies</li>
                  <li>User behavior tracking cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Marketing Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These cookies are used to deliver relevant advertisements:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Advertising platform cookies</li>
                  <li>Social media integration cookies</li>
                  <li>Retargeting cookies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
              <p className="text-gray-300 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Cookie preferences: Use our cookie preference center (if available)</li>
                <li>Third-party opt-out: Visit third-party websites to opt out of their cookies</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
              <p className="text-gray-300 mb-4">
                Our website may contain cookies from third-party services such as:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for content sharing</li>
                <li>Advertising networks for targeted advertising</li>
                <li>Customer support tools for chat functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Updates to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about our use of cookies, please contact us at:
                <br />
                Email: <a href="mailto:info@connectx-consulting.com" className="text-blue-500 hover:text-blue-400 underline">info@connectx-consulting.com</a>
                <br />
                <br />
                Address:
                <br />
                ConnectX Consulting DWC-LLC
                <br />
                Company reg. 12338
                <br />
                Office - DWC Business Centre
                <br />
                Level -3, Building A3
                <br />
                Dubai South Business Park, P.O Box 390667
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CookiePolicy;