import Reveal from './Reveal';

export default function SectionHead({
  kicker,
  title,
  sub,
  center = false,
  dark = false,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal><p className={`kicker ${center ? 'justify-center' : ''}`}>{kicker}</p></Reveal>
      <Reveal delay={120}>
        <h2 className={`mt-5 font-serif text-4xl font-light leading-[1.08] md:text-6xl ${dark ? 'text-ivory' : 'text-ink'}`}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={220}>
          <p className={`mt-5 text-[15px] font-light leading-relaxed ${dark ? 'text-ivory/60' : 'text-ink-muted'}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
