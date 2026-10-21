import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, ShieldCheck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: '#10213F',
      color: '#E2E8F0',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--color-primary)',
                color: '#10213F',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wrench size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
                SkillConnect
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {t('home.heroSubtitle')}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(114, 201, 154, 0.15)',
              color: 'var(--color-primary)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <ShieldCheck size={16} />
              <span>{lang === 'te' ? 'ధృవీకరించబడిన స్థానిక ప్లాట్‌ఫారమ్' : 'Community Trust & Verification'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {lang === 'te' ? 'త్వరిత లింకులు' : 'Quick Links'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/search" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                  {t('nav.findWorkers')}
                </Link>
              </li>
              <li>
                <Link to="/categories" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/register-worker" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                  {lang === 'te' ? 'కార్మికుల నమోదు' : 'Join as Worker'}
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                  {t('nav.adminDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {t('home.popularCategories')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/search?skill=2" style={{ color: '#94A3B8' }}>{t('categories.plumbing')}</Link></li>
              <li><Link to="/search?skill=4" style={{ color: '#94A3B8' }}>{t('categories.electrical')}</Link></li>
              <li><Link to="/search?skill=1" style={{ color: '#94A3B8' }}>{t('categories.masonry')}</Link></li>
              <li><Link to="/search?skill=3" style={{ color: '#94A3B8' }}>{t('categories.carpentry')}</Link></li>
              <li><Link to="/search?skill=5" style={{ color: '#94A3B8' }}>{t('categories.painting')}</Link></li>
              <li><Link to="/search?skill=6" style={{ color: '#94A3B8' }}>{t('categories.cleaning')}</Link></li>
            </ul>
          </div>

          {/* Service Area & College Project Notice */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {lang === 'te' ? 'సేవా పరిధి & సంప్రదింపు' : 'Service Hub'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Serving All 26 Districts Across Andhra Pradesh (AP)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                <span>1800-425-SKILL (Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                <span>support@skillconnect.local</span>
              </div>
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                lineHeight: 1.4,
                color: '#CBD5E1'
              }}>
                🔒 <strong>Privacy Guard</strong>: Identity documents are stored privately for admin verification only. Full Aadhaar numbers are never displayed.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <div>
            © 2026 SkillConnect — Smart Community Labour Networking Platform. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Andhra Pradesh State Network</span>
            <span>React + Vite + Firebase</span>
            <span>English & తెలుగు</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
