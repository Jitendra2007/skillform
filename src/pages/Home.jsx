import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import WorkerCard from '../components/WorkerCard';
import { AP_CITIES } from '../lib/constants';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Hammer,
  Droplets,
  Zap,
  Paintbrush,
  Brush,
  Truck,
  Flower2,
  Settings,
  Star
} from 'lucide-react';

const CATEGORY_ICONS = {
  1: Hammer,       // Masonry
  2: Droplets,     // Plumbing
  3: Settings,     // Carpentry
  4: Zap,          // Electrical
  5: Paintbrush,   // Painting
  6: Brush,        // Cleaning
  7: Truck,        // Moving
  8: Flower2       // Gardening
};

export default function Home() {
  const { lang, t } = useLanguage();
  const { workers, skillsList } = useData();
  const navigate = useNavigate();

  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSkill) params.set('skill', selectedSkill);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedDate) params.set('date', selectedDate);
    navigate(`/search?${params.toString()}`);
  };

  // Select top 6 verified workers
  const topWorkers = workers
    .filter(w => w.verificationStatus === 'verified')
    .slice(0, 6);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="section-hero" style={{
        backgroundColor: 'var(--color-bg-page)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          {/* High-Resolution Hero Banner with smiling AP workers */}
          <div className="hero-banner-container" style={{ marginBottom: '1.75rem' }}>
            <img
              src="/hero-banner.png"
              alt="Andhra Pradesh Verified Skilled Workers Team"
              className="hero-banner-img"
              loading="eager"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="hero-banner-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#10213F',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem'
                  }}>
                    <ShieldCheck size={14} />
                    <span>{lang === 'te' ? 'ఆంధ్రప్రదేశ్ ధృవీకరించబడిన శ్రామిక శక్తి' : 'AP Verified Skilled Workforce'}</span>
                  </div>
                  <div style={{ fontSize: 'clamp(1rem, 2.3vw, 1.35rem)', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.25 }}>
                    {lang === 'te' ? 'నైపుణ్యం కలిగిన స్థానిక కార్మికులు • పారదర్శక కొటేషన్లు' : 'Verified Community Labour Network • Direct Transparent Quotes'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: 'rgba(16, 33, 63, 0.85)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Star size={13} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                    <span>4.9/5 Rating</span>
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(16, 33, 63, 0.85)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                    <span>26 AP Districts</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Left Col: Headings & Value Prop */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-primary-light)',
                color: '#1a7a49',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                <Sparkles size={15} />
                <span>{lang === 'te' ? 'నమ్మకమైన స్థానిక కార్మిక వేదిక' : 'Smart Community Labour Platform'}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.65rem, 3.2vw, 2.75rem)',
                color: 'var(--color-navy)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {t('home.heroTitle')}
              </h1>

              <p style={{
                fontSize: '0.98rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.55,
                marginBottom: '1.25rem',
                maxWidth: '540px'
              }}>
                {t('home.heroSubtitle')}
              </p>

              {/* Quick stats pills */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.1 }}>30+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Trades</div>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--color-border)' }} />
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.1 }}>26 Districts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Across AP</div>
                </div>
                <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--color-border)' }} />
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1.1 }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Transparent Quotes</div>
                </div>
              </div>
            </div>

            {/* Right Col: High-End Hero Search Card */}
            <div>
              <div className="card" style={{
                boxShadow: 'var(--shadow-md)',
                border: '1.5px solid #d1ecdc',
                padding: '1.35rem'
              }}>
                <h2 style={{ fontSize: '1.18rem', marginBottom: '0.25rem', color: 'var(--color-navy)' }}>
                  {lang === 'te' ? 'కార్మికులను వెంటనే వెతకండి' : 'Search Local Workers'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  {lang === 'te' ? 'నిమిషాల్లో కొటేషన్ పొందడానికి వివరాలను ఎంచుకోండి' : 'Select trade & locality to view available verified professionals.'}
                </p>

                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Skill select */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      {lang === 'te' ? 'నైపుణ్యం / వృత్తి' : 'Skill / Trade Category'}
                    </label>
                    <select
                      className="form-select"
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                      <option value="">{t('search.allSkills')}</option>
                      {skillsList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {lang === 'te' ? (s.name_te || s.name_en) : s.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location select */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      {lang === 'te' ? 'ప్రాంతం (నగరం/టౌన్)' : 'Service Area / City'}
                    </label>
                    <select
                      className="form-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">{t('search.allLocations')}</option>
                      {AP_CITIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn} ({c.nameTe})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Input */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{t('home.searchDate')}</label>
                    <input
                      type="date"
                      className="form-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ marginTop: '0.25rem', width: '100%', gap: '0.45rem' }}
                  >
                    <Search size={17} />
                    <span>{t('home.findWorkersBtn')}</span>
                  </button>
                </form>

                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.55rem',
                  backgroundColor: 'var(--color-bg-page)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  textAlign: 'center'
                }}>
                  🛡️ <em>{t('search.quotationRequired')}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Service Categories Section */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                {t('home.popularCategories')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                {lang === 'te' ? 'రోజువారీ గృహ మరియు నిర్మాణ అవసరాల కోసం సేవలను అన్వేషించండి' : 'Browse verified local experts categorized by trade and specialized labor'}
              </p>
            </div>
            <Link
              to="/categories"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>{t('home.viewAllCategories')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-4">
            {skillsList.slice(0, 8).map((skill) => {
              const IconComp = CATEGORY_ICONS[skill.id] || Hammer;
              return (
                <Link
                  key={skill.id}
                  to={`/search?skill=${skill.id}`}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.95rem 1.1rem',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-primary-light)',
                    color: '#1a7a49',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: 600 }}>
                      {lang === 'te' ? (skill.name_te || skill.name_en) : skill.name_en}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {lang === 'te' ? 'కార్మికులు ఉన్నారు' : 'Available Experts'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Top-Rated Workers Showcase */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-page)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#1a7a49',
                fontWeight: 700,
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.25rem'
              }}>
                <ShieldCheck size={15} />
                <span>{lang === 'te' ? 'ధృవీకరించబడిన నిపుణులు' : 'Identity Verified'}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                {t('home.topRatedWorkers')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                {lang === 'te' ? 'విజయవాడ మరియు రాజధాని ప్రాంతంలో అత్యుత్తమ రేటింగ్ పొందిన స్థానిక కార్మికులు' : 'Top reviewed workers with confirmed skillsets and community ratings'}
              </p>
            </div>

            <Link to="/search" className="btn btn-secondary btn-sm">
              <span>{lang === 'te' ? 'మరింత మందిని చూడండి' : 'Explore All Workers'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-3">
            {topWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why SkillConnect Benefits */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              {t('home.benefitsTitle')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {lang === 'te' ? 'కార్మికులు మరియు కస్టమర్ల మధ్య విశ్వసనీయ సంబంధాన్ని నిర్మించే ఆధునిక వేదిక' : 'Built specifically for transparent local labour networking with zero middlemen commission exploitation.'}
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
                {t('home.benefit1Title')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {t('home.benefit1Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
                {t('home.benefit2Title')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {t('home.benefit2Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
                {t('home.benefit3Title')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {t('home.benefit3Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
                {t('home.benefit4Title')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                {t('home.benefit4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Worker Call To Action Banner */}
      <section style={{
        padding: '2.75rem 0',
        backgroundColor: '#10213F',
        color: '#FFFFFF'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(114, 201, 154, 0.2)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.65rem'
              }}>
                {lang === 'te' ? 'కార్మికుల కోసం' : 'For Skilled Professionals'}
              </div>
              <h2 style={{ fontSize: '1.55rem', color: '#FFFFFF', marginBottom: '0.65rem' }}>
                {lang === 'te' ? 'మీరు నైపుణ్యం కలిగిన కార్మికులా? ఇప్పుడే నమోదు చేసుకోండి' : 'Are You a Skilled Worker? Join the Network Today'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.55 }}>
                {lang === 'te'
                  ? 'కస్టమర్ల నుండి నేరుగా కొటేషన్ అభ్యర్థనలు పొందండి, మీ నైపుణ్యాలను ప్రదర్శించండి మరియు ఆంధ్రప్రదేశ్ అంతటా మీ పని అవకాశాలను పెంచుకోండి.'
                  : 'Get booking requests directly across all districts of Andhra Pradesh, provide transparent quotations, and build a verified professional reputation.'}
              </p>
            </div>

            <Link to="/register-worker" className="btn btn-primary btn-lg">
              <span>{lang === 'te' ? 'కార్మికుల నమోదు ఫారమ్' : 'Register as Worker'}</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
