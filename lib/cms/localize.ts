import type { Content } from './content';
import { hoursText, type Lang } from '../i18n';

const filled = (s: unknown): s is string => typeof s === 'string' && s.trim() !== '';

// Teks EN menang bila terisi; kosong = teks ID. Berlaku rekursif untuk grup.
function pick<T>(en: unknown, id: T): T {
  if (typeof id === 'string') return (filled(en) ? en : id) as T;
  if (id && typeof id === 'object' && !Array.isArray(id)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(id)) out[k] = pick((en as Record<string, unknown> | undefined)?.[k], v);
    return out as T;
  }
  return id;
}

/**
 * Konten untuk bahasa tertentu. Menu harga TIDAK diubah di sini — nama layanan
 * dipakai sebagai kunci saat booking; terjemahannya hanya di tampilan.
 */
export function localize(c: Content, lang: Lang): Content {
  if (lang === 'id') return c;
  const e = c.en;
  return {
    ...c,
    home: pick(e.home, c.home),
    intro: { ...c.intro, body: filled(e.aboutBody) ? e.aboutBody : c.intro.body },
    about: {
      ...c.about,
      values: c.about.values.map((v, i) => ({ title: pick(e.values?.[i]?.title, v.title), desc: pick(e.values?.[i]?.desc, v.desc) })),
    },
    booking: {
      ...c.booking,
      sub: filled(e.bookingSub) ? e.bookingSub : c.booking.sub,
      successNote: filled(e.successNote) ? e.successNote : c.booking.successNote,
      policies: (e.policies ?? []).some(filled) ? e.policies.filter(filled) : c.booking.policies,
    },
    settings: {
      ...c.settings,
      waGreeting: pick(e.waGreeting, c.settings.waGreeting),
      footerText: pick(e.footerText, c.settings.footerText),
      siteTitle: pick(e.siteTitle, c.settings.siteTitle),
      siteDescription: pick(e.siteDescription, c.settings.siteDescription),
    },
    branches: { ...c.branches, items: c.branches.items.map((b) => ({ ...b, hours: hoursText(b, 'en') })) },
  };
}
