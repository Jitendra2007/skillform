// Andhra Pradesh (AP) Districts and Key Cities
export const AP_CITIES = [
  { id: 'Vijayawada', nameEn: 'Vijayawada', nameTe: 'విజయవాడ', district: 'NTR' },
  { id: 'Visakhapatnam', nameEn: 'Visakhapatnam (Vizag)', nameTe: 'విశాఖపట్నం', district: 'Visakhapatnam' },
  { id: 'Guntur', nameEn: 'Guntur', nameTe: 'గుంటూరు', district: 'Guntur' },
  { id: 'Tirupati', nameEn: 'Tirupati', nameTe: 'తిరుపతి', district: 'Tirupati' },
  { id: 'Kurnool', nameEn: 'Kurnool', nameTe: 'కర్నూలు', district: 'Kurnool' },
  { id: 'Nellore', nameEn: 'Nellore', nameTe: 'నెల్లూరు', district: 'SPS Nellore' },
  { id: 'Rajahmundry', nameEn: 'Rajahmundry', nameTe: 'రాజమండ్రి', district: 'East Godavari' },
  { id: 'Kakinada', nameEn: 'Kakinada', nameTe: 'కాకినాడ', district: 'Kakinada' },
  { id: 'Kadapa', nameEn: 'Kadapa (YSR)', nameTe: 'కడప', district: 'YSR Kadapa' },
  { id: 'Anantapur', nameEn: 'Anantapur', nameTe: 'అనంతపురం', district: 'Anantapur' },
  { id: 'Eluru', nameEn: 'Eluru', nameTe: 'ఏలూరు', district: 'Eluru' },
  { id: 'Ongole', nameEn: 'Ongole', nameTe: 'ఒంగోలు', district: 'Prakasam' },
  { id: 'Vizianagaram', nameEn: 'Vizianagaram', nameTe: 'విజయనగరం', district: 'Vizianagaram' },
  { id: 'Srikakulam', nameEn: 'Srikakulam', nameTe: 'శ్రీకాకుళం', district: 'Srikakulam' },
  { id: 'Tenali', nameEn: 'Tenali', nameTe: 'తెనాలి', district: 'Guntur' },
  { id: 'Mangalagiri', nameEn: 'Mangalagiri', nameTe: 'మంగళగిరి', district: 'Guntur' },
  { id: 'Bhimavaram', nameEn: 'Bhimavaram', nameTe: 'భీమవరం', district: 'West Godavari' },
  { id: 'Machilipatnam', nameEn: 'Machilipatnam', nameTe: 'మచిలీపట్నం', district: 'Krishna' },
  { id: 'Chittoor', nameEn: 'Chittoor', nameTe: 'చిత్తూరు', district: 'Chittoor' },
  { id: 'Nandyal', nameEn: 'Nandyal', nameTe: 'నంద్యాల', district: 'Nandyal' },
  { id: 'Hindupur', nameEn: 'Hindupur', nameTe: 'హిందూపురం', district: 'Sri Sathya Sai' }
];

// Curated verified portraits categorized by gender for 100% accurate visual representation
export const MALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&auto=format&fit=crop&q=80'
];

export const FEMALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&auto=format&fit=crop&q=80'
];

export function getAvatarForGender(gender = 'male', seedIndex = 0) {
  if (gender.toLowerCase() === 'female') {
    return FEMALE_PORTRAITS[seedIndex % FEMALE_PORTRAITS.length];
  }
  return MALE_PORTRAITS[seedIndex % MALE_PORTRAITS.length];
}
