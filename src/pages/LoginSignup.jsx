import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Wrench, ShieldAlert } from 'lucide-react';

export default function LoginSignup() {
  const { lang, t } = useLanguage();
  const { loginWithCredentials, registerUser } = useAuth();
  const { workers } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const [role, setRole] = useState(roleParam === 'worker' ? 'worker' : roleParam === 'admin' ? 'admin' : 'customer');
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync role if query parameter changes
  useEffect(() => {
    if (roleParam === 'worker') setRole('worker');
    else if (roleParam === 'admin') setRole('admin');
    else if (roleParam === 'customer') setRole('customer');
  }, [roleParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (role === 'admin') {
      const cleanPass = (password || '').trim();
      const cleanId = (identifier || '').toLowerCase().trim();
      if (
        cleanPass.toUpperCase() === 'APADMIN@2026' ||
        cleanPass === '9848' ||
        cleanPass === 'admin123' ||
        cleanId === 'admin@skillconnect.gov.in'
      ) {
        const res = loginWithCredentials(identifier || 'admin@skillconnect.gov.in', password, 'admin');
        if (res.success) {
          navigate('/admin-dashboard');
          return;
        }
      }
      setErrorMsg(lang === 'te' ? 'చెల్లని అడ్మిన్ పాస్‌వర్డ్ లేదా ఈమెయిల్. ప్రాప్యత నిరాకరించబడింది.' : 'Invalid Admin Passcode or Email. Unauthorized access restricted.');
      return;
    }

    if (mode === 'login') {
      const res = loginWithCredentials(identifier, password, role);
      if (!res.success) {
        setErrorMsg(res.message || (lang === 'te' ? 'లాగిన్ విఫలమైంది. దయచేసి వివరాలు సరిచూసుకోండి.' : 'Login failed. Please verify your credentials or register below.'));
        return;
      }
      if (res.role === 'customer') navigate('/customer-dashboard');
      else if (res.role === 'worker') navigate('/worker-dashboard');
      else navigate('/admin-dashboard');
    } else {
      // Register mode for customer
      const newUser = registerUser({
        name: name || "Customer User",
        phone: phone || identifier || "+91 98765 43210",
        email: identifier.includes('@') ? identifier : `${identifier}@skillconnect.ap`,
        password: password || "password123",
        role: role,
        serviceArea: "Vijayawada"
      });

      if (role === 'customer') navigate('/customer-dashboard');
      else if (role === 'worker') navigate('/worker-dashboard');
      else navigate('/admin-dashboard');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 130px)',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '920px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {/* Left Side: Photo Banner Showcase */}
        <div className="login-banner-side" style={{
          flex: '1 1 420px',
          position: 'relative',
          minHeight: '440px',
          backgroundImage: `url('/hero-banner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2.5rem'
        }}>
          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(16, 33, 63, 0.25) 0%, rgba(16, 33, 63, 0.88) 100%)'
          }} />

          <div style={{ position: 'relative', zIndex: 2, color: '#FFFFFF' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', lineHeight: 1.2 }}>
              Join SkillConnect
            </h2>
            <p style={{ fontSize: '1rem', color: '#E2E8F0', margin: 0, opacity: 0.95 }}>
              Get verified, find work, build a better future.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Authentication Form */}
        <div style={{
          flex: '1 1 420px',
          padding: '2.5rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo & Platform Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#0F766E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10213F', lineHeight: 1.1 }}>
                SkillConnect
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Smart Community Labour Network
              </div>
            </div>
          </div>

          {/* 3 Role Selection Tabs (Customer | Worker | Admin) */}
          <div style={{
            backgroundColor: '#F1F5F9',
            borderRadius: '999px',
            padding: '4px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setRole('customer'); setMode('login'); setErrorMsg(''); }}
              style={{
                border: 'none',
                padding: '0.55rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: role === 'customer' ? 700 : 500,
                backgroundColor: role === 'customer' ? '#0F766E' : 'transparent',
                color: role === 'customer' ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('worker'); setMode('login'); setErrorMsg(''); }}
              style={{
                border: 'none',
                padding: '0.55rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: role === 'worker' ? 700 : 500,
                backgroundColor: role === 'worker' ? '#0F766E' : 'transparent',
                color: role === 'worker' ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Worker
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setMode('login'); setErrorMsg(''); }}
              style={{
                border: 'none',
                padding: '0.55rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
                fontWeight: role === 'admin' ? 700 : 500,
                backgroundColor: role === 'admin' ? '#0F766E' : 'transparent',
                color: role === 'admin' ? '#FFFFFF' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Admin
            </button>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              borderRadius: '8px',
              padding: '0.65rem 0.9rem',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <ShieldAlert size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && role === 'customer' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                {role === 'admin' ? 'Admin Official Email or ID *' : role === 'worker' ? 'Worker Mobile Number or Email *' : 'Mobile Number or Email *'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  role === 'admin' 
                    ? 'admin@skillconnect.gov.in' 
                    : role === 'worker' 
                    ? 'Enter registered mobile (e.g. 9848915830)' 
                    : 'Enter mobile number or email'
                }
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', margin: 0 }}>
                  {role === 'admin' ? 'Security Passcode *' : 'Password *'}
                </label>
                {role !== 'admin' && mode === 'login' && (
                  <span
                    onClick={() => alert(lang === 'te' ? 'దయచేసి మీరు నమోదు చేసుకున్న పాస్‌వర్డ్‌ను ఉపయోగించండి.' : 'Please enter the password you chose during registration.')}
                    style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={role === 'admin' ? 'Enter admin passcode' : 'Enter password'}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0F766E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '0.25rem',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)'
              }}
            >
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Register Link Switcher (Hidden for admin) */}
          {role !== 'admin' && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.86rem', color: '#64748B' }}>
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  {role === 'worker' ? (
                    <Link to="/register-worker" style={{ color: '#0F766E', fontWeight: 700, textDecoration: 'none' }}>
                      Register
                    </Link>
                  ) : (
                    <span
                      onClick={() => setMode('register')}
                      style={{ color: '#0F766E', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Register
                    </span>
                  )}
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setMode('login')}
                    style={{ color: '#0F766E', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-banner-side {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
