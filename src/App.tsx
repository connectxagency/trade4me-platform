import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ProjectSpotlight from './components/ProjectSpotlight';
import WhyPhemex from './components/WhyPhemex';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load non-critical pages for better LCP
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ExploreStrategies = lazy(() => import('./pages/ExploreStrategies'));
const Trade4meLanding = lazy(() => import('./pages/Trade4meLanding'));

function App() {
  console.log('🎯 ConnectX App rendering...');
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
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
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Header />
              <PrivacyPolicy />
              <Footer />
            </Suspense>
          } />
          <Route path="/terms-of-service" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Header />
              <TermsOfService />
              <Footer />
            </Suspense>
          } />
          <Route path="/cookie-policy" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Header />
              <CookiePolicy />
              <Footer />
            </Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Register />
            </Suspense>
          } />
          <Route path="/login" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Login />
            </Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/explore-strategies" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <ExploreStrategies />
            </Suspense>
          } />
          <Route path="/dashboard" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin-dashboard" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/trade4me/:affiliateCode" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Trade4meLanding />
            </Suspense>
          } />
          <Route path="/trade4me/*" element={
            <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
              <Trade4meLanding />
            </Suspense>
          } />
          {/* Catch-all route for any unmatched paths */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
              <Header />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;