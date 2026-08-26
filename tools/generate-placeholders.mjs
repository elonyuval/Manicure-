/**
 * מחולל תמונות Placeholder לאתר הדמו.
 *
 * מייצר קבצי SVG קלים (כמה KB כל אחד) שמדמים צילומי ציפורניים,
 * כדי שהאתר ייראה שלם גם לפני שיש צילומים אמיתיים.
 *
 * החלפה לתמונות אמיתיות:
 *   1. שמרו את הצילומים בתיקייה assets/img/works/ באותם שמות קבצים (או בכל שם).
 *   2. עדכנו את שדה `img` של העבודה בקובץ assets/js/data.js.
 *   אין צורך להריץ את הסקריפט הזה שוב.
 *
 * הרצה: node tools/generate-placeholders.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKS_DIR = join(ROOT, 'assets/img/works');
const SITE_DIR = join(ROOT, 'assets/img/site');

mkdirSync(WORKS_DIR, { recursive: true });
mkdirSync(SITE_DIR, { recursive: true });

/* ---------------------------------------------------------------- helpers */

const rnd = (seed) => {
  // מחולל אקראי דטרמיניסטי – כדי שהתמונות יישארו זהות בין הרצות
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

/** מסלול SVG של ציפורן בודדת לפי צורה. הציפורן "צומחת" כלפי מעלה מ-(0,0). */
function nailPath(shape, w, len) {
  const hw = w / 2;
  switch (shape) {
    case 'square':
      return `M${-hw},0 L${-hw},${-len + 10} Q${-hw},${-len} ${-hw + 10},${-len} L${hw - 10},${-len} Q${hw},${-len} ${hw},${-len + 10} L${hw},0 Z`;
    case 'coffin':
      return `M${-hw},0 C${-hw},${-len * 0.55} ${-hw * 0.78},${-len * 0.8} ${-hw * 0.62},${-len + 8} Q${-hw * 0.62},${-len} ${-hw * 0.5},${-len} L${hw * 0.5},${-len} Q${hw * 0.62},${-len} ${hw * 0.62},${-len + 8} C${hw * 0.78},${-len * 0.8} ${hw},${-len * 0.55} ${hw},0 Z`;
    case 'round':
      return `M${-hw},0 L${-hw},${-len * 0.6} Q${-hw},${-len} 0,${-len} Q${hw},${-len} ${hw},${-len * 0.6} L${hw},0 Z`;
    case 'almond':
    default:
      return `M${-hw},0 C${-hw},${-len * 0.5} ${-hw * 0.72},${-len * 0.86} ${-6},${-len + 4} Q0,${-len} 6,${-len + 4} C${hw * 0.72},${-len * 0.86} ${hw},${-len * 0.5} ${hw},0 Z`;
  }
}

const LENGTH_FACTOR = { short: 0.72, medium: 1, long: 1.34 };

/** גווני לק – הצבע שעל הציפורן */
const POLISH = {
  nude: { nail: ['#EBD5C6', '#D6B49E'], accent: '#C9A48C', light: true },
  milky: { nail: ['#FDF8F4', '#F0E4DA'], accent: '#E3D2C2', light: true },
  chrome: { nail: ['#E4DFE2', '#A99CA4'], accent: '#FFFFFF', light: true },
  mocha: { nail: ['#B58D75', '#8A6047'], accent: '#F0E2D5', light: false },
  cherry: { nail: ['#A32B34', '#67141F'], accent: '#F3DCD8', light: false },
  espresso: { nail: ['#4A342C', '#291A15'], accent: '#E8D8C3', light: false },
  sky: { nail: ['#B9CFD8', '#8FAFBC'], accent: '#FFFFFF', light: true },
  sage: { nail: ['#BDC7AE', '#98A487'], accent: '#F4F6EE', light: true },
  lilac: { nail: ['#C6B8D5', '#A08FB8'], accent: '#F6F1FA', light: true },
  butter: { nail: ['#F2DEA5', '#DCC077'], accent: '#FFFBF0', light: true },
};

/** רקעים אדיטוריאליים – כהים ללקים בהירים, בהירים ללקים כהים */
const BACKDROPS_DARK = [
  ['#B79781', '#8A6A55'],
  ['#A89283', '#6E5749'],
  ['#7E6153', '#48342B'],
  ['#B0968E', '#7C5F58'],
];
const BACKDROPS_LIGHT = [
  ['#F1E5DA', '#DAC5B3'],
  ['#EFE7E0', '#D3C2B4'],
  ['#F4EBE2', '#E0CBB8'],
  ['#EDE6DE', '#CFBEB0'],
];

/**
 * יוצר קומפוזיציה של יד עם ארבע ציפורניים.
 * style: french | chrome | art | glitter | plain | ombre | tips
 */
function handComposition({ w, h, palette, shape, length, style, seed, zoom = 1 }) {
  const polish = POLISH[palette] || POLISH.nude;
  const r = rnd(seed);
  const backs = polish.light ? BACKDROPS_DARK : BACKDROPS_LIGHT;
  const p = { ...polish, bg: backs[seed % backs.length] };
  const cx = w / 2;
  const baseY = h * (zoom < 1 ? 0.72 : 0.66);
  const nailW = w * 0.175 * zoom;
  const nailLen = w * 0.32 * LENGTH_FACTOR[length] * zoom;
  const fingerW = nailW * 1.16;

  // ארבע אצבעות בפריסת מניפה עדינה
  const fingers = [
    { dx: -1.62, dy: 0.1, rot: -11, scale: 0.9 },
    { dx: -0.54, dy: -0.05, rot: -4, scale: 1 },
    { dx: 0.54, dy: -0.01, rot: 4, scale: 0.98 },
    { dx: 1.62, dy: 0.14, rot: 11, scale: 0.88 },
  ];

  const defs = [];
  const body = [];

  defs.push(`<linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="skin" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#D9AF92"/><stop offset="0.42" stop-color="#EFCBAE"/><stop offset="1" stop-color="#C4977A"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="nail" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="${p.nail[0]}"/><stop offset="1" stop-color="${p.nail[1]}"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.3"/>
    </linearGradient>`);
  defs.push(`<radialGradient id="glow" cx="0.32" cy="0.22" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`);
  defs.push(`<filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${w * 0.03}"/></filter>`);
  defs.push(`<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.bg[1]}" stop-opacity="0"/>
      <stop offset="0.55" stop-color="${p.bg[1]}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${p.bg[1]}" stop-opacity="0.96"/>
    </linearGradient>`);
  defs.push(`<filter id="chromeblur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${w * 0.008}"/></filter>`);
  defs.push(`<filter id="drop" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="${w * 0.008}" stdDeviation="${w * 0.014}" flood-color="#2E1F18" flood-opacity="0.42"/></filter>`);

  body.push(`<rect width="${w}" height="${h}" fill="url(#bg)"/>`);
  body.push(`<circle cx="${w * (0.22 + r() * 0.1)}" cy="${h * 0.2}" r="${w * 0.32}" fill="#ffffff" opacity="0.22" filter="url(#soft)"/>`);
  body.push(`<circle cx="${w * 0.84}" cy="${h * (0.6 + r() * 0.1)}" r="${w * 0.26}" fill="${p.accent}" opacity="0.18" filter="url(#soft)"/>`);
  body.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);


  for (const f of fingers) {
    const x = cx + f.dx * fingerW * 1.28;
    const y = baseY + f.dy * h * 0.06;
    const s = f.scale;
    const fw = fingerW * s;
    const nl = nailLen * s;
    const nw = nailW * s;

    const g = [];
    // אצבע
    g.push(`<path d="M${-fw / 2},${h * 0.3} L${-fw / 2},${-nl * 0.1} Q${-fw / 2},${-nl * 0.42} 0,${-nl * 0.42} Q${fw / 2},${-nl * 0.42} ${fw / 2},${-nl * 0.1} L${fw / 2},${h * 0.3} Z" fill="url(#skin)"/>`);
    g.push(`<ellipse cx="${-fw * 0.22}" cy="${-nl * 0.05}" rx="${fw * 0.1}" ry="${nl * 0.5}" fill="#ffffff" opacity="0.22"/>`);
    // ציפורן
    const d = nailPath(shape, nw, nl);
    g.push(`<g filter="url(#drop)"><path d="${d}" fill="url(#nail)"/></g>`);
    g.push(`<ellipse cx="0" cy="${nl * 0.03}" rx="${nw * 0.52}" ry="${nl * 0.05}" fill="#A6725A" opacity="0.28"/>`);

    // סגנון
    if (style === 'french') {
      g.push(`<clipPath id="c${x | 0}"><path d="${d}"/></clipPath>`);
      g.push(`<g clip-path="url(#c${x | 0})"><path d="M${-nw},${-nl * 0.62} Q0,${-nl * 0.36} ${nw},${-nl * 0.62} L${nw},${-nl * 1.1} L${-nw},${-nl * 1.1} Z" fill="#FFFDFB" opacity="0.96"/></g>`);
    } else if (style === 'tips') {
      g.push(`<clipPath id="t${x | 0}"><path d="${d}"/></clipPath>`);
      g.push(`<g clip-path="url(#t${x | 0})"><path d="M${-nw},${-nl * 0.58} Q0,${-nl * 0.3} ${nw},${-nl * 0.58} L${nw},${-nl * 1.1} L${-nw},${-nl * 1.1} Z" fill="${p.accent}" opacity="0.98"/></g>`);
    } else if (style === 'chrome') {
      g.push(`<clipPath id="m${x | 0}"><path d="${d}"/></clipPath>`);
      g.push(`<g clip-path="url(#m${x | 0})">
        <rect x="${-nw}" y="${-nl}" width="${nw * 2}" height="${nl}" fill="url(#shine)"/>
        <ellipse cx="${-nw * 0.1}" cy="${-nl * 0.74}" rx="${nw * 0.75}" ry="${nl * 0.16}" fill="#ffffff" opacity="0.85" filter="url(#chromeblur)"/>
        <ellipse cx="${nw * 0.15}" cy="${-nl * 0.3}" rx="${nw * 0.8}" ry="${nl * 0.12}" fill="#F3E9EF" opacity="0.55" filter="url(#chromeblur)"/>
        <ellipse cx="0" cy="${-nl * 0.02}" rx="${nw * 0.9}" ry="${nl * 0.1}" fill="#C9B9C2" opacity="0.5" filter="url(#chromeblur)"/>
      </g>`);
    } else if (style === 'art') {
      g.push(`<clipPath id="a${x | 0}"><path d="${d}"/></clipPath>`);
      const inner = [];
      const kind = Math.floor(r() * 3);
      if (kind === 0) {
        for (let i = 0; i < 3; i++) {
          inner.push(`<circle cx="${(r() - 0.5) * nw * 1.1}" cy="${-nl * (0.25 + i * 0.24)}" r="${nw * 0.11}" fill="#FFFDF8" opacity="0.95"/>`);
        }
      } else if (kind === 1) {
        inner.push(`<path d="M${-nw},${-nl * 0.55} Q0,${-nl * 0.2} ${nw},${-nl * 0.7}" stroke="#FFFDF8" stroke-width="${nw * 0.09}" fill="none" opacity="0.95"/>`);
        inner.push(`<path d="M${-nw},${-nl * 0.78} Q0,${-nl * 0.45} ${nw},${-nl * 0.92}" stroke="${p.accent}" stroke-width="${nw * 0.07}" fill="none" opacity="0.9"/>`);
      } else {
        inner.push(`<path d="M0,${-nl * 0.32} l${nw * 0.24},${-nl * 0.14} l0,${-nl * 0.2} l${-nw * 0.24},${-nl * 0.14} l${-nw * 0.24},${nl * 0.14} l0,${nl * 0.2} Z" fill="#FFFDF8" opacity="0.9"/>`);
      }
      g.push(`<g clip-path="url(#a${x | 0})">${inner.join('')}</g>`);
    } else if (style === 'glitter') {
      g.push(`<clipPath id="g${x | 0}"><path d="${d}"/></clipPath>`);
      const specks = [];
      for (let i = 0; i < 26; i++) {
        specks.push(`<circle cx="${(r() - 0.5) * nw * 1.6}" cy="${-nl * r()}" r="${nw * 0.035 + r() * nw * 0.03}" fill="#FFF7E8" opacity="${0.35 + r() * 0.5}"/>`);
      }
      g.push(`<g clip-path="url(#g${x | 0})">${specks.join('')}</g>`);
    } else if (style === 'ombre') {
      g.push(`<clipPath id="o${x | 0}"><path d="${d}"/></clipPath>`);
      g.push(`<g clip-path="url(#o${x | 0})"><rect x="${-nw}" y="${-nl}" width="${nw * 2}" height="${nl}" fill="#FFFDFB" opacity="0.75" style="mask:none"/></g>`);
      g.push(`<g clip-path="url(#o${x | 0})"><path d="M${-nw},0 L${nw},0 L${nw},${-nl} L${-nw},${-nl} Z" fill="url(#nail)" opacity="0.85"/></g>`);
      g.push(`<g clip-path="url(#o${x | 0})"><ellipse cx="0" cy="${-nl}" rx="${nw}" ry="${nl * 0.55}" fill="#FFFDFB" opacity="0.85"/></g>`);
    }

    // ברק עדין על הציפורן
    g.push(`<clipPath id="s${x | 0}"><path d="${d}"/></clipPath>`);
    g.push(`<g clip-path="url(#s${x | 0})"><ellipse cx="${-nw * 0.3}" cy="${-nl * 0.62}" rx="${nw * 0.22}" ry="${nl * 0.3}" fill="#ffffff" opacity="0.5"/></g>`);

    body.push(`<g transform="translate(${x} ${y}) rotate(${f.rot})">${g.join('')}</g>`);
  }

  body.push(`<rect x="0" y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="url(#fade)"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>${defs.join('')}</defs>
  ${body.join('\n  ')}
</svg>`;
}

/* --------------------------------------------------------------- the works */

const WORKS = [
  ['w01', 'milky', 'almond', 'medium', 'french'],
  ['w02', 'nude', 'square', 'short', 'plain'],
  ['w03', 'chrome', 'almond', 'long', 'chrome'],
  ['w04', 'cherry', 'coffin', 'long', 'plain'],
  ['w05', 'milky', 'round', 'short', 'plain'],
  ['w06', 'mocha', 'almond', 'medium', 'ombre'],
  ['w07', 'espresso', 'square', 'medium', 'plain'],
  ['w08', 'sky', 'almond', 'medium', 'art'],
  ['w09', 'nude', 'coffin', 'long', 'french'],
  ['w10', 'butter', 'square', 'short', 'art'],
  ['w11', 'chrome', 'coffin', 'long', 'chrome'],
  ['w12', 'lilac', 'almond', 'medium', 'glitter'],
  ['w13', 'milky', 'almond', 'short', 'ombre'],
  ['w14', 'sage', 'round', 'short', 'plain'],
  ['w15', 'nude', 'almond', 'long', 'tips'],
  ['w16', 'espresso', 'coffin', 'long', 'chrome'],
  ['w17', 'milky', 'square', 'medium', 'french'],
  ['w18', 'cherry', 'almond', 'medium', 'art'],
  ['w19', 'mocha', 'square', 'short', 'plain'],
  ['w20', 'sky', 'coffin', 'long', 'glitter'],
  ['w21', 'butter', 'almond', 'medium', 'art'],
  ['w22', 'nude', 'round', 'medium', 'french'],
  ['w23', 'chrome', 'square', 'medium', 'chrome'],
  ['w24', 'lilac', 'coffin', 'long', 'art'],
];

let seed = 7;
for (const [id, palette, shape, length, style] of WORKS) {
  const svg = handComposition({ w: 900, h: 1200, palette, shape, length, style, seed: (seed += 13) });
  writeFileSync(join(WORKS_DIR, `${id}.svg`), svg);
}

/* ------------------------------------------------------------- site images */

writeFileSync(
  join(SITE_DIR, 'hero.svg'),
  handComposition({ w: 1200, h: 1500, palette: 'milky', shape: 'almond', length: 'medium', style: 'french', seed: 991, zoom: 0.62 })
);

writeFileSync(
  join(SITE_DIR, 'hero-detail.svg'),
  handComposition({ w: 900, h: 900, palette: 'chrome', shape: 'almond', length: 'long', style: 'chrome', seed: 445, zoom: 0.8 })
);

// דיוקן Placeholder של האמנית – להחליף בצילום אמיתי
writeFileSync(
  join(SITE_DIR, 'artist.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1150" width="900" height="1150" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#F3EAE2"/><stop offset="1" stop-color="#DFCCBD"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5A4136"/><stop offset="1" stop-color="#3A2B25"/>
    </linearGradient>
    <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F0DBC9"/><stop offset="1" stop-color="#DFC0A8"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.35" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="900" height="1150" fill="url(#bg)"/>
  <circle cx="270" cy="250" r="230" fill="#ffffff" opacity="0.5" filter="url(#b1)"/>
  <rect width="900" height="1150" fill="url(#vig)"/>
  <path d="M180 1150 C200 880 320 790 450 790 C580 790 700 880 720 1150 Z" fill="url(#body)"/>
  <path d="M395 800 h110 v-90 h-110 z" fill="#E7C7B0"/>
  <ellipse cx="450" cy="560" rx="150" ry="185" fill="url(#skin)"/>
  <path d="M300 545 C300 380 600 380 600 545 C600 470 560 405 450 405 C340 405 300 470 300 545 Z" fill="url(#body)"/>
  <path d="M296 520 C250 640 268 790 300 850 C300 700 300 610 320 560 Z" fill="url(#body)"/>
  <path d="M604 520 C650 640 632 790 600 850 C600 700 600 610 580 560 Z" fill="url(#body)"/>
  <ellipse cx="450" cy="1010" rx="300" ry="70" fill="#2E1F18" opacity="0.10"/>
</svg>`
);

// אווירת סטודיו – לפיד האינסטגרם
const AMBIENCE = [
  ['studio-1', '#F4EDE6', '#E0CDBD', 'STUDIO'],
  ['studio-2', '#EFE7E2', '#D6C6BC', 'DETAILS'],
  ['studio-3', '#F7F2EA', '#E8D8C3', 'CARE'],
];
for (const [name, c1, c2, label] of AMBIENCE) {
  writeFileSync(
    join(SITE_DIR, `${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="46"/></filter>
  </defs>
  <rect width="800" height="800" fill="url(#g)"/>
  <circle cx="250" cy="230" r="190" fill="#ffffff" opacity="0.55" filter="url(#b)"/>
  <circle cx="600" cy="600" r="150" fill="#C9A48C" opacity="0.35" filter="url(#b)"/>
  <text x="400" y="415" text-anchor="middle" font-family="Georgia, serif" font-size="58" letter-spacing="14" fill="#3A2B25" opacity="0.5">${label}</text>
</svg>`
  );
}

// לוגו / מונוגרמה
writeFileSync(
  join(SITE_DIR, 'og-cover.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FAF6F1"/><stop offset="1" stop-color="#E5D2C2"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="82" letter-spacing="10" fill="#3A2B25">NOA — NAIL ATELIER</text>
  <text x="600" y="372" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="6" fill="#8C6552">Your nails, your signature.</text>
  <text x="600" y="452" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#5A4136">מניקור מדויק ועיצובים בהתאמה אישית · תל אביב</text>
</svg>`
);

console.log(`נוצרו ${WORKS.length} תמונות עבודות + תמונות אתר.`);
