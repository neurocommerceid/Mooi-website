'use client';
import { useEffect, useState } from 'react';
import type { Video } from '@/lib/media';

// Merender video hanya untuk breakpoint yang sesuai, agar pengunjung tidak
// mengunduh dua salinan. Menghormati prefers-reduced-motion (poster saja).
export default function HeroVideo({ video, desktop, className = '' }: { video: NonNullable<Video>; desktop: boolean; className?: string }) {
  const [show, setShow] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setShow(mq.matches === desktop);
      setStill(rm.matches);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [desktop]);

  if (!show) return null;
  if (still && video.poster) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={video.poster} alt="" aria-hidden className={className} />;
  }

  return (
    <video className={className} poster={video.poster} autoPlay muted loop playsInline preload="auto" aria-hidden>
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.src} type="video/mp4" />
    </video>
  );
}
