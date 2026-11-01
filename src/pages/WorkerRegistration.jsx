import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AP_CITIES, getAvatarForGender } from '../lib/constants';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  UserPlus, 
  Briefcase,
  Camera,
  RotateCcw,
  Trash2,
  Image as ImageIcon,
  Check
} from 'lucide-react';

export default function WorkerRegistration() {
  const { lang, t } = useLanguage();
  const { skillsList, registerWorker } = useData();
  const { loginAs, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const aadhaarInputRef = useRef(null);

  // Form State — Initially EMPTY for Experience, Wage, Skills, Aadhaar
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('Vijayawada');
  const [experienceYears, setExperienceYears] = useState(''); // Initially EMPTY
  const [indicativeWage, setIndicativeWage] = useState(''); // Initially EMPTY
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]); // Initially EMPTY
  const [aadhaarLastFour, setAadhaarLastFour] = useState(''); // Initially EMPTY
  const [uploadedFileName, setUploadedFileName] = useState(''); // Initially EMPTY
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Selfie / Photo Upload State
  const [selfiePhoto, setSelfiePhoto] = useState(null); // base64 Data URL
  const [selfieFileName, setSelfieFileName] = useState('');
  const [photoType, setPhotoType] = useState('selfie'); // 'selfie' | 'avatar'

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Handle Selfie / Camera Upload
  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'te' ? 'దయచేసి సరైన ఫోటో ఫైల్‌ను ఎంచుకోండి.' : 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'te' ? 'ఫోటో పరిమాణం 5MB లోపు ఉండాలి.' : 'Selfie file size must be under 5MB.');
      return;
    }

    setSelfieFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelfiePhoto(event.target.result);
      setPhotoType('selfie');
    };
    reader.readAsDataURL(file);
  };

  const removeSelfie = () => {
    setSelfiePhoto(null);
    setSelfieFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Aadhaar Document Attachment
  const handleAadhaarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      alert(lang === 'te' 
        ? "సమర్పించే ముందు దయచేసి ధృవీకరణ సమ్మతి చెక్‌బాక్స్‌ను అంగీకరించండి." 
        : "Please accept the verification consent checkbox before submitting.");
      return;
    }

    if (selectedSkills.length === 0) {
      alert(lang === 'te'
        ? "దయచేసి కనీసం ఒక వృత్తి లేదా నైపుణ్యాన్ని ఎంచుకోండి."
        : "Please select at least one skill or trade from the list.");
      return;
    }

    const mappedSkills = skillsList
      .filter(s => selectedSkills.includes(s.id))
      .map(s => ({
        id: s.id,
        nameEn: s.name_en,
        nameTe: s.name_te
      }));

    // If worker uploaded a selfie, use it directly; otherwise use standard avatar
    const finalAvatar = (photoType === 'selfie' && selfiePhoto) 
      ? selfiePhoto 
      : getAvatarForGender(gender, Date.now());

    const fullWorker = await registerWorker({
      fullName,
      gender,
      phone,
      email,
      serviceArea,
      experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
      indicativeWage: indicativeWage ? parseInt(indicativeWage, 10) : null,
      bio,
      avatar: finalAvatar,
      selfieUrl: selfiePhoto || null,
      skills: mappedSkills,
      aadhaarMasked: aadhaarLastFour ? `XXXX-XXXX-${aadhaarLastFour}` : 'XXXX-XXXX-0000',
      documentAttached: uploadedFileName || 'aadhaar_proof.pdf'
    });

    // Auto-login into newly registered worker persona
    if (fullWorker) {
      const workerUser = {
        uid: fullWorker.userId || fullWorker.id,
        workerId: fullWorker.id,
        name: fullWorker.name || fullName,
        phone: fullWorker.phone || phone,
        email: fullWorker.email || email,
        role: 'worker',
        serviceArea: fullWorker.serviceArea || serviceArea,
        verificationStatus: fullWorker.verificationStatus || 'pending',
        avatar: fullWorker.avatar || finalAvatar
      };
      setCurrentUser(workerUser);
    } else {
      loginAs('worker');
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate('/worker-dashboard');
    }, 1800);
  };

  return (
    <div style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        
        {/* Compact Header with crisp team banner thumbnail */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--color-primary-light)',
            color: '#1a7a49',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <Briefcase size={14} />
            <span>{lang === 'te' ? 'కార్మికుల నమోదు పోర్టల్' : 'Worker Onboarding Portal'}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2rem)', color: 'var(--color-navy)', marginBottom: '0.35rem', lineHeight: 1.25 }}>
            {t('workerRegistration.title')}
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
            {t('workerRegistration.subtitle')}
          </p>
        </div>

        {/* Small Crisp Banner Preview of fellow AP workers */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          height: '110px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <img
            src="/hero-banner.png"
            alt="AP Skilled Workers Team"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(16, 33, 63, 0.85) 0%, rgba(16, 33, 63, 0.35) 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.25rem',
            color: '#FFFFFF'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                ⭐ {lang === 'te' ? '12,000+ స్థానిక నిపుణులతో కలవండి' : 'Join 12,000+ Verified AP Tradespeople'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#E2E8F0', marginTop: '2px' }}>
                {lang === 'te' ? 'సులభమైన నమోదు • మీ మొబైల్ నుండే కొటేషన్లు పంపండి' : 'Quick onboarding • Direct customer leads across 26 AP districts'}
              </div>
            </div>
          </div>
        </div>

        {submitted && (
          <div style={{
            backgroundColor: '#D1FAE5',
            border: '1.5px solid #10B981',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#065F46'
          }} className="animate-fade-in">
            <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.98rem' }}>
                {lang === 'te' ? 'కార్మికుల నమోదు విజయవంతంగా పూర్తయింది!' : 'Worker Registration Submitted Successfully!'}
              </strong>
              <div style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>
                {lang === 'te' ? 'మీ వివరాలు మరియు ధృవీకరణ పత్రం సమర్పించబడ్డాయి. డాష్‌బోర్డ్‌కు దారి మళ్లిస్తోంది...' : 'Your profile & selfie have been submitted for AP State Admin KYC. Redirecting to your dashboard...'}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
          
          {/* SECTION 1: SELFIE & PROFILE PHOTO UPLOAD */}
          <div style={{
            backgroundColor: 'var(--color-bg-page)',
            border: '1.5px solid #cce8d7',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Camera size={18} style={{ color: 'var(--color-primary-dark)' }} />
                  <span>{lang === 'te' ? '1. మీ సెల్ఫీ / ప్రొఫైల్ ఫోటో' : '1. Worker Selfie / Profile Photo'} *</span>
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {lang === 'te' ? 'కస్టమర్లకు నిజమైన ముఖం కనిపించేందుకు మీ సెల్ఫీని అప్‌లోడ్ చేయండి' : 'Upload your selfie or take a quick photo with your phone camera for verified customer trust.'}
                </p>
              </div>

              {/* Photo Mode Switcher */}
              <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#FFFFFF', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setPhotoType('selfie')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: photoType === 'selfie' ? 700 : 500,
                    borderRadius: '4px',
                    backgroundColor: photoType === 'selfie' ? 'var(--color-primary)' : 'transparent',
                    color: photoType === 'selfie' ? '#FFFFFF' : 'var(--color-navy)'
                  }}
                >
                  📷 {lang === 'te' ? 'సెల్ఫీ' : 'Selfie Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('avatar')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: photoType === 'avatar' ? 700 : 500,
                    borderRadius: '4px',
                    backgroundColor: photoType === 'avatar' ? 'var(--color-primary)' : 'transparent',
                    color: photoType === 'avatar' ? '#FFFFFF' : 'var(--color-navy)'
                  }}
                >
                  👤 {lang === 'te' ? 'అవతార్' : 'Default Avatar'}
                </button>
              </div>
            </div>

            {/* Selfie Upload Content */}
            {photoType === 'selfie' ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                {selfiePhoto ? (
                  /* Live Selfie Preview Circle */
                  <div>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={selfiePhoto}
                        alt="Uploaded Selfie Preview"
                        className="selfie-preview-circle"
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        padding: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}>
                        <Check size={14} />
                      </div>
                    </div>

                    <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: '#1a7a49', fontWeight: 700 }}>
                        ✅ {lang === 'te' ? 'సెల్ఫీ సిద్ధంగా ఉంది' : 'Selfie Captured & Attached'}
                      </span>
                      {selfieFileName && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          ({selfieFileName})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginTop: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '0.35rem', fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                      >
                        <RotateCcw size={13} />
                        <span>{lang === 'te' ? 'మరొక సెల్ఫీ తీయండి' : 'Change Selfie'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={removeSelfie}
                        className="btn btn-danger btn-sm"
                        style={{ gap: '0.35rem', fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                      >
                        <Trash2 size={13} />
                        <span>{lang === 'te' ? 'తొలగించు' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Big Tap to Selfie Box */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--color-primary)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FFFFFF',
                      padding: '1.25rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.65rem auto'
                    }}>
                      <Camera size={26} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-navy)', marginBottom: '0.2rem' }}>
                      {lang === 'te' ? '📷 సెల్ఫీ తీయండి లేదా ఫోటోను అప్‌లోడ్ చేయండి' : '📷 Take a Selfie or Choose Photo'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto' }}>
                      {lang === 'te' 
                        ? 'మొబైల్ కెమెరాతో నేరుగా సెల్ఫీ తీయడానికి లేదా గ్యాలరీ నుండి ఎంచుకోవడానికి ఇక్కడ నొక్కండి' 
                        : 'Tap here to snap a quick selfie with your phone camera or select from your gallery'}
                    </div>
                    <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                      <span>Supports JPG, PNG, WebP (Max 5MB)</span>
                    </div>
                  </div>
                )}

                {/* Hidden native camera / file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              /* Fallback Default Avatar Selection */
              <div style={{ padding: '0.5rem 0', textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {lang === 'te' ? 'స్టాండర్డ్ ధృవీకరించబడిన ప్రొఫైల్ అవతార్‌ను ఎంచుకోండి:' : 'Select a standard verified portrait avatar for your profile:'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: gender === 'male' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: gender === 'male' ? 'var(--color-primary-light)' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="avatarGender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>👨 {lang === 'te' ? 'పురుష అవతార్ (Male)' : 'Male Avatar'}</span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: gender === 'female' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: gender === 'female' ? 'var(--color-primary-light)' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="avatarGender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>👩 {lang === 'te' ? 'మహిళా అవతార్ (Female)' : 'Female Avatar'}</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: PERSONAL & CONTACT DETAILS */}
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.85rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--color-border)' }}>
            2. {lang === 'te' ? 'వ్యక్తిగత & సంప్రదింపు వివరాలు' : 'Personal & Contact Details'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
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
              <label className="form-label">{lang === 'te' ? 'ఆంధ్రప్రదేశ్ నగరం / జిల్లా' : 'AP City / District'} *</label>
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

          {/* SECTION 3: SKILLS & EXPERIENCE */}
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.85rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
            3. {lang === 'te' ? 'వృత్తి & పని వివరాలు' : 'Trades, Wage & Experience'}
          </h2>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">{t('workerRegistration.selectSkills')} *</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.5rem',
              marginTop: '0.35rem'
            }}>
              {skillsList.map((skill) => {
                const checked = selectedSkills.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: checked ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: checked ? 'var(--color-primary-light)' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(skill.id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontWeight: checked ? 700 : 400, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lang === 'te' ? (skill.name_te || skill.name_en) : skill.name_en}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Experience Years & Daily Wage: INITIALLY EMPTY AS REQUESTED */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('workerRegistration.experienceYears')}
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                  ({lang === 'te' ? 'సంవత్సరాల్లో' : 'in years'})
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input"
                placeholder={lang === 'te' ? 'ఉదాహరణ: 4' : 'e.g. 4'}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('workerRegistration.indicativeWage')}
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                  ({lang === 'te' ? 'రూపాయలు / రోజుకు' : '₹ / day estimate'})
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                step="50"
                className="form-input"
                placeholder={lang === 'te' ? 'ఉదాహరణ: 750' : 'e.g. 750'}
                value={indicativeWage}
                onChange={(e) => setIndicativeWage(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">{t('workerRegistration.bio')}</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder={t('workerRegistration.bioPlaceholder')}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* SECTION 4: IDENTITY VERIFICATION & PRIVACY */}
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.85rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--color-border)', marginTop: '0.5rem' }}>
            4. {t('workerRegistration.verificationSection')}
          </h2>

          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            lineHeight: 1.45,
            color: '#1E3A8A'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Lock size={16} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Data Privacy Policy:</strong> {t('workerRegistration.verificationNote')}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {lang === 'te' ? 'ఆధార్ చివరి 4 అంకెలు' : 'Aadhaar Last 4 Digits'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ padding: '0.55rem 0.65rem', backgroundColor: 'var(--color-bg-page)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  XXXX - XXXX -
                </span>
                <input
                  type="text"
                  maxLength={4}
                  className="form-input"
                  style={{ width: '85px', letterSpacing: '2px', fontWeight: 700 }}
                  placeholder="e.g. 7890"
                  value={aadhaarLastFour}
                  onChange={(e) => setAadhaarLastFour(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('workerRegistration.uploadAadhaar')}</label>
              <input
                ref={aadhaarInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleAadhaarUpload}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  border: '1.5px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'var(--color-bg-page)',
                  cursor: 'pointer'
                }}
                onClick={() => aadhaarInputRef.current?.click()}
              >
                <Upload size={16} style={{ color: 'var(--color-primary-dark)', flexShrink: 0 }} />
                <div style={{ fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uploadedFileName ? (
                    <strong style={{ color: '#065F46' }}>{uploadedFileName}</strong>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {lang === 'te' ? 'ఫైల్‌ను ఎంచుకోండి (PDF / ఫోటో)' : 'Choose file (PDF / Photo)'}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                  {uploadedFileName ? 'Change' : 'Browse'}
                </span>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.82rem', cursor: 'pointer', lineHeight: 1.45 }}>
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--color-primary)' }}
              />
              <span style={{ color: 'var(--color-navy)' }}>
                {t('workerRegistration.agreeConsent')}
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.45rem' }}
          >
            <UserPlus size={18} />
            <span>{t('workerRegistration.submitBtn')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
