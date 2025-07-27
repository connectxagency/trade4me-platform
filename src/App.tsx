import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import CookieConsent from './components/CookieConsent';
import Hero from './components/Hero';
import Services from './components/Services';
import ProjectSpotlight from './components/ProjectSpotlight';
import WhyPhemex from './components/WhyPhemex';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ExploreStrategies from './pages/ExploreStrategies';
import ProtectedRoute from './components/ProtectedRoute';
import Trade4meLanding from './pages/Trade4meLanding';
import HelpCenter from './pages/HelpCenter';

function App() {
  console.log('🎯 ConnectX App rendering...');
  
  // Add error boundary
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error caught:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-400 mb-4">Something went wrong. Please reload the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <CookieConsent theme="dark" />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <Services />
              <ProjectSpotlight />
              <WhyPhemex />
              <Features />
              <CTA />
              <Footer />
            </>
          } />
          <Route path="/privacy-policy" element={
            <>
              <PrivacyPolicy />
            </>
          } />
          <Route path="/terms-of-service" element={
            <>
              <TermsOfService />
            </>
          } />
         <Route path="/cookie-policy" element={
           <>
             <CookiePolicy />
           </>
         } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/explore-strategies" element={<ExploreStrategies />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
                      <Route path="/trade4me/:affiliateCode?" element={<Trade4meLanding />} />
            <Route path="/help" element={<HelpCenter />} />
          {/* Catch-all route for any unmatched paths */}
          <Route path="*" element={
            <>
              <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white pt-20">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
                  <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Go Home
                  </a>
                </div>
              </div>
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;