import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  ArrowLeft,
  X,
  Send,
  AlertTriangle,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function WorkerProfile() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const { workers, createBooking } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  // Booking Form State
  const [jobTitle, setJobTitle] = useState('');
  const [serviceAddress, setServiceAddress] = useState('Flat 402, Sai Residency, Benz Circle, Vijayawada');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobDescription, setJobDescription] = useState('');

  const worker = workers.find(w => w.id === id) || workers[0];

  if (!worker) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Worker profile not found</h2>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Worker Search
        </Link>
      </div>
    );
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    createBooking({
      customerUid: currentUser?.uid || "cust-demo-1",
      customerName: currentUser?.name || "Keerthana Rao",
      workerUid: worker.id,
      workerName: worker.name,
      skillName: worker.skills?.[0]?.nameEn || "General Service",
      title: jobTitle,
      description: jobDescription,
      serviceAddress: serviceAddress,
      serviceArea: worker.serviceArea,
      requestedDate: workDate
    });

    setBookingModalOpen(false);
    setSuccessBanner(true);
    setTimeout(() => {
      navigate('/customer-dashboard');
    }, 1800);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-navy)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>{lang === 'te' ? 'కార్మికుల జాబితాకు తిరిగి వెళ్ళండి' : 'Back to Worker Directory'}</span>
        </Link>

        {/* Success Alert */}
        {successBanner && (
          <div style={{
            backgroundColor: '#D1FAE5',
            border: '1.5px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#065F46'
          }} className="animate-fade-in">
            <CheckCircle2 size={24} />
            <div>
              <strong>{lang === 'te' ? 'బుకింగ్ అభ్యర్థన విజయవంతంగా పంపబడింది!' : 'Booking Request Successfully Sent!'}</strong>
              <div style={{ fontSize: '0.85rem' }}>
                {lang === 'te' ? 'కస్టమర్ డాష్‌బోర్డ్‌కు దారి మళ్లిస్తోంది...' : 'Redirecting to your Customer Dashboard to track quotation...'}
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Profile Card & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Profile Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--color-primary-light)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  />
                  {worker.verificationStatus === 'verified' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        padding: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                      title="Verified Identity"
                    >
                      <ShieldCheck size={18} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <h1 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', fontWeight: 800 }}>
                      {worker.name}
                    </h1>
                    {worker.verificationStatus === 'verified' ? (
                      <span className="badge badge-verified">
                        <ShieldCheck size={13} /> {t('profile.verifiedWorker')}
                      </span>
                    ) : (
                      <span className="badge badge-pending">
                        <Clock size={13} /> {t('profile.pendingVerification')}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    <MapPin size={16} style={{ color: 'var(--color-primary-dark)' }} />
                    <span>{worker.serviceArea} (AP)</span>
                    <span>•</span>
                    <Award size={16} />
                    <span>{worker.experienceYears} {t('search.experienceYears')}</span>
                  </div>

                  <div>
                    <StarRating rating={worker.rating} count={worker.reviewCount} size={18} />
                  </div>
                </div>
              </div>

              {/* Skills Tags List */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-navy)' }}>
                  {t('profile.skillsOffered')}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {worker.skills?.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: '#1a7a49',
                        padding: '0.35rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {lang === 'te' ? (s.nameTe || s.nameEn) : s.nameEn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About Worker Section */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                {t('profile.aboutWorker')}
              </h2>
              <p style={{ color: 'var(--color-navy)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {worker.bio || "Experienced local professional with comprehensive expertise in maintenance, structural repairs, and residential fittings. Committed to punctuality, clean site maintenance, and fair quotation estimates."}
              </p>

              <div style={{
                marginTop: '1.25rem',
                backgroundColor: 'var(--color-bg-page)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ color: 'var(--color-text-muted)' }}>{t('profile.availability')}</div>
                  <strong style={{ color: worker.availability === 'available' ? '#059669' : '#D97706', textTransform: 'capitalize' }}>
                    ● {worker.availability}
                  </strong>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-muted)' }}>Response Time</div>
                  <strong style={{ color: 'var(--color-navy)' }}>Under 2 hours</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-muted)' }}>Service Radius</div>
                  <strong style={{ color: 'var(--color-navy)' }}>Within 25 km</strong>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>
                  {t('profile.customerReviews')}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {worker.reviewCount} total reviews
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy)' }}>Keerthana Rao (Benz Circle)</strong>
                    <StarRating rating={5.0} size={14} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: 1.5 }}>
                    "Very professional work! Arrived on time, inspected the leaking pipe, and provided an accurate quotation. Cleaned up the site after finishing."
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Verified Completed Job • October 15, 2026
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy)' }}>Praveen Kumar (Gunadala)</strong>
                    <StarRating rating={4.8} size={14} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: 1.5 }}>
                    "Transparent quotation and polite behaviour. Work was completed according to schedule."
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Verified Completed Job • October 8, 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Action Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{
              boxShadow: 'var(--shadow-md)',
              border: '1.5px solid var(--color-primary)',
              padding: '1.75rem'
            }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {t('profile.indicativeRate')}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                    ₹{worker.indicativeWage}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    / day (Estimate)
                  </span>
                </div>
              </div>

              {/* Mandatory Quotation Notice Box */}
              <div style={{
                backgroundColor: 'var(--color-primary-light)',
                border: '1px solid #b7e3ca',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                color: '#065F46'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>{lang === 'te' ? 'పారదర్శక కొటేషన్ విధానం' : 'Transparent Quotation Policy'}</strong>
                    <p style={{ marginTop: '0.25rem' }}>
                      {t('profile.quotationNotice')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Booking CTA */}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <Calendar size={18} />
                <span>{t('profile.requestBookingBtn')}</span>
              </button>

              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-primary-dark)' }} />
                  <span>Free quotation request — zero upfront booking fee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-primary-dark)' }} />
                  <span>Direct phone contact unlocked upon quote acceptance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-primary-dark)' }} />
                  <span>Community dispute mediation support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Request Modal */}
      {bookingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)' }}>
                {t('profile.modalTitle')} {worker.name}
              </h2>
              <button
                onClick={() => setBookingModalOpen(false)}
                style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('profile.jobTitle')} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={t('profile.jobTitlePlaceholder')}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('profile.workDate')} *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('profile.serviceAddress')} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={t('profile.serviceAddressPlaceholder')}
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('profile.jobDescription')}</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder={t('profile.jobDescPlaceholder')}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div style={{
                backgroundColor: 'var(--color-bg-page)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)'
              }}>
                💬 The worker will review your requirements and provide an itemized quotation before any visit or charge.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  {t('profile.close')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, gap: '0.4rem' }}
                >
                  <Send size={16} />
                  <span>{t('profile.submitRequest')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
