'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import { branchWa, waLink } from '@/lib/cms/content';
import { supabaseBrowser } from '@/lib/supabase/browser';
import {
  ANY, addDays, branchHours, daysLabel, durasi, findServices, jakartaNow, menuFor, rupiah, slotsFor, stylistsAt, tanggalPanjang, totals, worksOn, type Taken,
} from '@/lib/booking';

type Branch = Content['branches']['items'][number];
type Props = { branches: Branch[]; booking: Content['booking']; whatsapp: string; initialBranch?: string };
type StepId = 'cabang' | 'layanan' | 'stylist' | 'jadwal' | 'data';

const LABEL: Record<StepId, string> = { cabang: 'Cabang', layanan: 'Layanan', stylist: 'Stylist', jadwal: 'Jadwal', data: 'Data diri' };
const STORE = 'mooi-booking-v1';

const hari = (d: string, opt: Intl.DateTimeFormatOptions) => new Date(`${d}T00:00:00Z`).toLocaleDateString('id-ID', { ...opt, timeZone: 'UTC' });

export default function BookingFlow({ branches, booking, whatsapp, initialBranch }: Props) {
  // ---------- state ----------
  const [cabang, setCabang] = useState(branches.some((b) => b.name === initialBranch) ? initialBranch! : '');
  const [picked, setPicked] = useState<string[]>([]);
  const [stylist, setStylist] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [catatan, setCatatan] = useState('');
  const [step, setStep] = useState<StepId>(cabang ? 'layanan' : 'cabang');
  const [dir, setDir] = useState<1 | -1>(1);
  const [taken, setTaken] = useState<Taken[]>([]);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  // Pulihkan progres bila halaman dimuat ulang.
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (s && !initialBranch) {
        if (branches.some((b) => b.name === s.cabang)) setCabang(s.cabang);
        setPicked(s.picked ?? []);
        setStylist(s.stylist ?? '');
        setDate(s.date ?? '');
        setTime(s.time ?? '');
        setNama(s.nama ?? '');
        setWa(s.wa ?? '');
        setCatatan(s.catatan ?? '');
        if (s.step) setStep(s.step);
      }
    } catch {}
    restored.current = true;
  }, [branches, initialBranch]);

  useEffect(() => {
    if (!restored.current || done) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ cabang, picked, stylist, date, time, nama, wa, catatan, step }));
    } catch {}
  }, [cabang, picked, stylist, date, time, nama, wa, catatan, step, done]);

  // ---------- turunan ----------
  const branch = branches.find((b) => b.name === cabang);
  const team = useMemo(() => stylistsAt(booking.stylists, cabang), [booking.stylists, cabang]);
  const steps: StepId[] = team.length ? ['cabang', 'layanan', 'stylist', 'jadwal', 'data'] : ['cabang', 'layanan', 'jadwal', 'data'];
  const idx = steps.indexOf(step);
  const categories = useMemo(() => menuFor(booking, cabang), [booking, cabang]);
  const items = useMemo(() => findServices(categories, picked), [categories, picked]);
  const sum = totals(items);
  const who = stylist || ANY;
  const today = jakartaNow().date;
  const days = useMemo(
    () => Array.from({ length: Math.max(1, booking.daysAhead || 14) }, (_, i) => addDays(today, i)),
    [booking.daysAhead, today],
  );

  // Slot terkonfirmasi untuk cabang+tanggal terpilih (gagal = tidak ada yang ditutup).
  useEffect(() => {
    if (!cabang || !date) return;
    let live = true;
    supabaseBrowser()
      .rpc('taken_slots', { p_cabang: cabang, p_tanggal: date })
      .then(
        ({ data }: { data: unknown }) => live && setTaken(Array.isArray(data) ? (data as Taken[]) : []),
        () => live && setTaken([]),
      );
    return () => {
      live = false;
    };
  }, [cabang, date]);

  const slotArgs = useMemo(
    () =>
      branch && {
        ...branchHours(branch),
        interval: booking.interval,
        leadMinutes: booking.leadMinutes,
        duration: sum.duration,
        stylist: who,
      },
    [branch, booking.interval, booking.leadMinutes, sum.duration, who],
  );
  // Hanya stylist yang bertugas di tanggal itu yang dihitung.
  const slotsOn = useMemo(
    () => (d: string, tk: Taken[]) => {
      if (!slotArgs) return [];
      const onDuty = team.filter((t) => worksOn(t, d));
      const list = slotsFor({ ...slotArgs, date: d, taken: tk, stylistNames: onDuty.map((t) => t.name) });
      const chosen = team.find((t) => t.name === who);
      const nobody = team.length > 0 && onDuty.length === 0;
      return nobody || (chosen && !worksOn(chosen, d)) ? list.map((x) => ({ ...x, ok: false })) : list;
    },
    [slotArgs, team, who],
  );
  const slots = useMemo(() => (date ? slotsOn(date, taken) : []), [slotsOn, date, taken]);
  const countFor = (d: string) => slotsOn(d, d === date ? taken : []).filter((s) => s.ok).length;

  // Pilihan yang tidak lagi valid (mis. ganti layanan → jam tak muat) dibersihkan.
  useEffect(() => {
    if (time && date && slots.length && !slots.find((s) => s.time === time)?.ok) setTime('');
  }, [time, date, slots]);
  useEffect(() => {
    if (stylist && stylist !== ANY && !team.some((t) => t.name === stylist)) setStylist('');
  }, [team, stylist]);
  useEffect(() => {
    if (!restored.current || !cabang) return;
    const valid = picked.filter((n) => categories.some((c) => c.items.some((i) => i.name === n)));
    if (valid.length !== picked.length) setPicked(valid);
  }, [categories, picked, cabang]);

  // ---------- navigasi ----------
  const canNext: Record<StepId, boolean> = {
    cabang: !!cabang,
    layanan: items.length > 0,
    stylist: true,
    jadwal: !!date && !!time,
    data: nama.trim().length > 1 && /^\+?\d{9,15}$/.test(wa.replace(/[^\d+]/g, '')),
  };
  const firstIncomplete = steps.find((s) => !canNext[s]);
  const reachable = (s: StepId) => steps.indexOf(s) <= (firstIncomplete ? steps.indexOf(firstIncomplete) : steps.length - 1);

  function go(s: StepId) {
    if (!reachable(s)) return;
    setDir(steps.indexOf(s) >= idx ? 1 : -1);
    setStep(s);
    setErr('');
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  const next = () => idx < steps.length - 1 && canNext[step] && go(steps[idx + 1]);

  // Lanjut otomatis setelah memilih. Dijalankan lewat effect supaya `go`
  // membaca state yang sudah diperbarui (bukan nilai lama dari closure).
  const [pending, setPending] = useState<StepId | null>(null);
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => {
      setPending(null);
      goRef.current(pending);
    }, 260);
    return () => clearTimeout(t);
  }, [pending]);
  const advanceSoon = (to: StepId) => setPending(to);

  async function submit() {
    if (!canNext.data) return;
    setSending(true);
    setErr('');
    const form = top.current?.closest('section')?.querySelector<HTMLInputElement>('input[name="website"]');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, whatsapp: wa, cabang, stylist: who, tanggal: date, jam: time, layanan: picked, catatan, website: form?.value ?? '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? 'Gagal mengirim. Coba lagi atau booking via WhatsApp.');
        if (res.status === 409) {
          setTime('');
          go('jadwal');
        }
        return;
      }
      setDone(true);
      try {
        sessionStorage.removeItem(STORE);
      } catch {}
      requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      setErr('Koneksi bermasalah. Coba lagi atau booking via WhatsApp.');
    } finally {
      setSending(false);
    }
  }

  const waText =
    `Halo ${cabang}, saya ${nama} ingin booking:\n` +
    items.map((i) => `• ${i.name}`).join('\n') +
    `\nStylist: ${who}\nJadwal: ${date ? tanggalPanjang(date) : '-'}, ${time} WIB` +
    (catatan ? `\nCatatan: ${catatan}` : '') +
    `\n\nMohon konfirmasinya, terima kasih.`;

  // ---------- render ----------
  if (done) {
    return (
      <div ref={top} className="mx-auto max-w-xl scroll-mt-28 text-center step-in">
        <svg viewBox="0 0 80 80" className="animate-pop mx-auto h-20 w-20">
          <circle cx="40" cy="40" r="38" fill="none" stroke="#C08A6C" strokeWidth="1.5" />
          <path d="M24 41l11 11 21-23" fill="none" stroke="#9E6449" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="60" strokeDashoffset="60" style={{ animation: 'draw .6s .35s ease-out forwards' }} />
        </svg>
        <h2 className="mt-8 font-serif text-4xl font-light text-ink md:text-5xl">Permintaan terkirim.</h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">{booking.successNote}</p>
        <div className="mt-10 rounded-3xl border border-line bg-white/70 p-6 text-left">
          <Summary cabang={cabang} items={items} who={who} date={date} time={time} total={sum} />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={waLink(branchWa(branch, whatsapp), waText)} target="_blank" rel="noopener" className="btn">Kirim detail ke WhatsApp</a>
          <Link href="/" className="btn-line text-ink">Kembali ke beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={top} className="mx-auto grid max-w-[1200px] scroll-mt-28 gap-10 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0 pb-36 lg:pb-0">
        {/* Progres — langkah yang sudah dilalui bisa diklik */}
        <ol className="flex gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => go(s)}
                disabled={!reachable(s)}
                className="group w-full text-left disabled:cursor-not-allowed"
                aria-current={s === step ? 'step' : undefined}
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-line">
                  <span className={`block h-full rounded-full bg-gold transition-all duration-700 ${i < idx ? 'w-full' : i === idx ? 'w-1/2' : 'w-0'}`} />
                </span>
                <span className={`mt-2 hidden text-[11px] uppercase tracking-[0.18em] sm:block ${i === idx ? 'text-ink' : i < idx ? 'text-gold-deep group-hover:text-ink' : 'text-ink-faint'}`}>
                  {String(i + 1).padStart(2, '0')} · {LABEL[s]}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink-faint sm:hidden">
          Langkah {idx + 1} dari {steps.length} · <span className="text-ink">{LABEL[step]}</span>
        </p>

        <div key={step} className={`mt-10 ${dir === 1 ? 'step-in' : 'step-back'}`}>
          {step === 'cabang' && (
            <Step title="Mau ke cabang mana?" sub="Semua cabang punya standar layanan yang sama.">
              <div className="grid gap-4 sm:grid-cols-3">
                {branches.map((b) => {
                  const on = b.name === cabang;
                  return (
                    <button key={b.name} type="button" aria-pressed={on}
                      onClick={() => { setCabang(b.name); setTime(''); advanceSoon('layanan'); }}
                      className={`group overflow-hidden rounded-3xl border bg-white text-left transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(60,40,30,.45)] ${on ? 'border-gold ring-2 ring-gold/30' : 'border-line'}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
                        {b.image?.src && <img src={b.image.src} alt="" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />}
                        <span className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[13px] transition ${on ? 'bg-gold text-white' : 'bg-white/80 text-transparent'}`}>✓</span>
                      </div>
                      <div className="p-5">
                        <p className="font-serif text-2xl text-ink">{b.name.replace(/^Mooi\s+/, '')}</p>
                        <p className="mt-1 line-clamp-2 text-[13px] text-ink-muted">{b.address}</p>
                        <p className="mt-2 text-[12px] text-gold-deep">{b.hours}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 'layanan' && (
            <Step title="Pilih layanan" sub={`${cabang} · boleh lebih dari satu`}>
              <Services key={cabang} categories={categories} picked={picked} onToggle={(n) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))} />
            </Step>
          )}

          {step === 'stylist' && (
            <Step title="Pilih stylist" sub={`Tersedia di ${cabang}`}>
              <div className="grid gap-3">
                <StylistCard name={ANY} role="Kami pilihkan yang sedang tersedia" hint="Paling banyak pilihan jam" on={who === ANY}
                  onClick={() => { setStylist(ANY); advanceSoon('jadwal'); }} />
                {team.map((s) => (
                  <StylistCard key={s.name} name={s.name} role={[s.role, s.years, daysLabel(s)].filter(Boolean).join(' · ')} hint={s.bio} photo={s.photo?.src}
                    on={stylist === s.name} onClick={() => { setStylist(s.name); advanceSoon('jadwal'); }} />
                ))}
              </div>
            </Step>
          )}

          {step === 'jadwal' && (
            <Step title="Pilih jadwal" sub={`${who} · ${durasi(sum.duration)}`}>
              <div className="no-scrollbar -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
                {days.map((d, i) => {
                  const n = countFor(d);
                  const on = d === date;
                  return (
                    <button key={d} type="button" disabled={!n} aria-pressed={on}
                      onClick={() => { setDate(d); setTime(''); }}
                      className={`min-w-[68px] snap-start rounded-2xl border px-3 py-3 text-center transition duration-300 disabled:opacity-35 ${on ? 'border-espresso bg-espresso text-ivory shadow-lg' : 'border-line bg-white hover:border-gold'}`}>
                      <span className="block text-[11px] uppercase tracking-wider opacity-70">{i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : hari(d, { weekday: 'short' })}</span>
                      <span className="mt-1 block font-serif text-2xl leading-none">{hari(d, { day: 'numeric' })}</span>
                      <span className="mt-1 block text-[10px] opacity-70">{n ? `${n} slot` : 'penuh'}</span>
                    </button>
                  );
                })}
              </div>

              {date ? (
                <div className="mt-8">
                  <div className="flex items-baseline justify-between">
                    <p className="font-medium text-ink">{tanggalPanjang(date)}</p>
                    {branch && <p className="text-[12px] text-ink-faint">{branch.open || '09:00'} – {branch.close || '20:00'}</p>}
                  </div>
                  {[['Pagi', 0, 720], ['Siang', 720, 900], ['Sore & malam', 900, 1440]].map(([label, from, to]) => {
                    const group = slots.filter((s) => {
                      const m = Number(s.time.slice(0, 2)) * 60 + Number(s.time.slice(3));
                      return m >= (from as number) && m < (to as number);
                    });
                    if (!group.length) return null;
                    return (
                      <div key={label as string} className="mt-6">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">{label}</p>
                        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                          {group.map((s) => (
                            <button key={s.time} type="button" disabled={!s.ok} aria-pressed={time === s.time}
                              onClick={() => { setTime(s.time); advanceSoon('data'); }}
                              className={`rounded-xl border py-3 text-[14px] tabular-nums transition duration-300 disabled:border-transparent disabled:bg-ivory-soft disabled:text-ink-faint/60 disabled:line-through ${time === s.time ? 'border-gold bg-gold text-white shadow-md' : 'border-line bg-white hover:border-gold'}`}>
                              {s.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {!slots.some((s) => s.ok) && <p className="mt-6 text-sm text-ink-muted">Tidak ada jam tersisa di tanggal ini. Coba tanggal lain.</p>}
                  <p className="mt-6 text-[12px] text-ink-faint">Jam yang dicoret sudah lewat, terlalu dekat, atau sudah terisi.</p>
                </div>
              ) : (
                <p className="mt-8 text-sm text-ink-muted">Pilih tanggal untuk melihat jam yang tersedia.</p>
              )}
            </Step>
          )}

          {step === 'data' && (
            <Step title="Hampir selesai" sub="Untuk konfirmasi via WhatsApp.">
              <div className="grid gap-5">
                <Input label="Nama lengkap" value={nama} onChange={setNama} autoComplete="name" />
                <Input label="Nomor WhatsApp" value={wa} onChange={setWa} type="tel" inputMode="tel" placeholder="08xx" autoComplete="tel"
                  hint={wa && !canNext.data && nama.trim().length > 1 ? 'Periksa lagi nomornya (9–15 digit).' : ''} />
                <label className="block">
                  <span className="text-[12px] uppercase tracking-[0.16em] text-ink-muted">Catatan untuk stylist <span className="normal-case tracking-normal text-ink-faint">(opsional)</span></span>
                  <textarea rows={3} maxLength={1000} value={catatan} onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Mis. rambut baru di-bleach 2 bulan lalu"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] outline-none transition focus:border-gold" />
                </label>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              </div>

              <div className="mt-8 rounded-3xl border border-line bg-white/70 p-6 lg:hidden">
                <Summary cabang={cabang} items={items} who={who} date={date} time={time} total={sum} onEdit={go} hasStylist={!!team.length} />
              </div>

              {booking.policies.filter(Boolean).length > 0 && (
                <ul className="mt-6 grid gap-2 text-[13px] text-ink-muted">
                  {booking.policies.filter(Boolean).map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-gold">✓</span>{p}</li>
                  ))}
                </ul>
              )}
              {err && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p>}
              <button type="button" onClick={submit} disabled={!canNext.data || sending} className="btn mt-8 hidden w-full disabled:opacity-50 lg:inline-flex">
                {sending ? 'Mengirim…' : 'Kirim permintaan booking'}
              </button>
            </Step>
          )}
        </div>
      </div>

      {/* Ringkasan (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-3xl border border-line bg-white/70 p-6 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Ringkasan</p>
          <div className="mt-4">
            <Summary cabang={cabang} items={items} who={who} date={date} time={time} total={sum} onEdit={go} hasStylist={!!team.length} />
          </div>
          {step !== 'data' && (
            <button type="button" onClick={next} disabled={!canNext[step]} className="btn mt-6 w-full disabled:opacity-40">Lanjut</button>
          )}
        </div>
      </aside>

      {/* Bar bawah (ponsel) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink">{items.length ? `${sum.from ? 'mulai ' : ''}${rupiah(sum.price)}` : LABEL[step]}</p>
            <p className="truncate text-[12px] text-ink-muted">
              {items.length ? `${items.length} layanan · ${durasi(sum.duration)}` : cabang || 'Pilih cabang'}
              {date && time ? ` · ${hari(date, { day: 'numeric', month: 'short' })}, ${time}` : ''}
            </p>
          </div>
          {step === 'data' ? (
            <button type="button" onClick={submit} disabled={!canNext.data || sending} className="btn !px-6 !py-3.5 disabled:opacity-40">
              {sending ? 'Mengirim…' : 'Kirim'}
            </button>
          ) : (
            <button type="button" onClick={next} disabled={!canNext[step]} className="btn !px-7 !py-3.5 disabled:opacity-40">Lanjut</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- potongan UI ----------

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">{title}</h2>
      {sub && <p className="mt-2 text-[14px] text-ink-muted">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Services({ categories, picked, onToggle }: { categories: Content['booking']['categories']; picked: string[]; onToggle: (n: string) => void }) {
  const cats = categories.filter((c) => c.items.length);
  const [active, setActive] = useState(cats[0]?.name ?? '');
  const cat = cats.find((c) => c.name === active) ?? cats[0];
  const countIn = (c: (typeof cats)[number]) => c.items.filter((i) => picked.includes(i.name)).length;
  if (!cat) return <p className="text-ink-muted">Menu layanan belum diisi.</p>;
  return (
    <>
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
        {cats.map((c) => (
          <button key={c.name} type="button" onClick={() => setActive(c.name)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] transition duration-300 ${c.name === cat.name ? 'border-espresso bg-espresso text-ivory' : 'border-line bg-white text-ink-muted hover:text-ink'}`}>
            {c.name}
            {countIn(c) > 0 && <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] ${c.name === cat.name ? 'bg-gold text-white' : 'bg-gold/15 text-gold-deep'}`}>{countIn(c)}</span>}
          </button>
        ))}
      </div>
      <div key={cat.name} className="step-in mt-6 grid gap-3">
        {cat.items.map((i) => {
          const on = picked.includes(i.name);
          return (
            <button key={i.name} type="button" aria-pressed={on} onClick={() => onToggle(i.name)}
              className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition duration-300 ${on ? 'border-gold bg-[#FBF4EA] shadow-[0_12px_30px_-20px_rgba(158,100,73,.6)]' : 'border-line bg-white hover:border-gold/60'}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[13px] transition duration-300 ${on ? 'scale-110 border-gold bg-gold text-white' : 'border-line text-transparent'}`}>✓</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{i.name}</span>
                <span className="mt-0.5 block text-[12px] text-ink-muted">{[durasi(i.duration), i.note].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="shrink-0 text-right text-[14px] font-medium text-ink">
                {i.from && <span className="block text-[10px] font-normal uppercase tracking-wider text-ink-faint">mulai</span>}
                {rupiah(i.price)}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StylistCard({ name, role, hint, photo, on, onClick }: { name: string; role: string; hint?: string; photo?: string; on: boolean; onClick: () => void }) {
  const initials = name === ANY ? '✦' : name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${on ? 'border-gold bg-[#FBF4EA]' : 'border-line bg-white hover:border-gold/60'}`}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-light to-gold-deep font-serif text-lg text-white">
        {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{name}</span>
        {role && <span className="block text-[13px] text-ink-muted">{role}</span>}
        {hint && <span className="mt-1 block text-[12px] italic text-ink-faint">{hint}</span>}
      </span>
      <span className={`rounded-full px-4 py-2 text-[12px] transition ${on ? 'bg-espresso text-ivory' : 'border border-line text-ink-muted'}`}>{on ? 'Dipilih' : 'Pilih'}</span>
    </button>
  );
}

function Input({ label, value, onChange, hint, ...rest }: { label: string; value: string; onChange: (v: string) => void; hint?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.16em] text-ink-muted">{label}</span>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} maxLength={rest.type === 'tel' ? 20 : 100}
        className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] outline-none transition focus:border-gold" />
      {hint && <span className="mt-1 block text-[12px] text-red-700">{hint}</span>}
    </label>
  );
}

function Summary({ cabang, items, who, date, time, total, onEdit, hasStylist }: {
  cabang: string; items: { name: string; price: number; from: boolean }[]; who: string; date: string; time: string;
  total: { duration: number; price: number; from: boolean }; onEdit?: (s: StepId) => void; hasStylist?: boolean;
}) {
  const Row = ({ k, v, s }: { k: string; v: React.ReactNode; s: StepId }) => (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">{k}</p>
        <div className="mt-0.5 text-[14px] text-ink">{v || <span className="text-ink-faint">—</span>}</div>
      </div>
      {onEdit && v && <button type="button" onClick={() => onEdit(s)} className="shrink-0 text-[12px] text-gold-deep hover:underline">Ubah</button>}
    </div>
  );
  return (
    <div>
      <Row k="Cabang" v={cabang} s="cabang" />
      <Row k="Layanan" s="layanan" v={items.length ? (
        <ul className="grid gap-1">{items.map((i) => (
          <li key={i.name} className="flex justify-between gap-3"><span>{i.name}</span><span className="text-ink-muted">{rupiah(i.price)}</span></li>
        ))}</ul>
      ) : ''} />
      {(hasStylist ?? true) && <Row k="Stylist" v={who} s="stylist" />}
      <Row k="Jadwal" v={date && time ? `${tanggalPanjang(date)}, ${time} WIB` : ''} s="jadwal" />
      {items.length > 0 && (
        <div className="mt-3 flex items-end justify-between">
          <p className="text-[12px] text-ink-muted">Estimasi · {durasi(total.duration)}</p>
          <p className="font-serif text-2xl text-ink">{total.from && <span className="mr-1 text-[12px] font-sans text-ink-faint">mulai</span>}{rupiah(total.price)}</p>
        </div>
      )}
    </div>
  );
}
