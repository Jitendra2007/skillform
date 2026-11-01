import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
  Grid
} from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      {/* Main Navigation Bar */}
      <div className="container navbar-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
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
              {lang === 'te' ? 'ఆంధ్రప్రదేశ్ కార్మిక నెట్‌వర్క్' : 'Andhra Pradesh Labour Network'}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', borderRadius: '8px' }}
            title="Switch Language (English / తెలుగు)"
          >
            <Globe size={15} style={{ color: 'var(--color-primary-dark)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
              {lang === 'en' ? 'తెలుగు' : 'English'}
            </span>
          </button>

          {/* User Auth or Dashboard Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Link
                to={
                  currentUser.role === 'customer'
                    ? '/customer-dashboard'
                    : currentUser.role === 'worker'
                    ? '/worker-dashboard'
                    : '/admin-dashboard'
                }
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '8px' }}
              >
                {currentUser.role === 'customer' && <User size={15} />}
                {currentUser.role === 'worker' && <Briefcase size={15} />}
                {currentUser.role === 'admin' && <ShieldAlert size={15} />}
                <span className="nav-dashboard-text">
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
                style={{ padding: '0.4rem', color: 'var(--color-text-muted)', borderRadius: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.4rem 0.9rem',
                fontWeight: 600,
                fontSize: '0.86rem',
                borderRadius: '8px'
              }}
            >
              {lang === 'te' ? 'లాగిన్' : 'Sign In'}
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.4rem',
              color: 'var(--color-navy)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent'
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
          {currentUser ? (
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
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.6rem 0',
                fontWeight: 700,
                color: 'var(--color-primary-dark)'
              }}
            >
              {lang === 'te' ? 'లాగిన్' : 'Sign In'}
            </Link>
          )}
        </div>
      )}

      {/* Media query styling for responsive nav */}
      <style>{`
        @media (max-width: 640px) {
          .navbar-container {
            height: 54px !important;
          }
          .nav-dashboard-text {
            display: none !important;
          }
        }
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
