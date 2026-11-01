import rawSeed from '../../data/SkillConnect_Full_Demo_Seed.json';

const STORAGE_KEY_WORKERS = 'skillconnect_workers_v4';
const STORAGE_KEY_BOOKINGS = 'skillconnect_bookings_v3';
const STORAGE_KEY_VERIFICATIONS = 'skillconnect_verifications_v3';

// Available skill trades across Andhra Pradesh
export const skillsList = rawSeed.skills || [
  { id: 1, name_en: "Masonry", name_te: "మేస్త్రీ పని / తాపీ పని", description: "Brickwork, plastering, tile laying, civil structural work." },
  { id: 2, name_en: "Plumbing", name_te: "ప్లంబింగ్", description: "Pipes, leakage repairs, sanitary installations, water motors." },
  { id: 3, name_en: "Carpentry", name_te: "వడ్రంగి పని", description: "Furniture fabrication, door/window frame fixing, lock repairs." },
  { id: 4, name_en: "Electrical", name_te: "ఎలక్ట్రికల్ పనులు", description: "House wiring, inverter setups, switchboard repairs, lighting." },
  { id: 5, name_en: "Painting", name_te: "పెయింటింగ్", description: "Interior & exterior emulsion, texture work, waterproof coating." },
  { id: 6, name_en: "Cleaning", name_te: "శుభ్రపరిచే సేవలు", description: "Deep home sanitation, floor scrubbing, post-construction cleanup." },
  { id: 7, name_en: "Moving", name_te: "సామాన్లు తరలింపు", description: "Household shifting, loading/unloading, cargo vehicle transport." },
  { id: 8, name_en: "Gardening", name_te: "తోటపని / ల్యాండ్‌స్కేపింగ్", description: "Lawn trimming, plant pruning, drip irrigation, pest prevention." }
];

// Clean empty worker initialization (ready for fresh registrations)
export function initializeWorkers() {
  try {
    localStorage.removeItem('skillconnect_workers_v3');
    localStorage.removeItem('skillconnect_workers_v2');
  } catch (e) {}

  try {
    const cached = localStorage.getItem(STORAGE_KEY_WORKERS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

// Clean empty booking initialization
export function initializeBookings() {
  try {
    localStorage.removeItem('skillconnect_bookings_v2');
    localStorage.removeItem('skillconnect_bookings_v1');
  } catch (e) {}

  try {
    const cached = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

// Clean empty verification submissions
export function initializeVerifications() {
  try {
    localStorage.removeItem('skillconnect_verifications_v2');
    localStorage.removeItem('skillconnect_verifications_v1');
  } catch (e) {}

  try {
    const cached = localStorage.getItem(STORAGE_KEY_VERIFICATIONS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}
