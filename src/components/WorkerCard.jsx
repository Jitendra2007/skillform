import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import StarRating from './StarRating';
import { MapPin, ShieldCheck, Clock, Award, ChevronRight } from 'lucide-react';

export default function WorkerCard({ worker }) {
  const { lang, t } = useLanguage();

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header with Image and Badges */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={worker.avatar}
            alt={worker.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-primary-light)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
            }}
          />
          {worker.verificationStatus === 'verified' && (
            <div
              title={t('profile.verifiedWorker')}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              <ShieldCheck size={14} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: 700 }}>
              {worker.name}
            </h3>
            {worker.verificationStatus === 'verified' ? (
              <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} /> {lang === 'te' ? 'ధృవీకరించబడింది' : 'Verified'}
              </span>
            ) : (
              <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                <Clock size={12} /> {lang === 'te' ? 'పెండింగ్' : 'Pending'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            <MapPin size={14} style={{ color: 'var(--color-primary-dark)' }} />
            <span>{worker.serviceArea}</span>
            <span style={{ margin: '0 0.25rem' }}>•</span>
            <Award size={14} />
            <span>{worker.experienceYears} {t('search.experienceYears')}</span>
          </div>

          <div style={{ marginTop: '0.4rem' }}>
            <StarRating rating={worker.rating} count={worker.reviewCount} />
          </div>
        </div>
      </div>

      {/* Skills Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {worker.skills?.map((skill, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: 'var(--color-bg-page)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-navy)',
              fontSize: '0.78rem',
              fontWeight: 500,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {lang === 'te' ? (skill.nameTe || skill.nameEn) : skill.nameEn}
          </span>
        ))}
      </div>

      {/* Bio snippet */}
      {worker.bio && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {worker.bio}
        </p>
      )}

      {/* Pricing & Mandatory Quotation Notice */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {lang === 'te' ? 'రోజువారీ వేతనం (అంచనా)' : 'Indicative Wage'}
          </span>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)' }}>
            ₹{worker.indicativeWage} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ day</span>
          </span>
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: '#047857',
          backgroundColor: 'var(--color-primary-light)',
          padding: '0.35rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          fontWeight: 500
        }}>
          {t('search.quotationRequired')}
        </div>

        <Link
          to={`/worker/${worker.id}`}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem' }}
        >
          <span>{t('search.viewProfile')}</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
