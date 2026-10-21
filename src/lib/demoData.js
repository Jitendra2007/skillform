import rawSeed from '../../data/SkillConnect_Full_Demo_Seed.json';
import { AP_CITIES, MALE_PORTRAITS, FEMALE_PORTRAITS } from './constants';

const STORAGE_KEY_WORKERS = 'skillconnect_workers_v2';
const STORAGE_KEY_BOOKINGS = 'skillconnect_bookings_v2';
const STORAGE_KEY_QUOTES = 'skillconnect_quotations_v2';
const STORAGE_KEY_REVIEWS = 'skillconnect_reviews_v2';
const STORAGE_KEY_VERIFICATIONS = 'skillconnect_verifications_v2';

// Known female names from Andhra Pradesh seed data to ensure 100% gender-photo match
const FEMALE_NAMES = new Set([
  'Sravani Kumar',
  'Lakshmi Devi',
  'Meena Kumari',
  'Anusha Patel',
  'Divya Sri',
  'Pooja Rani',
  'Chandrika Rao',
  'Harika Reddy'
]);

// Strategic distribution across Andhra Pradesh (AP) cities
const AP_CITY_ASSIGNMENTS = [
  'Vijayawada',
  'Visakhapatnam',
  'Guntur',
  'Tirupati',
  'Rajahmundry',
  'Nellore',
  'Kakinada',
  'Kurnool',
  'Kadapa',
  'Anantapur',
  'Vijayawada',
  'Visakhapatnam',
  'Eluru',
  'Ongole',
  'Tenali',
  'Mangalagiri',
  'Vizianagaram',
  'Srikakulam',
  'Tirupati',
  'Bhimavaram'
];

export const skillsList = rawSeed.skills || [];

// Helper to initialize normalized workers from raw seed
export function initializeWorkers() {
  const cached = localStorage.getItem(STORAGE_KEY_WORKERS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to parse cached workers", e);
    }
  }

  const userMap = {};
  rawSeed.profiles.forEach(p => {
    userMap[p.id] = p;
  });

  const skillMap = {};
  rawSeed.skills.forEach(s => {
    skillMap[s.id] = s;
  });

  const workerSkillsMap = {};
  if (rawSeed.worker_skills) {
    rawSeed.worker_skills.forEach(ws => {
      if (!workerSkillsMap[ws.worker_id]) {
        workerSkillsMap[ws.worker_id] = [];
      }
      const s = skillMap[ws.skill_id];
      if (s) {
        workerSkillsMap[ws.worker_id].push({
          id: s.id,
          nameEn: s.name_en,
          nameTe: s.name_te,
          years: ws.years_experience
        });
      }
    });
  }

  // Base wage hints map per skill
  const baseWages = [650, 700, 750, 800, 600, 550, 850, 600, 900, 700];

  let maleIndex = 0;
  let femaleIndex = 0;

  const normalized = (rawSeed.worker_profiles || []).map((wp, index) => {
    const user = userMap[wp.user_id] || { full_name: "Skilled Professional", phone: "9876543210" };
    const skills = workerSkillsMap[wp.id] || [{ id: 2, nameEn: "Plumbing", nameTe: "ప్లంబింగ్", years: 3 }];
    
    // Deterministic realistic rating between 4.4 and 4.95
    const rating = (4.4 + ((wp.experience_years * 7 + index * 3) % 6) * 0.1).toFixed(1);
    const reviewCount = 8 + (index * 7) % 35;
    const wage = baseWages[index % baseWages.length] + ((wp.experience_years || 2) * 40);

    const isFemale = FEMALE_NAMES.has(user.full_name);
    const gender = isFemale ? 'female' : 'male';
    const avatar = isFemale 
      ? FEMALE_PORTRAITS[femaleIndex++ % FEMALE_PORTRAITS.length]
      : MALE_PORTRAITS[maleIndex++ % MALE_PORTRAITS.length];
    const city = AP_CITY_ASSIGNMENTS[index % AP_CITY_ASSIGNMENTS.length] || wp.service_area || "Vijayawada";

    return {
      id: wp.id,
      userId: wp.user_id,
      name: user.full_name,
      gender: gender,
      phone: user.phone,
      email: user.email,
      bio: wp.bio,
      experienceYears: wp.experience_years,
      serviceArea: city,
      availability: wp.availability_status || "available",
      verificationStatus: wp.verification_status || "verified",
      skills: skills,
      rating: parseFloat(rating),
      reviewCount: reviewCount,
      indicativeWage: wage,
      avatar: avatar
    };
  });

  localStorage.setItem(STORAGE_KEY_WORKERS, JSON.stringify(normalized));
  return normalized;
}

