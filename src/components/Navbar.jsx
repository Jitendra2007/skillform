import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { 
  Wrench, 
  Globe, 
  User, 
  Briefcase, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Search,
  Grid,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const { currentUser, loginAs, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = (role) => {
    loginAs(role);
    setRoleDropdownOpen(false);
    if (role === 'customer') navigate('/customer-dashboard');
    else if (role === 'worker') navigate('/worker-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top Demo Bar for Reviewer / Examiner Testing */}
      <div style={{
        backgroundColor: '#10213F',
        color: '#E2E8F0',
        padding: '0.35rem 1rem',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            backgroundColor: 'var(--color-primary)',
            color: '#10213F',
            fontWeight: 700,
            padding: '1px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            letterSpacing: '0.5px'
          }}>
            ANDHRA PRADESH (AP)
          </span>
          <span style={{ color: '#94A3B8' }}>
            Smart Community Labour Platform • Switch Persona:
          </span>
        </div>

        {/* 1-Click Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => handleRoleSwitch('customer')}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: currentUser?.role === 'customer' ? 700 : 500,
              backgroundColor: currentUser?.role === 'customer' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
              color: currentUser?.role === 'customer' ? '#10213F' : '#FFFFFF',
              transition: 'all 0.15s ease'
            }}
          >
            👤 Customer View
          </button>
          <button
            onClick={() => handleRoleSwitch('worker')}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: currentUser?.role === 'worker' ? 700 : 500,
              backgroundColor: currentUser?.role === 'worker' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
              color: currentUser?.role === 'worker' ? '#10213F' : '#FFFFFF',
              transition: 'all 0.15s ease'
            }}
          >
            🔨 Worker View
          </button>
          <button
            onClick={() => handleRoleSwitch('admin')}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: currentUser?.role === 'admin' ? 700 : 500,
              backgroundColor: currentUser?.role === 'admin' ? '#F59E0B' : 'rgba(255,255,255,0.1)',
              color: currentUser?.role === 'admin' ? '#10213F' : '#FFFFFF',
              transition: 'all 0.15s ease'
            }}
          >
            🔒 Admin Portal (PIN Protected)
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(114, 201, 154, 0.4)'
          }}>
            <Wrench size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                SkillConnect
              </span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--color-primary-light)',
                color: '#1a7a49',
                padding: '1px 5px',
                borderRadius: '4px',
                fontWeight: 700
              }}>
                AP
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1 }}>
              {lang === 'te' ? 'కమ్యూనిటీ లేబర్ నెట్‌వర్క్' : 'Community Labour Network'}
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? 'var(--color-primary-dark)' : 'var(--color-navy)',
              fontSize: '0.92rem',
              transition: 'color 0.15s ease'
            }}
          >
            {t('nav.home')}
          </Link>

          <Link
            to="/search"
            style={{
              fontWeight: isActive('/search') ? 700 : 500,
              color: isActive('/search') ? 'var(--color-primary-dark)' : 'var(--color-navy)',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Search size={16} />
            <span>{t('nav.findWorkers')}</span>
          </Link>

          <Link
            to="/categories"
            style={{
              fontWeight: isActive('/categories') ? 700 : 500,
              color: isActive('/categories') ? 'var(--color-primary-dark)' : 'var(--color-navy)',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Grid size={16} />
            <span>{t('nav.categories')}</span>
          </Link>

          <Link
            to="/register-worker"
            style={{
              fontWeight: isActive('/register-worker') ? 700 : 500,
              color: isActive('/register-worker') ? 'var(--color-primary-dark)' : 'var(--color-navy)',
              fontSize: '0.92rem'
            }}
          >
            {lang === 'te' ? 'కార్మికుల నమోదు' : 'Join as Worker'}
          </Link>
        </nav>

        {/* Right Action Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
            title="Switch Language (English / తెలుగు)"
          >
            <Globe size={15} style={{ color: 'var(--color-primary-dark)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
              {lang === 'en' ? 'తెలుగు' : 'English'}
            </span>
          </button>

          {/* User Auth or Dashboard Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to={
                  currentUser.role === 'customer'
                    ? '/customer-dashboard'
                    : currentUser.role === 'worker'
                    ? '/worker-dashboard'
                    : '/admin-dashboard'
                }
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {currentUser.role === 'customer' && <User size={15} />}
                {currentUser.role === 'worker' && <Briefcase size={15} />}
                {currentUser.role === 'admin' && <ShieldAlert size={15} />}
                <span>
                  {currentUser.role === 'customer'
                    ? t('nav.customerDashboard')
                    : currentUser.role === 'worker'
                    ? t('nav.workerDashboard')
                    : t('nav.adminDashboard')}
                </span>
              </Link>

              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                title={t('nav.logout')}
                style={{ padding: '0.4rem', color: 'var(--color-text-muted)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                {t('nav.login')}
              </Link>
              <Link to="/register-worker" className="btn btn-primary btn-sm">
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.4rem',
              color: 'var(--color-navy)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-navy)' }}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-navy)' }}
          >
            {t('nav.findWorkers')}
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-navy)' }}
          >
            {t('nav.categories')}
          </Link>
          <Link
            to="/register-worker"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-navy)' }}
          >
            {lang === 'te' ? 'కార్మికుల నమోదు' : 'Join as Worker'}
          </Link>
          {currentUser && (
            <Link
              to={
                currentUser.role === 'customer'
                  ? '/customer-dashboard'
                  : currentUser.role === 'worker'
                  ? '/worker-dashboard'
                  : '/admin-dashboard'
              }
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.6rem 0',
                fontWeight: 700,
                color: 'var(--color-primary-dark)'
              }}
            >
              {currentUser.role === 'customer'
                ? t('nav.customerDashboard')
                : currentUser.role === 'worker'
                ? t('nav.workerDashboard')
                : t('nav.adminDashboard')}
            </Link>
          )}
        </div>
      )}

      {/* Media query styling for desktop nav */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
