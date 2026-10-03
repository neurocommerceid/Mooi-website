import { Fragment } from 'react';

// Teks bertanda *kata* → miring rose-gold. Tidak memakai innerHTML.
export default function Rich({ text, className = 'text-gold-sheen' }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <em key={i} className={className}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
