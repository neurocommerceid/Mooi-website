'use client';

// Kompres foto di browser sebelum diunggah: putar sesuai EXIF, kecilkan sisi
// terpanjang ke MAX_EDGE, lalu simpan sebagai WebP (atau JPEG bila browser
// tidak bisa membuat WebP). Bila hasilnya tidak lebih kecil, file asli dipakai.

const MAX_EDGE = 2400;
const QUALITY = 0.82;

export type Compressed = { file: File; before: number; after: number; width: number; height: number };

function toBlob(canvas: HTMLCanvasElement, type: string, q: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, q));
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // jatuh ke <img> di bawah
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const isHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);

// Foto iPhone (HEIC): Safari bisa membacanya langsung; browser lain perlu
// dikonversi dulu. Library konversi (±1,3 MB) hanya dimuat saat dibutuhkan.
async function decodeAny(file: File) {
  try {
    return await decode(file);
  } catch (e) {
    if (!isHeic(file)) throw e;
    const heic2any = (await import('heic2any')).default;
    const out = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const blob = Array.isArray(out) ? out[0] : out;
    return decode(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
  }
}

export async function compressImage(file: File): Promise<Compressed> {
  const before = file.size;
  const src = await decodeAny(file);
  const w0 = 'naturalWidth' in src ? src.naturalWidth : src.width;
  const h0 = 'naturalHeight' in src ? src.naturalHeight : src.height;
  const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0));
  const width = Math.round(w0 * scale);
  const height = Math.round(h0 * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { file, before, after: before, width: w0, height: h0 };
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, width, height);
  if ('close' in src) src.close();

  let blob = await toBlob(canvas, 'image/webp', QUALITY);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', QUALITY);
  if (!blob || (blob.size >= before && scale === 1 && !isHeic(file))) return { file, before, after: before, width: w0, height: h0 };

  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return { file: new File([blob], name, { type: blob.type }), before, after: blob.size, width, height };
}

export const mb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
