import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> January 1, 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using Connect<span className="text-blue-500">X</span> services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                Connect<span className="text-blue-500">X</span> provides automated cryptocurrency trading strategies and partnership programs. 
                Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Automated trading strategy execution</li>
                <li>Partnership and affiliate programs</li>
                <li>Trading performance analytics</li>
                <li>Customer support and documentation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p className="text-gray-300 mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use our services for illegal or unauthorized purposes</li>
                <li>Understand the risks associated with cryptocurrency trading</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Risk Disclosure</h2>
              <p className="text-gray-300 mb-4">
                <strong>Important:</strong> Cryptocurrency trading involves substantial risk of loss. 
                Past performance is not indicative of future results. You should carefully consider 
                whether trading is suitable for you in light of your circumstances, knowledge, and 
                financial resources.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                ConnectX shall not be liable for any direct, indirect, incidental, special, or 
                consequential damages resulting from the use or inability to use our services, 
                including but not limited to trading losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Termination</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to terminate or suspend your account and access to our services 
                at our sole discretion, without notice, for conduct that we believe violates these 
                Terms of Service or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through our platform. Continued use of our services 
                after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
              <p className="text-gray-300">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@connect<span className="text-blue-500">x</span>.com
                <br />
                Address: Connect<span className="text-blue-500">X</span> Legal Team, [Your Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TermsOfService;