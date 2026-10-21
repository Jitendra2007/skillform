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
  Settings
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
      <section style={{
        backgroundColor: 'var(--color-bg-page)',
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
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
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={16} />
                <span>{lang === 'te' ? 'నమ్మకమైన స్థానిక కార్మిక వేదిక' : 'Verified Community Labour Network'}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
                color: 'var(--color-navy)',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                {t('home.heroTitle')}
              </h1>

              <p style={{
                fontSize: '1.08rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                {t('home.heroSubtitle')}
              </p>

              {/* Quick stats pills */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>30+</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Verified Trades</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>26 Districts</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>All Over Andhra Pradesh</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--color-border)' }} />
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Transparent Quotes</div>
                </div>
              </div>
            </div>

            {/* Right Col: High-End Hero Search Card */}
            <div>
              <div className="card" style={{
                boxShadow: 'var(--shadow-lg)',
                border: '1.5px solid #d1ecdc',
                padding: '2rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  {lang === 'te' ? 'కార్మికులను వెంటనే వెతకండి' : 'Search Local Workers'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  {lang === 'te' ? 'నిమిషాల్లో కొటేషన్ పొందడానికి వివరాలను ఎంచుకోండి' : 'Select trade & locality to view available verified professionals.'}
                </p>

                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <div style={{ position: 'relative' }}>
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
                    style={{ marginTop: '0.5rem', width: '100%', gap: '0.5rem' }}
                  >
                    <Search size={18} />
                    <span>{t('home.findWorkersBtn')}</span>
                  </button>
                </form>

                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.65rem',
                  backgroundColor: 'var(--color-bg-page)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
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
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                {t('home.popularCategories')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                {lang === 'te' ? 'రోజువారీ గృహ మరియు నిర్మాణ అవసరాల కోసం సేవలను అన్వేషించండి' : 'Browse verified local experts categorized by trade and specialized labor'}
              </p>
            </div>
            <Link
              to="/categories"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>{t('home.viewAllCategories')}</span>
              <ArrowRight size={15} />
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
                    gap: '1rem',
                    padding: '1.25rem',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-primary-light)',
                    color: '#1a7a49',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 600 }}>
                      {lang === 'te' ? (skill.name_te || skill.name_en) : skill.name_en}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {lang === 'te' ? 'కార్మికులు అందుబాటులో ఉన్నారు' : 'Available Experts'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Top-Rated Workers Showcase */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-page)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#1a7a49',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem'
              }}>
                <ShieldCheck size={16} />
                <span>{lang === 'te' ? 'ధృవీకరించబడిన నిపుణులు' : 'Identity Verified'}</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                {t('home.topRatedWorkers')}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                {lang === 'te' ? 'విజయవాడ మరియు రాజధాని ప్రాంతంలో అత్యుత్తమ రేటింగ్ పొందిన స్థానిక కార్మికులు' : 'Top reviewed workers with confirmed skillsets and community ratings'}
              </p>
            </div>

            <Link to="/search" className="btn btn-secondary">
              <span>{lang === 'te' ? 'మరింత మందిని చూడండి' : 'Explore All Workers'}</span>
              <ArrowRight size={16} />
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
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              {t('home.benefitsTitle')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              {lang === 'te' ? 'కార్మికులు మరియు కస్టమర్ల మధ్య విశ్వసనీయ సంబంధాన్ని నిర్మించే ఆధునిక వేదిక' : 'Built specifically for transparent local labour networking with zero middlemen commission exploitation.'}
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {t('home.benefit1Title')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {t('home.benefit1Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {t('home.benefit2Title')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {t('home.benefit2Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {t('home.benefit3Title')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {t('home.benefit3Desc')}
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                {t('home.benefit4Title')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {t('home.benefit4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Worker Call To Action Banner */}
      <section style={{
        padding: '3.5rem 0',
        backgroundColor: '#10213F',
        color: '#FFFFFF'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(114, 201, 154, 0.2)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.75rem'
              }}>
                {lang === 'te' ? 'కార్మికుల కోసం' : 'For Skilled Professionals'}
              </div>
              <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
                {lang === 'te' ? 'మీరు నైపుణ్యం కలిగిన కార్మికులా? ఇప్పుడే నమోదు చేసుకోండి' : 'Are You a Skilled Worker? Join the Network Today'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {lang === 'te'
                  ? 'కస్టమర్ల నుండి నేరుగా కొటేషన్ అభ్యర్థనలు పొందండి, మీ నైపుణ్యాలను ప్రదర్శించండి మరియు ఆంధ్రప్రదేశ్ అంతటా మీ పని అవకాశాలను పెంచుకోండి.'
                  : 'Get booking requests directly across all districts of Andhra Pradesh, provide transparent quotations, and build a verified professional reputation.'}
              </p>
            </div>

            <Link to="/register-worker" className="btn btn-primary btn-lg">
              <span>{lang === 'te' ? 'కార్మికుల నమోదు ఫారమ్' : 'Register as Worker'}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
