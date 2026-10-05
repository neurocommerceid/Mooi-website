// Menu booking per cabang, disalin dari price list resmi tiap cabang (Okt 2026).
// Harga = harga terendah; varian (panjang rambut / stylist) ada di keterangan.
// DURASI ADALAH ESTIMASI — price list tidak mencantumkannya. Mohon dicek owner.
// Item yang angkanya ambigu di price list sengaja belum dimasukkan.
import type { BookingService } from './content';

type Cat = { name: string; items: BookingService[] };
const s = (name: string, price: number, duration: number, note = '', from = false): BookingService => ({ name, price, duration, note, from });
const len = (a: number, b: number, c: number, d?: number) =>
  `Pendek ${a} · Sedang ${b} · Panjang ${c}${d ? ` · Sangat panjang ${d}` : ''} (ribu)`;

export const menuKedoya: Cat[] = [
  {
    name: 'Haircut & Blow',
    items: [
      s('Haircut Ladies', 348000, 60, 'Oscar / Eddy Casper / Shandy 348rb · Samuel 398rb (Rabu & Minggu) · termasuk Kérastase wash, hair oil & styling', true),
      s('Haircut Men', 248000, 45, 'Oscar / Eddy Casper / Shandy 248rb · Samuel 298rb (Rabu & Minggu)', true),
      s('Trim Cut', 118000, 30, 'Stylist mana saja'),
      s('Wash & Blow-Dry', 158000, 45, '158–198rb', true),
    ],
  },
  {
    name: 'Coloring',
    items: [
      s('Basic Color', 700000, 120, len(700, 950, 1100, 1350), true),
      s('Fashion Color', 1700000, 240, 'Termasuk 1x bleaching · ' + len(1700, 2100, 2500, 2900), true),
      s('Balayage / Highlights', 1900000, 240, len(1900, 2300, 2700, 3100), true),
    ],
  },
  {
    name: 'Smoothing & Keratin',
    items: [
      s('Smoothing', 900000, 180, len(900, 1200, 1500, 1800), true),
      s('Keratin / Wave', 1100000, 180, len(1100, 1400, 1700, 2000), true),
      s('Perm', 600000, 150, len(600, 800, 1000, 1200), true),
    ],
  },
  {
    name: 'Treatment',
    items: [
      s('Olaplex Treatment 60 mnt', 499000, 60),
      s('Olaplex Treatment 90 mnt', 899000, 90),
      s('Ritual Kérastase 60 mnt', 499000, 60),
      s('Ritual Kérastase 90 mnt', 899000, 90),
      s('Hair Mask Kérastase', 499000, 60),
      s('Davines Treatment 60 mnt', 499000, 60),
      s('Davines Treatment 90 mnt', 899000, 90),
      s('Express Hair Mask', 150000, 30),
    ],
  },
  {
    name: 'Hair Extension',
    items: [s('Hair Extension (ring/lem)', 2000000, 180, '100 pcs · 50cm 2jt · 55cm 2,5jt · 60cm 3jt · versi ikat Super/Premium tersedia', true)],
  },
];

export const menuAlamSutera: Cat[] = [
  {
    name: 'Haircut',
    items: [
      s("Women's Haircut", 250000, 60, '250 / 300 / 398rb', true),
      s("Men's Haircut", 150000, 45, '150 / 200 / 250rb', true),
      s('Hair Do', 200000, 60),
    ],
  },
  {
    name: 'Blow & Styling',
    items: [
      s('Dry Blow (blow kering)', 70000, 30),
      s('Natural Blow', 150000, 45),
      s('Flat-Iron Blow (blow catok)', 175000, 45),
      s('Extension Blow', 200000, 60),
    ],
  },
  {
    name: 'Hair Spa & Treatment',
    items: [
      s('Creambath', 150000, 60),
      s('Hair Spa', 180000, 60),
      s("L'Oréal Expert", 300000, 60),
      s('Scalp Treatment by Davines', 500000, 60, '500 / 700 / 900rb', true),
      s('Hair Treatment by Davines', 500000, 60, '500 / 700 / 900rb', true),
    ],
  },
  {
    name: 'Coloring & Smoothing',
    items: [
      s('Basic Color', 700000, 120, len(700, 950, 1100, 1350), true),
      s('Fashion Color', 1700000, 240, 'Termasuk 1x bleaching · ' + len(1700, 2100, 2500, 2900), true),
      s('Balayage / Highlights', 1900000, 240, len(1900, 2300, 2700, 3100), true),
      s('Smoothing', 900000, 180, len(900, 1200, 1500, 1800), true),
      s('Keratin / Wave', 1000000, 180, len(1000, 1400, 1700, 2000), true),
    ],
  },
  {
    name: 'Nails & Lash',
    items: [
      s('Manicure', 125000, 45),
      s('Pedicure', 150000, 60),
      s('Gel Polish', 100000, 45),
      s('Nail Art', 150000, 60, '', true),
      s('Eyelash Extension', 250000, 90, '250 / 350 / 450rb', true),
      s('Totok Wajah', 100000, 30),
    ],
  },
  {
    name: 'Body Spa & Waxing',
    items: [
      s('Back Massage', 125000, 45),
      s('Foot Massage', 100000, 45),
      s('Full Body Massage', 200000, 60),
      s('Waxing Underarms', 75000, 20),
      s('Waxing Half Leg', 125000, 30),
      s('Waxing Full Leg', 175000, 45),
      s('Waxing Bikini', 200000, 30),
    ],
  },
  {
    name: 'Hair Extension',
    items: [s('Hair Extension (ring/lem)', 2000000, 180, '100 pcs · 50cm 2jt · 55cm 2,5jt · 60cm 3jt · versi ikat Super/Premium tersedia', true)],
  },
];

