/**
 * אורז את כל האתר לקובץ HTML יחיד.
 *
 * למה זה שימושי:
 *   - אפשר לשלוח את האתר בוואטסאפ / מייל ולפתוח אותו בלחיצה, בלי שרת.
 *   - אפשר להעלות אותו לכל אחסון סטטי כקובץ אחד.
 *   - נוח להדגמות מכירה בלי חיבור לאינטרנט.
 *
 * הרצה:
 *   node tools/build-single-file.mjs            → dist/noa-studio.html
 *   node tools/build-single-file.mjs --embed    → גרסה לעטיפה חיצונית (בלי תגיות html/head/body)
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EMBED = process.argv.includes('--embed');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const dataUri = (p, mime) => `data:${mime};base64,${readFileSync(join(ROOT, p)).toString('base64')}`;

/* ------------------------------------------------------- 1. גופנים ו-CSS */

let css = read('assets/css/fonts.css') + '\n' + read('assets/css/styles.css');

// הטמעת קבצי הגופן כ-data URI
css = css.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, file) =>
  `url('${dataUri(`assets/fonts/${file}`, 'font/woff2')}')`);

/* ------------------------------------------------- 2. JS – איחוד המודולים */

const data = read('assets/js/data.js').replace(/^export /gm, '');
const app = read('assets/js/app.js')
  .replace(/import\s*\{[\s\S]*?\}\s*from\s*'\.\/data\.js';/, '/* data.js inlined */');

/* --------------------------------------------- 3. תמונות – הטמעה כ-data URI */

const IMG_DIRS = ['assets/img/works', 'assets/img/site'];
const MIME = { '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const assets = {};
for (const dir of IMG_DIRS) {
  for (const file of readdirSync(join(ROOT, dir))) {
    const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
    if (MIME[ext]) assets[`${dir}/${file}`] = dataUri(`${dir}/${file}`, MIME[ext]);
  }
}

/** מחליף נתיבים סטטיים בקוד/HTML */
const inlineStatic = (src) =>
  src.replace(/(["'])(assets\/img\/[^"']+\.(?:svg|jpe?g|png|webp))\1/g, (m, q, path) =>
    assets[path] ? `${q}${assets[path]}${q}` : m);

/** עוטף נתיבים דינמיים (template literals) בפונקציית resolve בזמן ריצה */
const wrapDynamic = (src) =>
  src.replace(/`(assets\/img\/[^`]*)`/g, (_, inner) => `__asset(\`${inner}\`)`);

/* ב-HTML מטמיעים כל תמונה פעם אחת בלבד; מופעים חוזרים מקבלים data-asset
   ומקבלים את ה-src מהמפה בזמן טעינה — כך הקובץ לא מכיל אותה תמונה פעמיים. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const seen = new Set();
let html = read('index.html').replace(
  /src="(assets\/img\/[^"]+\.(?:svg|jpe?g|png|webp))"/g,
  (m, path) => {
    if (!assets[path]) return m;
    if (seen.has(path)) return `src="${PIXEL}" data-asset="${path}"`;
    seen.add(path);
    return `src="${assets[path]}"`;
  }
);

const assetMap = `const __ASSETS = ${JSON.stringify(assets)};
const __asset = (p) => __ASSETS[p] || p;
document.querySelectorAll('[data-asset]').forEach((el) => { el.src = __asset(el.dataset.asset); });\n`;

const wrapStatic = (src) =>
  src.replace(/(["'])(assets\/img\/[^"']+\.(?:svg|jpe?g|png|webp))\1/g,
    (m, q, path) => (assets[path] ? `__asset(${q}${path}${q})` : m));

const bundledJs = assetMap + wrapDynamic(wrapStatic(`${data}\n\n${app}`));

/* ------------------------------------------------------- 4. הרכבת הקובץ */

const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));

// הסרת הקישורים לקבצים חיצוניים – הכול כבר בפנים
const cleanHead = head
  .replace(/<link rel="preload"[^>]*>/g, '')
  .replace(/<link rel="stylesheet"[^>]*>/g, '')
  .trim();

const cleanBody = body
  .replace(/<script type="module"[^>]*><\/script>/g, '')
  .trim();

const bundle = `<style>\n${css}\n</style>\n<script type="module">\n${bundledJs}\n</script>`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });

if (EMBED) {
  // גרסה שמיועדת להיטמע בתוך עמוד חיצוני שכבר מספק html/head/body
  // בגרסת ההטמעה מספיק שם המותג – ההסבר נמסר בנפרד ע"י העמוד המארח
  const title = ((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'נועה — סטודיו ציפורניים').split('|')[0].trim();
  const out = `<title>${title}</title>
${cleanHead.replace(/<title>[\s\S]*?<\/title>/, '')}
${bundle}
<div dir="rtl" lang="he" class="site-root">
${cleanBody}
</div>
<style>body { direction: rtl; }</style>
`;
  writeFileSync(join(ROOT, 'dist/noa-studio.embed.html'), out);
  console.log('dist/noa-studio.embed.html', (out.length / 1024 | 0) + 'KB');
} else {
  const out = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
${cleanHead}
${bundle}
</head>
<body>
${cleanBody}
</body>
</html>
`;
  writeFileSync(join(ROOT, 'dist/noa-studio.html'), out);
  console.log('dist/noa-studio.html', (out.length / 1024 | 0) + 'KB');
}
