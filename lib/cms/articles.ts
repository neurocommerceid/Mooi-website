// Artikel bawaan. Setelah artikel disimpan lewat admin, isi database yang dipakai.
// Format isi: paragraf dipisah satu baris kosong, "## " untuk subjudul, "- " untuk daftar, **tebal**.
import type { Article } from './content';

export const firstArticle: Article = {
  published: true,
  slug: 'merawat-rambut-setelah-coloring',
  date: '2026-10-09',
  cover: { src: '/media/svc-coloring.jpg', alt: 'Rambut berwarna lavender' },
  title: '7 Cara Menjaga Warna Rambut Tetap Awet Setelah Coloring',
  excerpt: 'Warna rambut cepat pudar biasanya karena kebiasaan kecil sehari-hari. Ini tujuh langkah sederhana agar hasil coloring bertahan lebih lama.',
  body: `Hasil coloring yang baru keluar dari salon selalu terlihat paling cantik. Kabar baiknya, warna itu bisa bertahan jauh lebih lama bila rambut dirawat dengan benar di rumah. Sebagian besar warna pudar bukan karena kualitas cat, melainkan karena kebiasaan kecil sehari-hari.

## 1. Tunda keramas 2–3 hari

Setelah coloring, lapisan luar rambut (kutikula) butuh waktu untuk kembali menutup dan "mengunci" pigmen warna. Bila langsung dikeramas, sebagian warna ikut luntur. Usahakan menunggu sekitar 48–72 jam sebelum keramas pertama.

## 2. Pilih sampo untuk rambut berwarna

Sampo dengan kandungan pembersih yang keras dapat mengikis warna lebih cepat. Gunakan sampo dan kondisioner berlabel **color-safe** atau bebas sulfat, yang membersihkan dengan lebih lembut.

## 3. Bilas dengan air suam atau dingin

Air panas membuka kutikula sehingga pigmen lebih mudah keluar. Keramas dengan air suam-suam kuku, lalu bilas terakhir dengan air yang lebih dingin.

## 4. Jangan keramas setiap hari

Semakin sering rambut dicuci, semakin cepat warnanya memudar. Bila memungkinkan, cukup 2–3 kali seminggu. Di antara hari keramas, dry shampoo bisa membantu rambut tetap segar.

## 5. Selalu pakai pelindung panas

Hair dryer, catok, dan curling iron membuat rambut berwarna lebih cepat kering dan kusam. Semprotkan heat protectant sebelum styling dan gunakan suhu sedang, bukan yang paling panas.

## 6. Lindungi dari matahari dan kaporit

Sinar UV dan kaporit di kolam renang termasuk penyebab utama warna berubah atau pudar. Saat beraktivitas di luar ruangan, gunakan topi atau produk rambut dengan pelindung UV. Sebelum berenang, basahi rambut dengan air bersih dan oleskan sedikit kondisioner, lalu bilas segera setelah selesai.

## 7. Rutin melembapkan rambut

Proses coloring membuat rambut lebih mudah kering. Gunakan hair mask atau kondisioner intensif seminggu sekali agar rambut tetap lembut, berkilau, dan warnanya terlihat lebih hidup.

## Kapan perlu kembali ke salon?

Warna di akar rambut umumnya mulai terlihat berbeda setelah 6–8 minggu, tergantung kecepatan tumbuh rambut dan jenis warna yang dipilih. Datanglah lebih cepat bila:

- warna terlihat kusam atau berubah tone,
- rambut terasa kering, kasar, atau mudah patah,
- Anda ingin menyegarkan warna tanpa coloring ulang dari awal.

Setiap rambut berbeda. Stylist Mooi dapat membantu melihat kondisi rambut Anda dan menyarankan perawatan yang paling sesuai.`,
  titleEn: '7 Ways to Make Your Hair Colour Last Longer',
  excerptEn: 'Hair colour usually fades because of small everyday habits. Here are seven simple steps to keep your colour looking fresh for longer.',
  bodyEn: `Fresh-from-the-salon colour always looks its best. The good news is that it can last much longer when you care for your hair properly at home. Most fading is caused not by the dye itself, but by small everyday habits.

## 1. Wait 2–3 days before washing

After colouring, the outer layer of the hair (the cuticle) needs time to close and "lock in" the pigment. Washing straight away rinses some of the colour out. Try to wait about 48–72 hours before your first wash.

## 2. Use shampoo made for coloured hair

Shampoos with harsh cleansers strip colour faster. Choose a **colour-safe** or sulphate-free shampoo and conditioner that cleanse more gently.

## 3. Rinse with lukewarm or cool water

Hot water opens the cuticle and lets pigment escape. Wash with lukewarm water and finish with a cooler rinse.

## 4. Don't wash every day

The more often you wash, the faster colour fades. If you can, two to three times a week is enough. Dry shampoo helps keep hair fresh in between.

## 5. Always use heat protection

Hair dryers, straighteners, and curling irons leave coloured hair dry and dull more quickly. Spray on a heat protectant before styling and use a medium setting rather than the hottest one.

## 6. Protect it from sun and chlorine

UV rays and pool chlorine are among the main causes of colour fading or shifting. Outdoors, wear a hat or use a hair product with UV protection. Before swimming, wet your hair with clean water and apply a little conditioner, then rinse right after.

## 7. Moisturise regularly

Colouring makes hair more prone to dryness. Use a hair mask or deep conditioner once a week to keep hair soft, shiny, and the colour vibrant.

## When should you come back to the salon?

Roots usually start to show after 6–8 weeks, depending on how fast your hair grows and the colour you chose. Come in sooner if:

- the colour looks dull or the tone has shifted,
- your hair feels dry, rough, or breaks easily,
- you'd like to refresh your colour without a full re-colour.

Every head of hair is different. A Mooi stylist can look at your hair and recommend the treatment that suits it best.`,
};
