import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import WorkerSearch from './pages/WorkerSearch';
import WorkerProfile from './pages/WorkerProfile';
import WorkerRegistration from './pages/WorkerRegistration';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginSignup from './pages/LoginSignup';
import CategoriesPage from './pages/CategoriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<WorkerSearch />} />
                  <Route path="/worker/:id" element={<WorkerProfile />} />
                  <Route path="/register-worker" element={<WorkerRegistration />} />
                  <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                  <Route path="/worker-dashboard" element={<WorkerDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/login" element={<LoginSignup />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
