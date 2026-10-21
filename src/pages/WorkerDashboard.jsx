import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Send, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  Play,
  X,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function WorkerDashboard() {
  const { lang, t } = useLanguage();
  const { bookings, submitQuotation, updateJobStatus, workers } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'active' | 'completed'
  const [quoteModalBooking, setQuoteModalBooking] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('1800');
  const [quoteTime, setQuoteTime] = useState('1 Day (approx 6-8 hrs)');
  const [quoteNotes, setQuoteNotes] = useState('Detailed site inspection required; includes labour charge and standard consumable adhesives.');
  const [availability, setAvailability] = useState('available');
  const [notice, setNotice] = useState('');

  // Find worker record matching currentUser or default
  const workerProfile = workers.find(w => w.id === currentUser?.uid || w.name === currentUser?.name) || workers[0];

  const workerBookings = bookings.filter(b => 
    b.workerUid === workerProfile?.id || b.workerName === workerProfile?.name || !b.workerUid
  );

  const incomingRequests = workerBookings.filter(b => b.status === 'requested');
  const ongoingJobs = workerBookings.filter(b => 
    b.status === 'quoted' || b.status === 'quote_accepted' || b.status === 'scheduled' || b.status === 'in_progress' || b.status === 'worker_completed'
  );
  const completedJobs = workerBookings.filter(b => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((acc, curr) => acc + (curr.quotation?.amountINR || 1200), 0);

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!quoteModalBooking) return;

    submitQuotation(quoteModalBooking.id, {
      amountINR: parseInt(quoteAmount, 10),
      estimatedTime: quoteTime,
      notes: quoteNotes
    });

    setQuoteModalBooking(null);
    showNotice(lang === 'te' ? 'కొటేషన్ విజయవంతంగా కస్టమర్‌కు పంపబడింది!' : 'Quotation successfully sent to customer for review.');
  };

  const handleStartWork = (bookingId) => {
    updateJobStatus(bookingId, 'in_progress');
    showNotice(lang === 'te' ? 'పని ప్రారంభించబడింది!' : 'Job marked as in progress.');
  };

  const handleFinishWork = (bookingId) => {
    updateJobStatus(bookingId, 'worker_completed');
    showNotice(lang === 'te' ? 'పని పూర్తయినట్లు నమోదు చేయబడింది! కస్టమర్ నిర్ధారణ కోసం ఎదురుచూస్తోంది.' : 'Work marked completed! Awaiting customer confirmation.');
  };

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Welcome & Top Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)' }}>
                {t('dashboards.worker.title')}
              </h1>
              {workerProfile?.verificationStatus === 'verified' ? (
                <span className="badge badge-verified">
                  <ShieldCheck size={13} /> {t('profile.verifiedWorker')}
                </span>
              ) : (
                <span className="badge badge-pending">
                  <Clock size={13} /> {t('profile.pendingVerification')}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {t('dashboards.worker.welcome')}, <strong>{workerProfile?.name || "Aarav Reddy"}</strong> ({workerProfile?.serviceArea})
            </p>
          </div>

          {/* Availability Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FFFFFF',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {t('dashboards.worker.availabilityToggle')}:
            </span>
            <select
              className="form-select"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                showNotice(`Availability status updated to ${e.target.value}.`);
              }}
            >
              <option value="available">🟢 Available Now</option>
              <option value="busy">🟡 Busy on Site</option>
              <option value="unavailable">🔴 Off Duty</option>
            </select>
          </div>
        </div>

        {/* Action Flash Notification */}
        {notice && (
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
            <span>{notice}</span>
          </div>
        )}

        {/* Verification Status Alert banner if pending */}
        {workerProfile?.verificationStatus === 'pending' && (
          <div style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            color: '#92400E'
          }}>
            <Clock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.875rem' }}>
              <strong>Identity Verification Under Review:</strong>
              <p style={{ marginTop: '0.2rem' }}>
                Your masked Aadhaar upload has been queued for platform administration verification. Once approved, the verified badge will appear on your public card.
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>New Requests</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
              {incomingRequests.length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active & Scheduled Jobs</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
              {ongoingJobs.length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Completed Jobs</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
              {completedJobs.length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Earned</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
              ₹{totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('requests')}
            className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline'}`}
          >
            {t('dashboards.worker.incomingRequests')} ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
          >
            {t('dashboards.worker.activeJobs')} ({ongoingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          >
            {t('dashboards.worker.completedJobs')} ({completedJobs.length})
          </button>
        </div>

        {/* Tab 1: Incoming Booking Requests */}
        {activeTab === 'requests' && (
          incomingRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {incomingRequests.map((b) => (
                <div key={b.id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>{b.title}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Client: <strong>{b.customerName}</strong> • Date: <strong>{b.requestedDate}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setQuoteModalBooking(b)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Send size={15} />
                      <span>{t('dashboards.worker.sendQuotation')}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-navy)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {b.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} style={{ color: 'var(--color-primary-dark)' }} />
                    <span>{b.serviceAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
              No pending booking requests at this time. New customer inquiries will appear here.
            </div>
          )
        )}

        {/* Tab 2: Active & Scheduled Jobs */}
        {activeTab === 'active' && (
          ongoingJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {ongoingJobs.map((b) => (
                <div key={b.id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>{b.title}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Client: <strong>{b.customerName}</strong> • Scheduled Date: <strong>{b.requestedDate}</strong>
                      </div>
                    </div>

                    {b.quotation && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Agreed Quote</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                          ₹{b.quotation.amountINR}
                        </div>
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                    {b.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <MapPin size={15} style={{ color: 'var(--color-primary-dark)' }} />
                    <span>{b.serviceAddress}</span>
                  </div>

                  {/* Actions depending on stage */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {b.status === 'quoted' && 'Waiting for customer to review and accept your quotation.'}
                      {b.status === 'quote_accepted' && 'Customer accepted quote. Ready to begin work.'}
                      {b.status === 'in_progress' && 'Work currently in progress.'}
                      {b.status === 'worker_completed' && 'You marked this complete. Waiting for customer confirmation.'}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {b.status === 'quote_accepted' && (
                        <button
                          onClick={() => handleStartWork(b.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Play size={14} />
                          <span>{t('dashboards.worker.markStarted')}</span>
                        </button>
                      )}

                      {b.status === 'in_progress' && (
                        <button
                          onClick={() => handleFinishWork(b.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>{t('dashboards.worker.markComplete')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
              No active jobs running at the moment.
            </div>
          )
        )}

        {/* Tab 3: Completed Jobs */}
        {activeTab === 'completed' && (
          completedJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {completedJobs.map((b) => (
                <div key={b.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{b.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StatusBadge status="completed" />
                      <strong style={{ fontSize: '1.1rem', color: '#059669' }}>
                        ₹{b.quotation?.amountINR || 1200}
                      </strong>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Client: {b.customerName} • Work Date: {b.requestedDate}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
              No completed work records yet.
            </div>
          )
        )}
      </div>

      {/* Quotation Submission Modal */}
      {quoteModalBooking && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{t('dashboards.worker.sendQuotation')}</h2>
              <button onClick={() => setQuoteModalBooking(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSendQuote} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Client & Job Requirement</label>
                <input
                  type="text"
                  disabled
                  className="form-input"
                  value={`${quoteModalBooking.title} (for ${quoteModalBooking.customerName})`}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('dashboards.worker.amountINR')} *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    required
                    className="form-input"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('dashboards.worker.estimatedDays')} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. 1 Day (approx 6-8 hrs)"
                  value={quoteTime}
                  onChange={(e) => setQuoteTime(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('dashboards.worker.quoteNotes')} *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="Specify what is covered (labour, tools, materials, inspection)..."
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuoteModalBooking(null)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, gap: '0.4rem' }}>
                  <Send size={16} />
                  <span>Send Quotation to Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
