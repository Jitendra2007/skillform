import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Users, 
  AlertTriangle, 
  Eye, 
  X,
  Lock,
  Building
} from 'lucide-react';

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const { verifications, approveVerification, rejectVerification, complaints, workers, bookings } = useData();
  const { currentUser } = useAuth();

  const [inspectDoc, setInspectDoc] = useState(null);
  const [rejectModalDoc, setRejectModalDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotice, setAdminNotice] = useState('');

  const pendingVerifs = verifications.filter(v => v.status === 'pending');
  const resolvedVerifs = verifications.filter(v => v.status !== 'pending');

  const handleApprove = (vId) => {
    approveVerification(vId);
    showNotice(lang === 'te' ? 'కార్మికుడి ధృవీకరణ ఆమోదించబడింది! ధృవీకరణ బ్యాడ్జ్ జోడించబడింది.' : 'Worker verified! Badge is now active on their public profile.');
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectModalDoc) return;
    rejectVerification(rejectModalDoc.id, rejectReason);
    setRejectModalDoc(null);
    setRejectReason('');
    showNotice(lang === 'te' ? 'ధృవీకరణ తిరస్కరించబడింది.' : 'Verification rejected and remarks recorded.');
  };

  const showNotice = (msg) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(''), 3500);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Admin Header with Shield Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              <ShieldAlert size={15} />
              <span>PROTECTED ADMINISTRATIVE CONTROL</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', color: 'var(--color-navy)' }}>
              {t('dashboards.admin.title')}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              State of Andhra Pradesh • District Labour & Verification Administration Portal
            </p>
          </div>

          <div style={{
            backgroundColor: '#10213F',
            color: '#FFFFFF',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={15} style={{ color: 'var(--color-primary)' }} />
            <span>Admin Auth: <strong>{currentUser?.email || "admin@skillconnect.gov.in"}</strong></span>
          </div>
        </div>

        {/* Action Flash Notice */}
        {adminNotice && (
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
            <span>{adminNotice}</span>
          </div>
        )}

        {/* KPI Platform Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('dashboards.admin.totalWorkers')}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
              {workers.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669' }}>
              ● {workers.filter(w => w.verificationStatus === 'verified').length} verified
            </span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('dashboards.admin.pendingVerifications')}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
              {pendingVerifs.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Action required</span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{t('dashboards.admin.totalBookings')}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
              {bookings.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#2563EB' }}>Across 4 cities</span>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Support & Complaints</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: complaints.length > 0 ? '#DC2626' : '#059669', marginTop: '0.2rem' }}>
              {complaints.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Community dispute log</span>
          </div>
        </div>

        {/* Section 1: Worker Verification Submissions Queue */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)' }}>
                {t('dashboards.admin.pendingVerifications')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Review masked Aadhaar proof documents to approve or reject verified worker status.
              </p>
            </div>
            <span className="badge badge-pending">
              {pendingVerifs.length} Pending Actions
            </span>
          </div>

          {pendingVerifs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Worker Name</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Trade</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Service Area</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Proof Document</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Submission Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerifs.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.9rem 0.5rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        {v.workerName}
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem', color: 'var(--color-navy)' }}>
                        {v.trade}
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {v.area}
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem' }}>
                        <button
                          onClick={() => setInspectDoc(v)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', gap: '0.3rem', padding: '0.25rem 0.5rem' }}
                        >
                          <Eye size={13} />
                          <span>{v.documentType}</span>
                        </button>
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {v.submittedDate}
                      </td>
                      <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleApprove(v.id)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', gap: '0.25rem' }}
                          >
                            <CheckCircle2 size={13} />
                            <span>{t('dashboards.admin.approve')}</span>
                          </button>
                          <button
                            onClick={() => setRejectModalDoc(v)}
                            className="btn btn-outline btn-sm btn-danger"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', gap: '0.25rem' }}
                          >
                            <XCircle size={13} />
                            <span>{t('dashboards.admin.reject')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              ✅ All pending worker verification submissions have been inspected and processed.
            </div>
          )}
        </div>

        {/* Section 2: Complaints & Dispute Resolution */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
            {t('dashboards.admin.complaints')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Support tickets, punctuality disputes, and client reports.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map((comp) => (
              <div key={comp.id} style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                    {comp.subject}
                  </h3>
                  <span className="badge badge-pending">
                    Ticket ID: {comp.id}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {comp.details}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>Filed by <strong>{comp.customerName}</strong> against worker <strong>{comp.workerName}</strong> on {comp.filedAt}</span>
                  <button
                    onClick={() => showNotice(`Complaint ${comp.id} resolved by administrator.`)}
                    className="btn btn-secondary btn-sm"
                  >
                    Resolve Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Inspection Modal */}
      {inspectDoc && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Inspect Proof Document: {inspectDoc.workerName}</h2>
              <button onClick={() => setInspectDoc(null)}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Document: <strong>{inspectDoc.documentType}</strong> • Service Area: <strong>{inspectDoc.area}</strong>
              </div>
              <img
                src={inspectDoc.filePreview}
                alt="Verification Proof"
                style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                🔒 Masked identity card format complies with platform privacy guidelines.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  handleApprove(inspectDoc.id);
                  setInspectDoc(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Approve Verification
              </button>
              <button
                onClick={() => setInspectDoc(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalDoc && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }}>Reject Verification: {rejectModalDoc.workerName}</h2>
              <button onClick={() => setRejectModalDoc(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleReject}>
              <div className="form-group">
                <label className="form-label">{t('dashboards.admin.reason')} *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="e.g. Document image is blurry or address does not match service jurisdiction..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRejectModalDoc(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-danger" style={{ flex: 2 }}>Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
