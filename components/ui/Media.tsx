import Image from 'next/image';
import type { Img } from '@/lib/cms/content';

// Gambar dengan fallback gradien beranimasi bila slot belum diisi.
export default function Media({
  photo,
  label,
  className = '',
  sizes = '100vw',
  priority = false,
  zoom = true,
  tone = 'light',
}: {
  photo?: Img | null;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
  tone?: 'light' | 'dark';
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {photo?.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-transform duration-[1600ms] ease-out ${zoom ? 'group-hover:scale-[1.06]' : ''}`}
        />
      ) : (
        <Placeholder label={label} tone={tone} />
      )}
      {photo?.src && label && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute bottom-5 left-5 font-serif text-lg italic tracking-wide text-white/90 transition-transform duration-700 group-hover:-translate-y-1">
            {label}
          </span>
        </>
      )}
    </div>
  );
}

export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'dark' }) {
  const base = tone === 'dark' ? 'from-[#3A2A24] via-[#5A3D31] to-[#8A5C46]' : 'from-[#EAD9CB] via-[#D8B49C] to-[#B98166]';
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${base}`}>
      <div className="animate-drift absolute -left-1/4 -top-1/4 h-[90%] w-[90%] rounded-full bg-white/20 blur-3xl" />
      <div className="animate-drift absolute -bottom-1/3 -right-1/4 h-[80%] w-[80%] rounded-full bg-[#9E6449]/30 blur-3xl [animation-delay:-9s]" />
      <svg viewBox="0 0 200 200" className="animate-spin-slower absolute left-1/2 top-1/2 h-[70%] max-h-56 -translate-x-1/2 -translate-y-1/2 text-white/25" fill="none">
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.6" />
      </svg>
      {label && (
        <span className="absolute bottom-5 left-5 font-serif text-lg italic tracking-wide text-white/85">{label}</span>
      )}
    </div>
  );
}