// Initial default bookings
export function initializeBookings() {
  const cached = localStorage.getItem(STORAGE_KEY_BOOKINGS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
  }

  const initial = [
    {
      id: "b-101",
      customerUid: "cust-demo-1",
      customerName: "Keerthana Rao",
      workerUid: "61750a2a-c9ff-56e2-87f2-ab5fca4a64d2",
      workerName: "Aarav Reddy",
      skillName: "Masonry",
      title: "Balcony wall cement plastering and crack sealing",
      description: "Outer boundary wall has developed hairline cracks after monsoon rains. Need durable cement mortar work.",
      serviceAddress: "Flat 402, Sai Residency, Benz Circle, Vijayawada",
      serviceArea: "Vijayawada",
      requestedDate: "2026-10-24",
      status: "quoted",
      quotation: {
        id: "q-101",
        amountINR: 2200,
        estimatedTime: "1 Day (approx 6-8 hrs)",
        notes: "Includes cement mix, sand screening, and structural crack sealing compound. Material cost ₹800, Labour ₹1400.",
        createdAt: "2026-10-21"
      },
      createdAt: "2026-10-20"
    },
    {
      id: "b-102",
      customerUid: "cust-demo-1",
      customerName: "Keerthana Rao",
      workerUid: "f521b131-6aca-512a-9564-766d4c5405c6",
      workerName: "Sravani Kumar",
      skillName: "Plumbing",
      title: "Bathroom mixer tap leakage and sink trap pipe replacement",
      description: "Continuous leakage from bathroom wall mixer and kitchen sink drain trap smells bad.",
      serviceAddress: "Flat 402, Sai Residency, Benz Circle, Vijayawada",
      serviceArea: "Vijayawada",
      requestedDate: "2026-10-22",
      status: "in_progress",
      quotation: {
        id: "q-102",
        amountINR: 950,
        estimatedTime: "2-3 Hours",
        notes: "Replacing washer seals and PVC trap pipe. Basic hardware parts supplied.",
        createdAt: "2026-10-20"
      },
      createdAt: "2026-10-19"
    },
    {
      id: "b-103",
      customerUid: "cust-demo-1",
      customerName: "Keerthana Rao",
      workerUid: "8a82dc00-7ac5-5c6e-b277-744d712e949a",
      workerName: "Kiran Naidu",
      skillName: "Electrical",
      title: "Inverter battery wiring & MCB trip check",
      description: "Main circuit breaker tripping whenever geyser and AC operate simultaneously.",
      serviceAddress: "Flat 402, Sai Residency, Benz Circle, Vijayawada",
      serviceArea: "Vijayawada",
      requestedDate: "2026-10-15",
      status: "completed",
      quotation: {
        id: "q-103",
        amountINR: 850,
        estimatedTime: "1.5 Hours",
        notes: "Rebalanced load across phases and replaced worn 20A MCB.",
        createdAt: "2026-10-14"
      },
      createdAt: "2026-10-14"
    }
  ];

  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(initial));
  return initial;
}

// Initial Verifications
export function initializeVerifications() {
  const cached = localStorage.getItem(STORAGE_KEY_VERIFICATIONS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
  }

  const initial = [
    {
      id: "verif-1",
      workerId: "da82e3d7-39b5-5161-912e-0153a74c5fbb",
      workerName: "Venkatesh Rao",
      trade: "Gardening & Landscaping",
      area: "Mangalagiri",
      documentType: "Masked Aadhaar (XXXX-XXXX-4589)",
      submittedDate: "2026-10-18",
      status: "pending",
      filePreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      notes: "Clear photograph with address proof matching service area."
    },
    {
      id: "verif-2",
      workerId: "32743351-e48a-5d10-94aa-5a8139cb5a65",
      workerName: "Imran Ali",
      trade: "Moving & Shifting",
      area: "Mangalagiri",
      documentType: "Masked Aadhaar (XXXX-XXXX-9120)",
      submittedDate: "2026-10-19",
      status: "pending",
      filePreview: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
      notes: "Commercial driver license and masked identification attached."
    }
  ];

  localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(initial));
  return initial;
}
