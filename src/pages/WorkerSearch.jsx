import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import WorkerCard from '../components/WorkerCard';
import { AP_CITIES } from '../lib/constants';
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function WorkerSearch() {
  const { lang, t } = useLanguage();
  const { workers, skillsList } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States
  const [keyword, setKeyword] = useState('');
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('rating_desc');

  // Filtered workers logic
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // Keyword filter
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesName = worker.name.toLowerCase().includes(query);
        const matchesBio = worker.bio?.toLowerCase().includes(query);
        const matchesSkill = worker.skills?.some(s => 
          s.nameEn.toLowerCase().includes(query) || (s.nameTe && s.nameTe.includes(query))
        );
        if (!matchesName && !matchesBio && !matchesSkill) return false;
      }

      // Skill filter
      if (skillFilter) {
        const skillIdNum = parseInt(skillFilter, 10);
        const hasSkill = worker.skills?.some(s => s.id === skillIdNum);
        if (!hasSkill) return false;
      }

      // Location filter
      if (locationFilter && worker.serviceArea !== locationFilter) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && worker.verificationStatus !== 'verified') {
        return false;
      }

      // Availability filter
      if (availableOnly && worker.availability !== 'available') {
        return false;
      }

      // Rating filter
      if (parseFloat(minRating) > 0 && worker.rating < parseFloat(minRating)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'experience_desc') return b.experienceYears - a.experienceYears;
      if (sortBy === 'wage_asc') return a.indicativeWage - b.indicativeWage;
      if (sortBy === 'wage_desc') return b.indicativeWage - a.indicativeWage;
      return 0;
    });
  }, [workers, keyword, skillFilter, locationFilter, verifiedOnly, availableOnly, minRating, sortBy]);

  const resetFilters = () => {
    setKeyword('');
    setSkillFilter('');
    setLocationFilter('');
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setMinRating('0');
    setSortBy('rating_desc');
    setSearchParams({});
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.1rem', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>
            {t('search.title')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            {t('search.subtitle')}
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          {/* Main search row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* Keyword search input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'కార్మికుడి పేరు లేదా కీవర్డ్' : 'Keyword Search'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder={lang === 'te' ? 'పేరు, పనులు...' : 'Search by name, tools, trade...'}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            {/* Skill Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'నైపుణ్యం' : 'Skill / Trade'}</label>
              <select
                className="form-select"
                value={skillFilter}
                onChange={(e) => {
                  setSkillFilter(e.target.value);
                  if (e.target.value) searchParams.set('skill', e.target.value);
                  else searchParams.delete('skill');
                  setSearchParams(searchParams);
                }}
              >
                <option value="">{t('search.allSkills')}</option>
                {skillsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {lang === 'te' ? (s.name_te || s.name_en) : s.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'నగరం / ప్రాంతం' : 'Location'}</label>
              <select
                className="form-select"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  if (e.target.value) searchParams.set('location', e.target.value);
                  else searchParams.delete('location');
                  setSearchParams(searchParams);
                }}
              >
                <option value="">{t('search.allLocations')}</option>
                {AP_CITIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameTe})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{lang === 'te' ? 'క్రమబద్ధీకరణ' : 'Sort By'}</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating_desc">Highest Rated (రేటింగ్ ఎక్కువ)</option>
                <option value="experience_desc">Most Experienced (అనుభవం ఎక్కువ)</option>
                <option value="wage_asc">Indicative Wage: Low to High</option>
                <option value="wage_desc">Indicative Wage: High to Low</option>
              </select>
            </div>
          </div>

          {/* Secondary filter chips & toggles */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* Verified Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <ShieldCheck size={16} style={{ color: 'var(--color-primary-dark)' }} />
                <span>{t('search.filterVerifiedOnly')}</span>
              </label>

              {/* Available Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span>{t('search.filterAvailableOnly')}</span>
              </label>

              {/* Min rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{t('search.minRating')}:</span>
                <select
                  className="form-select"
                  style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.8rem' }}
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="0">Any Rating</option>
                  <option value="4.5">4.5+ ★</option>
                  <option value="4.0">4.0+ ★</option>
                </select>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)' }}
            >
              <RotateCcw size={14} />
              <span>{t('search.resetFilters')}</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            Showing <strong style={{ color: 'var(--color-navy)' }}>{filteredWorkers.length}</strong> skilled workers
            {locationFilter && <span> in <strong>{locationFilter}</strong></span>}
          </div>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length > 0 ? (
          <div className="grid-3">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-page)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-text-muted)'
            }}>
              <Search size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {t('search.noResultsTitle')}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              {t('search.noResultsDesc')}
            </p>
            <button onClick={resetFilters} className="btn btn-primary btn-sm">
              <RotateCcw size={15} />
              <span>{t('search.resetFilters')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
