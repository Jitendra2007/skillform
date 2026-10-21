import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Grid, User, Briefcase, ShieldAlert, Globe } from 'lucide-react';

export default function MobileBottomNav() {
  const { lang, toggleLang, t } = useLanguage();
  const { currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const dashboardPath = currentUser?.role === 'worker'
    ? '/worker-dashboard'
    : currentUser?.role === 'admin'
    ? '/admin-dashboard'
    : '/customer-dashboard';

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--color-border)',
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.4rem 0.5rem',
      zIndex: 999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.06)'
    }}>
      <Link
        to="/"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/') ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive('/') ? 700 : 500,
          textDecoration: 'none'
        }}
      >
        <Home size={20} />
        <span>{lang === 'te' ? 'హోమ్' : 'Home'}</span>
      </Link>

      <Link
        to="/search"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/search') ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive('/search') ? 700 : 500,
          textDecoration: 'none'
        }}
      >
        <Search size={20} />
        <span>{lang === 'te' ? 'కార్మికులు' : 'Workers'}</span>
      </Link>

      <Link
        to="/categories"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/categories') ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
          fontSize: '0.7rem',
          fontWeight: isActive('/categories') ? 700 : 500,
          textDecoration: 'none'
        }}
      >
        <Grid size={20} />
        <span>{lang === 'te' ? 'వర్గాలు' : 'Trades'}</span>
      </Link>

      <Link
        to={dashboardPath}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: location.pathname.includes('dashboard') ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
          fontSize: '0.7rem',
          fontWeight: location.pathname.includes('dashboard') ? 700 : 500,
          textDecoration: 'none'
        }}
      >
        {currentUser?.role === 'worker' ? (
          <Briefcase size={20} />
        ) : currentUser?.role === 'admin' ? (
          <ShieldAlert size={20} />
        ) : (
          <User size={20} />
        )}
        <span>{lang === 'te' ? 'డాష్‌బోర్డ్' : 'Portal'}</span>
      </Link>

      <button
        onClick={toggleLang}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--color-navy)',
          fontSize: '0.7rem',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Globe size={20} style={{ color: 'var(--color-primary-dark)' }} />
        <span>{lang === 'en' ? 'తెలుగు' : 'EN'}</span>
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
          body {
            padding-bottom: 60px !important;
          }
        }
      `}</style>
    </nav>
  );
}