export const menuKelapaGading: Cat[] = [
  {
    name: 'Haircut & Blow',
    items: [
      s('Hair Wash (tanpa blow)', 50000, 20),
      s('Wash & Blow / Catok Curly', 105000, 45),
      s('Wash & Hair Bun / Sanggul', 125000, 60, '125 / 150rb', true),
      s('Bangs Cut', 40000, 15),
      s('King Cut', 125000, 45),
      s('Queen Cut', 200000, 60),
      s('Kids Cut', 80000, 30),
    ],
  },
  {
    name: 'Hair Treatment',
    items: [
      s('Creambath Tradisional', 100000, 60),
      s("Hair Spa by L'Oréal", 130000, 60),
      s('Hair Spa by Shiseido', 150000, 60),
      s('Hair Spa by Mochegi', 150000, 60),
      s('Ozon', 50000, 20),
      s("L'Oréal Serie Expert Treatment", 255000, 60),
      s('Magic Ion Therapy', 500000, 90, '500 / 700 / 900rb', true),
    ],
  },
  {
    name: 'Hair Fashion',
    items: [
      s('King Colour', 275000, 90),
      s("Hair Coloring by L'Oréal", 550000, 120, '550rb – 1,75jt', true),
      s('Hair Cleansing by Elgon', 275000, 90, '275 – 875rb', true),
      s('Highlight', 475000, 180, '475 / 675 / 875rb', true),
      s('Smoothing', 675000, 180, '675 / 875rb / 1,175jt', true),
      s('Wave', 375000, 150, '375 / 600 / 800rb', true),
      s('Keratin', 980000, 180, '980rb / 1,2jt / 1,4jt', true),
      s('Keratin Smoothing', 1250000, 210, '1,25 / 1,55 / 1,75 / 2jt', true),
    ],
  },
  {
    name: 'Hand & Foot',
    items: [
      s('Manicure', 110000, 45),
      s('Pedicure', 120000, 60),
      s('French Manicure Gel Polish', 160000, 60),
      s('Nail Polish by O.P.I', 50000, 20),
      s('Nail Art', 65000, 30),
      s('Cut Nail Only', 35000, 15),
      s('Remove Gel Polish', 50000, 20),
      s('Hand Scrub', 50000, 20),
      s('Foot Scrub', 85000, 30, '85 / 100rb', true),
      s('Back Scrub', 75000, 30),
      s('Hand Mask Collagen', 75000, 20),
      s('Foot Mask Collagen', 85000, 20),
      s('Hand Bleaching', 100000, 30),
      s('Foot Bleaching', 150000, 30),
      s('Foot Reflexology', 75000, 45, '75 / 100rb', true),
    ],
  },
  {
    name: 'Nails',
    items: [
      s('Nail Art Acrylic', 150000, 60),
      s('Nail Extension', 150000, 90),
      s('Gradation Gel', 250000, 60),
      s('Nail Art Combination', 300000, 90),
      s('Nail Art Wedding', 300000, 90),
    ],
  },
  {
    name: 'Makeup & Lash',
    items: [
      s('Eye Make Up', 150000, 45, '150 / 225rb', true),
      s('Full Make Up', 350000, 90, '350 / 500rb', true),
      s('Pasang Bulu Mata Palsu', 50000, 15),
      s('Lash Lift', 150000, 60),
      s('Eyelash Extension', 250000, 90),
      s('Remove Eyelash Extension', 75000, 30),
      s('Brow Bomber', 300000, 60),
      s('Sulam Alis', 1500000, 120),
      s('Pluck Eyebrow', 35000, 15),
    ],
  },
  {
    name: 'Face',
    items: [
      s('Facial Biokos', 250000, 60),
      s('Facial Galvanic Spa', 150000, 60),
      s('Face Mask Biokos', 50000, 20),
      s('Face Mask NU Skin', 100000, 20),
      s('Totok Wajah', 50000, 30),
    ],
  },
  {
    name: 'Body Treatment',
    items: [
      s('Body Massage (Queen) 60 mnt', 135000, 60),
      s('Body Massage (Queen) 90 mnt', 200000, 90),
      s('Body Massage (Queen) 120 mnt', 260000, 120),
      s('Body Massage (King) 60 mnt', 150000, 60),
      s('Body Massage (King) 90 mnt', 225000, 90),
      s('Body Massage (King) 120 mnt', 280000, 120),
      s('Body Spa (Queen)', 265000, 120),
      s('Body Spa (King)', 285000, 120),
      s('Back Therapy Massage', 75000, 30, '75 / 100rb', true),
      s('Body Scrub', 150000, 60),
      s('Body Mask Collagen', 150000, 45),
      s('Body Mask Milk', 75000, 45),
      s('Body Bleaching', 250000, 60),
      s('Body Steam', 50000, 30),
      s('Ear Candle', 85000, 30),
      s('Foot Spa', 150000, 60),
      s('Hand Massage Only', 50000, 20),
      s('Ratus Kecantikan', 65000, 30),
      s('Totok Perut', 100000, 30),
      s('V-Spa Treatment', 65000, 30),
    ],
  },
];
