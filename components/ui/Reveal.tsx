'use client';
import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react';

type Props = {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  variant?: 'fade' | 'img' | 'line';
  delay?: number;
  style?: CSSProperties;
};

const cls = { fade: 'reveal', img: 'reveal-img', line: 'reveal-line' };

export default function Reveal({ children, as: Tag = 'div', className = '', variant = 'fade', delay = 0, style }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${cls[variant]} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}
