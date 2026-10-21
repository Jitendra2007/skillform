import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  Hammer, 
  Droplets, 
  Settings, 
  Zap, 
  Paintbrush, 
  Brush, 
  Truck, 
  Flower2, 
  Wrench,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const CATEGORY_META = {
  1: { icon: Hammer, descEn: "Brickwork, concrete plastering, flooring, compound walls & foundational masonry.", descTe: "ఇటుక పని, సిమెంట్ ప్లాస్టరింగ్, ఫ్లోరింగ్ మరియు భవన నిర్మాణం." },
  2: { icon: Droplets, descEn: "Tap leaks, pipeline replacement, sanitary ware, water tank & motor connection.", descTe: "పైపు లీకేజీలు, నల్లా మరమ్మతులు, ట్యాంక్ క్లీనింగ్ మరియు శానిటరీ పనులు." },
  3: { icon: Settings, descEn: "Door & window framing, custom modular cabinetry, furniture polishing & lock repairs.", descTe: "తలుపులు, కిటికీలు, కప్‌బోర్డ్ తయారీ మరియు ఫర్నిచర్ పనులు." },
  4: { icon: Zap, descEn: "House wiring, inverter setups, switchboard repairs, geyser & lighting installation.", descTe: "హౌస్ వైరింగ్, ఇన్వర్టర్ కనెక్షన్, స్విచ్‌బోర్డులు మరియు విద్యుత్ మరమ్మతులు." },
  5: { icon: Paintbrush, descEn: "Interior wall emulsion, exterior weather coats, wood varnishing & texture designs.", descTe: "ఇంటి లోపల మరియు వెలుపల రంగులు వేయడం, పుట్టీ మరియు వార్నిష్ పనులు." },
  6: { icon: Brush, descEn: "Deep home sanitation, floor scrubbing, post-construction cleaning & disinfection.", descTe: "ఇంటి పూర్తి శుభ్రపరచడం, డీప్ క్లీనింగ్ మరియు శానిటైజేషన్." },
  7: { icon: Truck, descEn: "Household goods shifting, safe loading/unloading, packing & furniture transport.", descTe: "సామాన్లు తరలించడం, ప్యాకింగ్, లోడింగ్ మరియు అన్‌లోడింగ్." },
  8: { icon: Flower2, descEn: "Lawn trimming, tree pruning, soil nourishment, plant nurseries & terrace gardens.", descTe: "లాన్ కట్టింగ్, మొక్కల సంరక్షణ, కలుపు తీత మరియు టెర్రస్ గార్డెనింగ్." },
  9: { icon: Wrench, descEn: "Two-wheeler, generator, and domestic machinery breakdown assistance.", descTe: "వాహనాలు, జనరేటర్లు మరియు గృహ యంత్రాల మరమ్మతులు." },
  10: { icon: Settings, descEn: "Appliance repair, fabrication, tile cutting & custom maintenance requirements.", descTe: "టైల్స్ కటింగ్, ఫ్యాబ్రికేషన్ మరియు ఇతర గృహ నిర్వహణ సేవలు." }
};

export default function CategoriesPage() {
  const { lang, t } = useLanguage();
  const { skillsList, workers } = useData();
  const [search, setSearch] = useState('');

  const filteredSkills = skillsList.filter(s => {
    const q = search.toLowerCase();
    return s.name_en.toLowerCase().includes(q) || (s.name_te && s.name_te.includes(q));
  });

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: '0.65rem' }}>
            {lang === 'te' ? 'సేవా వర్గాల డైరెక్టరీ' : 'Browse Trades & Categories'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            {lang === 'te'
              ? 'మీ పరిసరాల్లోని నైపుణ్యం కలిగిన కార్మికులను వారి వృత్తి ఆధారంగా సులభంగా కనుగొనండి'
              : 'Explore skilled local experts organized by craft and trade specialization across the Andhra Pradesh capital region.'}
          </p>

          {/* Quick Search */}
          <div style={{ position: 'relative', marginTop: '1.5rem', maxWidth: '420px', margin: '1.5rem auto 0 auto' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder={lang === 'te' ? 'వర్గాన్ని వెతకండి...' : 'Filter categories (e.g. Plumbing, Electrical)...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid-2">
          {filteredSkills.map((skill) => {
            const meta = CATEGORY_META[skill.id] || CATEGORY_META[10];
            const IconComp = meta.icon;
            
            // Count workers for this skill
            const count = workers.filter(w => w.skills?.some(s => s.id === skill.id)).length;

            return (
              <Link
                key={skill.id}
                to={`/search?skill=${skill.id}`}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  padding: '1.75rem',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: '#1a7a49',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComp size={28} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                      {lang === 'te' ? (skill.name_te || skill.name_en) : skill.name_en}
                    </h3>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-bg-page)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-primary-dark)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {count} {lang === 'te' ? 'కార్మికులు' : 'Workers'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {lang === 'te' ? meta.descTe : meta.descEn}
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: 'var(--color-primary-dark)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    <span>{lang === 'te' ? 'కార్మికులను చూడండి' : 'View Available Workers'}</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
