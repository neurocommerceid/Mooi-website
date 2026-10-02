export const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? '6281288451500';

export const waLink = (text = 'Halo Mooi, saya mau reservasi.') =>
  `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

export const services = [
  { icon: '✂', name: 'Hair Cut & Styling', desc: 'Potongan yang disesuaikan dengan bentuk wajah dan gaya keseharian Anda.', price: 'Mulai Rp 150.000' },
  { icon: '◍', name: 'Coloring & Highlight', desc: 'Pewarnaan modern dengan produk premium yang menjaga kesehatan rambut.', price: 'Mulai Rp 450.000' },
  { icon: '❋', name: 'Smoothing & Keratin', desc: 'Rambut lebih halus, mudah diatur, dan tetap sehat dalam jangka panjang.', price: 'Mulai Rp 650.000' },
  { icon: '✧', name: 'Hair Spa & Treatment', desc: 'Perawatan intensif untuk rambut kering, rusak, dan rontok.', price: 'Mulai Rp 200.000' },
  { icon: '♡', name: 'Beauty Bar', desc: 'Perawatan kuku, bulu mata, dan makeup untuk tampilan sempurna.', price: 'Mulai Rp 125.000' },
  { icon: '✦', name: 'Bridal & Event', desc: 'Paket rambut dan makeup untuk hari pernikahan dan acara spesial.', price: 'Konsultasi' },
];

export const branches = [
  { slug: 'kedoya', name: 'Mooi Kedoya', address: 'Jl. [alamat cabang Kedoya]', hours: 'Setiap hari · 09.00 – 20.00', maps: '#', ig: 'https://instagram.com/mooihairstudio_kedoya' },
  { slug: 'alam-sutera', name: 'Mooi Alam Sutera', address: 'Jl. [alamat cabang Alam Sutera]', hours: 'Setiap hari · 09.00 – 20.00', maps: '#', ig: 'https://instagram.com/mooihairstudio_alsut' },
  { slug: 'kelapa-gading', name: 'Mooi Kelapa Gading', address: 'Jl. [alamat cabang Kelapa Gading]', hours: 'Setiap hari · 09.00 – 20.00', maps: '#', ig: 'https://instagram.com/mooihairstudio_klpgdg' },
];

export const gallery = [
  { label: 'Coloring', from: '#EBD2C5', to: '#D2A590' },
  { label: 'Smoothing', from: '#E7CBBC', to: '#C08E78' },
  { label: 'Bridal', from: '#F0DED4', to: '#D9AE9A' },
  { label: 'Hair Spa', from: '#E3C3B2', to: '#BA846C' },
];

export const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/lokasi', label: 'Lokasi' },
  { href: '/kontak', label: 'Kontak' },
];
