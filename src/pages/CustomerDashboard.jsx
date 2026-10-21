import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  MessageSquare,
  FileText,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export default function CustomerDashboard() {
  const { lang, t } = useLanguage();
  const { bookings, acceptQuotation, declineQuotation, confirmCompletion } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [complaintModalBooking, setComplaintModalBooking] = useState(null);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const customerBookings = bookings.filter(b => 
    b.customerUid === (currentUser?.uid || "cust-demo-1") || !b.customerUid
  );

  const activeBookings = customerBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = customerBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleAccept = (bookingId) => {
    acceptQuotation(bookingId);
    showNotice(lang === 'te' ? 'కొటేషన్ ఆమోదించబడింది! పని షెడ్యూల్ చేయబడింది.' : 'Quotation accepted! The job is now scheduled.');
  };

  const handleDecline = (bookingId) => {
    declineQuotation(bookingId);
    showNotice(lang === 'te' ? 'కొటేషన్ తిరస్కరించబడింది.' : 'Quotation declined and booking cancelled.');
  };

  const handleConfirmDone = (bookingId) => {
    confirmCompletion(bookingId);
    showNotice(lang === 'te' ? 'పని పూర్తయినట్లు నిర్ధారించబడింది! చెల్లింపు రికార్డ్ సృష్టించబడింది.' : 'Completion confirmed! You can now leave a rating.');
  };

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const submitReview = (e) => {
    e.preventDefault();
    setReviewModalBooking(null);
    setReviewComment('');
    showNotice(lang === 'te' ? 'ధన్యవాదాలు! మీ సమీక్ష నమోదు చేయబడింది.' : 'Thank you! Your rating and review have been published.');
  };

  const submitComplaint = (e) => {
    e.preventDefault();
    setComplaintModalBooking(null);
    setComplaintText('');
    showNotice(lang === 'te' ? 'ఫిర్యాదు అడ్మిన్ విభాగానికి పంపబడింది.' : 'Support ticket filed. Administrator will review within 24 hours.');
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
              {t('dashboards.customer.title')}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {t('dashboards.customer.welcome')}, <strong>{currentUser?.name || "Keerthana Rao"}</strong> ({currentUser?.serviceArea || "Andhra Pradesh"})
            </p>
          </div>

          <Link to="/search" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Search size={16} />
            <span>{t('dashboards.customer.bookNow')}</span>
          </Link>
        </div>

        {/* Action Flash Notification */}
        {actionNotice && (
          <div style={{
            backgroundColor: '#D1FAE5',
            border: '1.5px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: '#065F46',
            fontWeight: 600
          }} className="animate-fade-in">
            <CheckCircle2 size={20} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Quick KPI Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Jobs</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
              {activeBookings.length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Quotations to Review</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
              {activeBookings.filter(b => b.status === 'quoted').length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Completed Services</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
              {pastBookings.filter(b => b.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('active')}
            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
          >
            {t('dashboards.customer.activeBookings')} ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
          >
            {t('dashboards.customer.bookingHistory')} ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {activeTab === 'active' ? (
          activeBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeBookings.map((b) => (
                <div key={b.id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>
                          {b.title}
                        </h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>Booking ID: <strong>{b.id}</strong></span>
                        <span>•</span>
                        <span>{t('dashboards.customer.worker')}: <strong>{b.workerName}</strong> ({b.skillName})</span>
                        <span>•</span>
                        <span>Requested for: <strong>{b.requestedDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-navy)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {b.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <MapPin size={15} style={{ color: 'var(--color-primary-dark)' }} />
                    <span>{b.serviceAddress}</span>
                  </div>

                  {/* Quotation Details Box if status is quoted */}
                  {b.quotation && (
                    <div style={{
                      backgroundColor: 'var(--color-bg-page)',
                      border: '1.5px solid #d1ecdc',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                            {lang === 'te' ? 'కార్మికుడి కొటేషన్ వివరణ' : 'Worker Submitted Quotation'}
                          </span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.15rem' }}>
                            ₹{b.quotation.amountINR}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Estimated Time: <strong>{b.quotation.estimatedTime}</strong>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                        <strong>Scope & Materials:</strong> {b.quotation.notes}
                      </p>

                      {/* Action buttons if pending quotation acceptance */}
                      {b.status === 'quoted' && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAccept(b.id)}
                            className="btn btn-primary btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <ThumbsUp size={15} />
                            <span>{t('dashboards.customer.acceptQuote')}</span>
                          </button>
                          <button
                            onClick={() => handleDecline(b.id)}
                            className="btn btn-outline btn-sm btn-danger"
                            style={{ gap: '0.35rem' }}
                          >
                            <ThumbsDown size={15} />
                            <span>{t('dashboards.customer.declineQuote')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If in progress or worker completed */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      {b.status === 'in_progress' && (
                        <span style={{ color: '#1E40AF', fontWeight: 600 }}>
                          🔨 Worker is currently executing the requested task.
                        </span>
                      )}
                      {b.status === 'worker_completed' && (
                        <span style={{ color: '#059669', fontWeight: 600 }}>
                          ✅ Worker has marked this work finished. Please inspect and confirm below.
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      {(b.status === 'worker_completed' || b.status === 'in_progress') && (
                        <button
                          onClick={() => handleConfirmDone(b.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle size={15} />
                          <span>{t('dashboards.customer.markConfirmed')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setComplaintModalBooking(b)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <AlertCircle size={15} />
                        <span>{t('dashboards.customer.viewComplaint')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                {t('dashboards.customer.noBookings')}
              </p>
              <Link to="/search" className="btn btn-primary btn-sm">
                {t('dashboards.customer.bookNow')}
              </Link>
            </div>
          )
        ) : (
          /* Past Work History Tab */
          pastBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pastBookings.map((b) => (
                <div key={b.id} className="card" style={{ padding: '1.5rem', opacity: b.status === 'cancelled' ? 0.75 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{b.title}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    {b.quotation && (
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-navy)' }}>
                        ₹{b.quotation.amountINR}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Worker: <strong>{b.workerName}</strong> • Completed on {b.requestedDate}
                  </p>
                  {b.status === 'completed' && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => setReviewModalBooking(b)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <Star size={14} style={{ color: '#D97706' }} />
                        <span>{t('dashboards.customer.leaveReview')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              No completed work history found.
            </div>
          )
        )}
      </div>

      {/* Review Modal */}
      {reviewModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Review {reviewModalBooking.workerName}</h2>
              <button onClick={() => setReviewModalBooking(null)}><X size={20} /></button>
            </div>
            <form onSubmit={submitReview}>
              <div className="form-group">
                <label className="form-label">Rating Score</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewScore(star)}
                      style={{ padding: '4px' }}
                    >
                      <Star
                        size={28}
                        fill={star <= reviewScore ? '#F59E0B' : 'transparent'}
                        stroke="#F59E0B"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Feedback / Review</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="Share details of the worker's quality, punctuality, and cleanliness..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setReviewModalBooking(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Submit Rating</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint / Dispute Modal */}
      {complaintModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }}>Report an Issue / Complaint</h2>
              <button onClick={() => setComplaintModalBooking(null)}><X size={20} /></button>
            </div>
            <form onSubmit={submitComplaint}>
              <div className="form-group">
                <label className="form-label">Booking Reference</label>
                <input type="text" disabled className="form-input" value={`${complaintModalBooking.title} (with ${complaintModalBooking.workerName})`} />
              </div>
              <div className="form-group">
                <label className="form-label">Describe the Issue</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Explain what went wrong (e.g. unannounced delay, substandard work, dispute regarding materials)..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Your dispute will be handled directly by platform administrators. Both parties will be contacted.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setComplaintModalBooking(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-danger" style={{ flex: 2 }}>Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
