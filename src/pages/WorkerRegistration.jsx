import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AP_CITIES } from '../lib/constants';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  UserPlus, 
  Briefcase 
} from 'lucide-react';

export default function WorkerRegistration() {
  const { lang, t } = useLanguage();
  const { skillsList, registerWorker } = useData();
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('Vijayawada');
  const [experienceYears, setExperienceYears] = useState('4');
  const [bio, setBio] = useState('');
  const [indicativeWage, setIndicativeWage] = useState('750');
  const [selectedSkills, setSelectedSkills] = useState([2]); // Default Plumbing
  const [aadhaarLastFour, setAadhaarLastFour] = useState('7890');
  const [uploadedFileName, setUploadedFileName] = useState('aadhaar_masked_front.pdf');
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      alert("Please accept the verification consent checkbox before submitting.");
      return;
    }

    const mappedSkills = skillsList
      .filter(s => selectedSkills.includes(s.id))
      .map(s => ({
        id: s.id,
        nameEn: s.name_en,
        nameTe: s.name_te
      }));

    await registerWorker({
      fullName,
      gender,
      phone,
      email,
      serviceArea,
      experienceYears,
      bio,
      indicativeWage,
      skills: mappedSkills,
      aadhaarMasked: `XXXX-XXXX-${aadhaarLastFour}`
    });

    // Auto-login into the newly registered worker persona
    loginAs('worker');
    setSubmitted(true);
    setTimeout(() => {
      navigate('/worker-dashboard');
    }, 1800);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            marginBottom: '0.75rem'
          }}>
            <Briefcase size={16} />
            <span>{lang === 'te' ? 'కార్మికుల ఆన్‌బోర్డింగ్' : 'Worker Onboarding'}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
            {t('workerRegistration.title')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            {t('workerRegistration.subtitle')}
          </p>
        </div>

        {submitted && (
          <div style={{
            backgroundColor: '#D1FAE5',
            border: '1.5px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            color: '#065F46'
          }} className="animate-fade-in">
            <CheckCircle2 size={28} />
            <div>
              <strong style={{ fontSize: '1.05rem' }}>
                {lang === 'te' ? 'కార్మికుల నమోదు విజయవంతంగా పూర్తయింది!' : 'Worker Registration Submitted Successfully!'}
              </strong>
              <div style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {lang === 'te' ? 'మీ వివరాలు మరియు ధృవీకరణ పత్రం అడ్మిన్ సమీక్షకు పంపబడ్డాయి. డాష్‌బోర్డ్‌కు దారి మళ్లిస్తోంది...' : 'Your profile and verification documents are now pending administrative review. Redirecting to your Worker Dashboard...'}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.25rem' }}>
          {/* Section 1: Basic Information */}
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            1. {lang === 'te' ? 'వ్యక్తిగత & సంప్రదింపు వివరాలు' : 'Personal & Contact Details'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.fullName')} *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Ramesh Reddy"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'లింగం (జెండర్)' : 'Gender (Photo Sync)'} *</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: gender === 'male' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: gender === 'male' ? 'var(--color-primary-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: gender === 'male' ? 700 : 400,
                  fontSize: '0.9rem'
                }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>👨 {lang === 'te' ? 'పురుషుడు' : 'Male'}</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: gender === 'female' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: gender === 'female' ? 'var(--color-primary-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: gender === 'female' ? 700 : 400,
                  fontSize: '0.9rem'
                }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>👩 {lang === 'te' ? 'స్త్రీ' : 'Female'}</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.phone')} *</label>
              <input
                type="tel"
                required
                className="form-input"
                placeholder="e.g. 98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.email')}</label>
              <input
                type="email"
                className="form-input"
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'ఆంధ్రప్రదేశ్ జిల్లా / నగరం' : 'AP District / City'} *</label>
              <select
                className="form-select"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
              >
                {AP_CITIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameTe}) • {c.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Skills & Experience */}
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', marginTop: '1.5rem' }}>
            2. {lang === 'te' ? 'వృత్తి & నైపుణ్యాల ఎంపిక' : 'Trades & Experience'}
          </h2>

          <div className="form-group">
            <label className="form-label">{t('workerRegistration.selectSkills')} *</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}>
              {skillsList.map((skill) => {
                const checked = selectedSkills.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: checked ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: checked ? 'var(--color-primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(skill.id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontWeight: checked ? 600 : 400, color: 'var(--color-navy)' }}>
                      {lang === 'te' ? (skill.name_te || skill.name_en) : skill.name_en}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.experienceYears')} *</label>
              <input
                type="number"
                min="0"
                max="50"
                required
                className="form-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.indicativeWage')} *</label>
              <input
                type="number"
                min="300"
                max="5000"
                step="50"
                required
                className="form-input"
                value={indicativeWage}
                onChange={(e) => setIndicativeWage(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('workerRegistration.bio')}</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder={t('workerRegistration.bioPlaceholder')}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Section 3: Identity Verification & Privacy (Aadhaar Upload) */}
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', marginTop: '1.5rem' }}>
            3. {t('workerRegistration.verificationSection')}
          </h2>

          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: '#1E3A8A'
          }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <Lock size={18} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Data Privacy & Protection Policy:</strong>
                <p style={{ marginTop: '0.25rem' }}>
                  {t('workerRegistration.verificationNote')}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {lang === 'te' ? 'ఆధార్ చివరి 4 అంకెలు' : 'Aadhaar Last 4 Digits (Masked Proof)'} *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ padding: '0.65rem 0.8rem', backgroundColor: 'var(--color-bg-page)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  XXXX - XXXX -
                </span>
                <input
                  type="text"
                  maxLength={4}
                  required
                  className="form-input"
                  style={{ width: '90px', letterSpacing: '2px', fontWeight: 700 }}
                  value={aadhaarLastFour}
                  onChange={(e) => setAadhaarLastFour(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.uploadAadhaar')} *</label>
              <div style={{
                border: '1.5px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--color-bg-page)',
                cursor: 'pointer'
              }}
              onClick={() => {
                const name = prompt("Enter sample document name to attach:", uploadedFileName);
                if (name) setUploadedFileName(name);
              }}
              >
                <Upload size={18} style={{ color: 'var(--color-primary-dark)' }} />
                <div style={{ fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <strong>{uploadedFileName}</strong> (Attached)
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>Change</span>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', cursor: 'pointer', lineHeight: 1.45 }}>
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                style={{ marginTop: '3px', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ color: 'var(--color-navy)' }}>
                {t('workerRegistration.agreeConsent')}
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <UserPlus size={20} />
            <span>{t('workerRegistration.submitBtn')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
