import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Wrench, ShieldAlert } from 'lucide-react';

export default function LoginSignup() {
  const { lang, t } = useLanguage();
  const { loginAs, loginWithCredentials, registerUser } = useAuth();
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

    if (mode === 'login') {
      const res = loginWithCredentials(identifier, password, role);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed. Please verify your credentials.');
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

  const handleGoogleSignIn = () => {
    loginAs(role);
    if (role === 'customer') navigate('/customer-dashboard');
    else if (role === 'worker') navigate('/worker-dashboard');
    else navigate('/admin-dashboard');
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
        maxWidth: '960px',
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
              onClick={() => { setRole('customer'); setErrorMsg(''); }}
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
              onClick={() => { setRole('worker'); setErrorMsg(''); }}
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
              onClick={() => { setRole('admin'); setErrorMsg(''); }}
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
            {mode === 'register' && (
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
                Mobile Number or Email *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter mobile number or email"
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
                  Password *
                </label>
                {mode === 'login' && (
                  <span
                    onClick={() => alert(lang === 'te' ? 'దయచేసి మీ మొబైల్ OTP లేదా అడ్మిన్‌ను సంప్రదించండి.' : 'Default demo password is password123 (or APADMIN@2026 for admin)')}
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
                placeholder="Enter password"
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

          {/* Register Link Switcher */}
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

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.35rem 0',
            color: '#94A3B8',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            <span style={{ padding: '0 0.75rem' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          </div>

          {/* Sign in with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '0.68rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
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
