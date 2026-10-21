import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { Wrench, User, Briefcase, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LoginSignup() {
  const { lang, t } = useLanguage();
  const { loginAs, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('customer'); // 'customer' | 'worker'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      loginAs(role);
    } else {
      const newUser = {
        uid: `u-${Date.now()}`,
        name: name || "Customer User",
        phone: phone || "+91 98765 43210",
        email: email || "member@skillconnect.local",
        role: role,
        serviceArea: "Vijayawada"
      };
      setCurrentUser(newUser);
    }

    if (role === 'customer') navigate('/customer-dashboard');
    else if (role === 'worker') navigate('/worker-dashboard');
    else navigate('/admin-dashboard');
  };

  const handleQuickDemoLogin = (targetRole) => {
    loginAs(targetRole);
    if (targetRole === 'customer') navigate('/customer-dashboard');
    else if (targetRole === 'worker') navigate('/worker-dashboard');
    else navigate('/admin-dashboard');
  };

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '4.5rem' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        {/* Top Brand Card */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Wrench size={28} />
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
            {mode === 'login' ? 'Sign In to SkillConnect' : 'Create an Account'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {lang === 'te' ? 'కమ్యూనిటీ లేబర్ నెట్‌వర్కింగ్ ప్లాట్‌ఫారమ్' : 'Smart Community Labour Networking Platform'}
          </p>
        </div>

        {/* 1-Click Examiner Quick Login Helper Box */}
        <div style={{
          backgroundColor: '#10213F',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.65rem' }}>
            ⚡ Instant 1-Click Examiner & Presentation Demo Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '0.78rem' }}
            >
              👤 Customer (Keerthana)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('worker')}
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontSize: '0.78rem' }}
            >
              🔨 Worker (Aarav Reddy)
            </button>
          </div>
          <button
            onClick={() => handleQuickDemoLogin('admin')}
            className="btn btn-sm"
            style={{ width: '100%', marginTop: '0.5rem', backgroundColor: '#F59E0B', color: '#10213F', fontSize: '0.78rem', fontWeight: 700 }}
          >
            🛡️ Platform Admin (Inspector)
          </button>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-page)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
                color: mode === 'login' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
                color: mode === 'register' ? 'var(--color-navy)' : 'var(--color-text-muted)',
                boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Register
            </button>
          </div>

          {/* Role Choice */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">I am joining as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  border: role === 'customer' ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: role === 'customer' ? 'var(--color-primary-light)' : '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <User size={16} />
                <span>Customer</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  border: role === 'worker' ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: role === 'worker' ? 'var(--color-primary-light)' : '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === 'worker'}
                  onChange={() => setRole('worker')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <Briefcase size={16} />
                <span>Skilled Worker</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {mode === 'register' && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Keerthana Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number (Workers will call you on this) *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', gap: '0.4rem' }}
            >
              <span>{mode === 'login' ? 'Sign In' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {role === 'worker' && mode === 'register' && (
            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem' }}>
              Want to upload Aadhaar documents right now?{' '}
              <Link to="/register-worker" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                Use Full Worker Onboarding Form →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
