/**
 * כל תוכן הדמו של האתר מרוכז כאן.
 * ------------------------------------------------------------------
 * להחלפה לתוכן אמיתי: ערכו את האובייקטים בקובץ הזה בלבד.
 * שמות עסק, טלפון, כתובת ורשתות – ב-STUDIO.
 * תמונות עבודות – בשדה img של כל עבודה.
 */

export const STUDIO = {
  name: 'נועה — סטודיו ציפורניים',
  short: 'נועה',
  sub: 'סטודיו ציפורניים',
  artist: 'נועה בן־חיים',
  tagline: 'הציפורניים שלך, החתימה שלך.',
  phone: '052-555-1234',
  phoneIntl: '972525551234',
  email: 'hello@noa-studio.co.il',
  instagram: '@noa.nail.studio',
  instagramUrl: 'https://instagram.com/',
  address: 'אבן גבירול 71, תל אביב',
  addressLine2: 'קומה 2, דלת 6 · כניסה מהחצר',
  parking: 'חניון גן העיר במרחק 30 מטר, וכן חניית תושבים כחול־לבן ברחוב.',
  mapsUrl: 'https://maps.google.com/?q=אבן+גבירול+71+תל+אביב',
  rating: '4.9',
  reviewsCount: '312',
  hours: [
    { day: 'ראשון — חמישי', time: '09:00 — 19:00' },
    { day: 'שישי', time: '09:00 — 14:00' },
    { day: 'שבת', time: 'סגור' },
  ],
};

export const WHATSAPP = (msg) =>
  `https://wa.me/${STUDIO.phoneIntl}?text=${encodeURIComponent(msg)}`;

/* ------------------------------------------------------------------ שירותים */

export const SERVICES = [
  {
    id: 'gel',
    name: "לק ג'ל",
    desc: 'מניקור יבש מלא, עיצוב צורה ולק ג’ל בגוון שתבחרי. מחזיק 3–4 שבועות בלי שריטות.',
    price: 160,
    duration: 75,
    popular: true,
  },
  {
    id: 'manicure',
    name: 'מניקור נקי',
    desc: 'טיפול קצוות מוקפד, טיפוח עור ותוצאה נקייה ומבריקה — בלי צבע, רק ציפורניים מושלמות.',
    price: 95,
    duration: 45,
  },
  {
    id: 'build',
    name: "בנייה בג'ל",
    desc: 'הארכה ובנייה בג’ל חזק, בצורה ובאורך שבחרת. בסיס אידיאלי לעיצובים מורכבים.',
    price: 290,
    duration: 150,
    popular: true,
  },
  {
    id: 'fill',
    name: 'מילוי',
    desc: 'חידוש הבנייה הקיימת כל 3–4 שבועות: איזון מבנה, עיצוב מחדש וגוון חדש.',
    price: 210,
    duration: 120,
  },
  {
    id: 'anatomic',
    name: 'מבנה אנטומי',
    desc: 'חיזוק ותיקון של ציפורן טבעית עם קשת מדויקת — לציפורניים דקות או שנשברות.',
    price: 240,
    duration: 120,
  },
  {
    id: 'art',
    name: 'ציורים ועיצובים',
    desc: 'ציורים, אפקט מראה, נצנצים ואבנים. נבנה יחד את העיצוב לפי השראה שתביאי — או שנמצא אותה כאן באתר.',
    price: 25,
    priceNote: 'לציפורן',
    duration: 30,
  },
  {
    id: 'repair',
    name: 'תיקון ציפורן',
    desc: 'נשברה ציפורן? מגיעים לתיקון נקודתי מהיר, בלי לפרק את כל העבודה.',
    price: 35,
    duration: 20,
  },
];

/* -------------------------------------------------------------------- פילטרים */

export const FILTERS = [
  { id: 'all', label: 'הכול' },
  { id: 'french', label: 'צרפתי' },
  { id: 'minimal', label: 'נקי ומינימלי' },
  { id: 'chrome', label: 'מראה מטאלית' },
  { id: 'art', label: 'ציורים' },
  { id: 'color', label: 'צבעוני' },
  { id: 'short', label: 'קצר' },
  { id: 'long', label: 'ארוך' },
  { id: 'build', label: 'בנייה' },
];

/* --------------------------------------------------------------------- עבודות */

const L = { short: 'קצר', medium: 'בינוני', long: 'ארוך' };

/** vibe – משמש למנוע ההתאמה של "מצאי את העיצוב שלך" */
export const WORKS = [
  { id: 'w01', title: 'צרפתי חלבי', shape: 'שקד', length: 'medium', style: 'קו צרפתי עדין על בסיס חלבי', tags: ['french', 'minimal'], vibe: ['french', 'clean'], service: 'gel' },
  { id: 'w02', title: 'טבעי נקי', shape: 'מרובע', length: 'short', style: 'גוון עור חלק בגימור משיי', tags: ['minimal', 'short'], vibe: ['clean'], service: 'gel' },
  { id: 'w03', title: 'מראה מלאה', shape: 'שקד', length: 'long', style: 'אפקט מראה מטאלי מלא', tags: ['chrome', 'long', 'build'], vibe: ['chrome', 'glam'], service: 'build' },
  { id: 'w04', title: 'דובדבן עמוק', shape: 'בלרינה', length: 'long', style: 'אדום דובדבן רווי', tags: ['color', 'long', 'build'], vibe: ['glam', 'colorful'], service: 'build' },
  { id: 'w05', title: 'אמבט חלב', shape: 'עגול', length: 'short', style: 'לבן שקוף וטבעי', tags: ['minimal', 'short'], vibe: ['clean'], service: 'manicure' },
  { id: 'w06', title: 'מעבר חום־קרם', shape: 'שקד', length: 'medium', style: 'מעבר גוונים רך מחום לקרם', tags: ['color', 'minimal'], vibe: ['clean', 'colorful'], service: 'gel' },
  { id: 'w07', title: 'חום קפה', shape: 'מרובע', length: 'medium', style: 'חום קפה עשיר ואטום', tags: ['color'], vibe: ['glam', 'colorful'], service: 'gel' },
  { id: 'w08', title: 'קווים על תכלת', shape: 'שקד', length: 'medium', style: 'ציורי קו דקים על תכלת', tags: ['art', 'color'], vibe: ['art', 'colorful'], service: 'art' },
  { id: 'w09', title: 'צרפתי בגוון עור', shape: 'בלרינה', length: 'long', style: 'קו צרפתי קלאסי על בסיס בגוון עור', tags: ['french', 'long', 'build'], vibe: ['french', 'glam'], service: 'build' },
  { id: 'w10', title: 'נקודות חמאה', shape: 'מרובע', length: 'short', style: 'נקודות לבנות על צהוב רך', tags: ['art', 'color', 'short'], vibe: ['art', 'colorful'], service: 'art' },
  { id: 'w11', title: 'מראה על בלרינה', shape: 'בלרינה', length: 'long', style: 'מראה קרה על בנייה', tags: ['chrome', 'long', 'build'], vibe: ['chrome', 'glam'], service: 'build' },
  { id: 'w12', title: 'לילך נוצץ', shape: 'שקד', length: 'medium', style: 'לילך עם נצנץ עדין', tags: ['color'], vibe: ['glam', 'colorful'], service: 'gel' },
  { id: 'w13', title: 'מעבר חלבי', shape: 'שקד', length: 'short', style: 'מעבר רך מלבן לשקוף', tags: ['french', 'minimal', 'short'], vibe: ['french', 'clean'], service: 'gel' },
  { id: 'w14', title: 'מרווה עגול', shape: 'עגול', length: 'short', style: 'ירוק מרווה מעושן', tags: ['color', 'minimal', 'short'], vibe: ['clean', 'colorful'], service: 'gel' },
  { id: 'w15', title: 'קצוות בגוון עור', shape: 'שקד', length: 'long', style: 'קצוות בגוון עור על בנייה', tags: ['french', 'long', 'build'], vibe: ['french', 'clean'], service: 'build' },
  { id: 'w16', title: 'מטאלי כהה', shape: 'בלרינה', length: 'long', style: 'מראה מטאלית בגוון כהה', tags: ['chrome', 'long', 'build'], vibe: ['chrome', 'glam'], service: 'build' },
  { id: 'w17', title: 'קו צרפתי דק', shape: 'מרובע', length: 'medium', style: 'קו צרפתי דק במיוחד', tags: ['french', 'minimal'], vibe: ['french', 'clean'], service: 'gel' },
  { id: 'w18', title: 'ציור על דובדבן', shape: 'שקד', length: 'medium', style: 'ציור לבן על בסיס אדום', tags: ['art', 'color'], vibe: ['art', 'glam'], service: 'art' },
  { id: 'w19', title: 'חום רך קצר', shape: 'מרובע', length: 'short', style: 'חום רך ואורך יומיומי', tags: ['color', 'short', 'minimal'], vibe: ['clean', 'colorful'], service: 'gel' },
  { id: 'w20', title: 'קרח נוצץ', shape: 'בלרינה', length: 'long', style: 'תכלת קרח עם נצנץ', tags: ['color', 'long', 'build'], vibe: ['glam', 'colorful'], service: 'build' },
  { id: 'w21', title: 'ציור שמשי', shape: 'שקד', length: 'medium', style: 'ציור גיאומטרי בגוון חם', tags: ['art', 'color'], vibe: ['art', 'colorful'], service: 'art' },
  { id: 'w22', title: 'צרפתי רך', shape: 'עגול', length: 'medium', style: 'קו צרפתי רחב בקצה עגול', tags: ['french', 'minimal'], vibe: ['french', 'clean'], service: 'gel' },
  { id: 'w23', title: 'ברק פנינה', shape: 'מרובע', length: 'medium', style: 'ברק פנינה עדין', tags: ['chrome'], vibe: ['chrome', 'clean'], service: 'gel' },
  { id: 'w24', title: 'ציור על לילך', shape: 'בלרינה', length: 'long', style: 'ציור עדין על בסיס לילך', tags: ['art', 'color', 'long', 'build'], vibe: ['art', 'glam'], service: 'build' },
].map((w) => ({
  ...w,
  img: `assets/img/works/${w.id}.svg`,
  lengthHe: L[w.length],
  alt: `${w.title} — ${w.style}, צורה ${w.shape}, אורך ${L[w.length]} · ${STUDIO.name}`,
}));

/* ---------------------------------------------------------------- שאלון התאמה */

export const QUIZ = [
  {
    id: 'vibe',
    q: 'איזה סגנון את אוהבת?',
    options: [
      { v: 'clean', label: 'נקי וטבעי', note: 'יומיומי, בלי לצעוק' },
      { v: 'french', label: 'צרפתי', note: 'קלאסי שלא נגמר' },
      { v: 'chrome', label: 'מראה מטאלית', note: 'ברק של מתכת' },
      { v: 'glam', label: 'נוצץ ובולט', note: 'לאירועים ולערב' },
      { v: 'colorful', label: 'צבעוני', note: 'צבע שמרים את היום' },
      { v: 'art', label: 'ציורים', note: 'פרטים ועיצוב אישי' },
    ],
  },
  {
    id: 'length',
    q: 'איזה אורך מתאים לך?',
    options: [
      { v: 'short', label: 'קצר', note: 'נוח לעבודה ולילדים' },
      { v: 'medium', label: 'בינוני', note: 'האיזון המושלם' },
      { v: 'long', label: 'ארוך', note: 'דרמטי ומעוצב' },
    ],
  },
  {
    id: 'shape',
    q: 'איזו צורה?',
    options: [
      { v: 'שקד', label: 'שקד', note: 'מאריך את האצבע' },
      { v: 'מרובע', label: 'מרובע', note: 'ישר ונקי' },
      { v: 'בלרינה', label: 'בלרינה', note: 'קצה ישר, צדדים מחודדים' },
      { v: 'עגול', label: 'עגול', note: 'רך וטבעי' },
    ],
  },
];

/* ---------------------------------------------------------------------- אמון */

export const VALUES = [
  { t: 'עבודה מדויקת', d: 'קצוות נקיים, קשת מאוזנת ותוצאה שנראית טוב גם מקרוב.' },
  { t: 'חומרים איכותיים', d: 'ג’לים ולקים מיובאים בלבד, וגם חומרים ללא HEMA לפי בקשה.' },
  { t: 'סטריליזציה מלאה', d: 'אוטוקלב, ראשים אישיים וכלים חד־פעמיים לכל לקוחה.' },
  { t: 'התאמה אישית', d: 'בונות יחד צורה, אורך וגוון שמתאימים ליד ולסגנון החיים שלך.' },
  { t: 'יחס אישי', d: 'לקוחה אחת בכל רגע נתון. בלי לחץ ובלי חפיפות.' },
];

export const STATS = [
  { n: '5+', t: 'שנות ניסיון' },
  { n: '1,000+', t: 'לקוחות' },
  { n: '400+', t: 'עיצובים' },
  { n: '4.9★', t: 'דירוג ממוצע' },
];

/* ------------------------------------------------------------------ ביקורות */

export const REVIEWS = [
  { name: 'מיכל', text: 'סוף סוף מצאתי מישהי שבאמת מבינה בדיוק מה אני רוצה. יצאתי עם בדיוק התמונה שהראיתי.', meta: 'לקוחה קבועה, שנתיים' },
  { name: 'שירה', text: 'העבודה נשארה מושלמת גם אחרי ארבעה שבועות, בלי הרמות ובלי שברים.', meta: "בנייה בג'ל" },
  { name: 'ליאור', text: 'הסטודיו נקי ומרגיע, ונועה מסבירה כל שלב. הרגשתי בידיים טובות מהרגע הראשון.', meta: 'מניקור נקי' },
  { name: 'עדי', text: 'קבעתי תור מהאתר באחת בלילה תוך דקה, בלי לחכות לתשובה בוואטסאפ.', meta: "לק ג'ל" },
  { name: 'נטלי', text: 'הציפורניים שלי היו הרוסות אחרי בנייה במקום אחר. תוך שני טיפולים הכול חזר לעצמו.', meta: 'מבנה אנטומי' },
  { name: 'רוני', text: 'באתי עם צילום מסך אחד והיא לקחה אותו רחוק יותר ממה שדמיינתי.', meta: 'ציורים ועיצובים' },
];

/* -------------------------------------------------------------------- שאלות */

export const FAQ = [
  { q: 'איפה את נמצאת?', a: `הסטודיו נמצא ב${STUDIO.address}, ${STUDIO.addressLine2}. הכניסה דיסקרטית ויש שילוט קטן בשם הסטודיו. במפה למטה יש ניווט בלחיצה אחת.` },
  { q: 'איפה אפשר לחנות?', a: STUDIO.parking + ' מומלץ להגיע 5 דקות לפני, כדי שנתחיל בזמן.' },
  { q: 'כמה זמן לוקח טיפול?', a: 'לק ג’ל כ־75 דקות, מניקור כ־45 דקות, בנייה כשעתיים וחצי ומילוי כשעתיים. בקביעת התור באתר מופיע משך הטיפול המדויק לכל שירות.' },
  { q: 'מה קורה אם אני מאחרת?', a: 'איחור של עד 10 דקות בסדר גמור. מעבר לזה ייתכן שנצטרך לקצר את העיצוב או להעביר את התור, כדי לא לפגוע בלקוחה שאחריך.' },
  { q: 'איך מבטלים תור?', a: 'ביטול עד 24 שעות מראש — בלי עלות, דרך הוואטסאפ. ביטול מאוחר יותר או אי־הגעה מחויבים ב־50% מהטיפול.' },
  { q: 'את עושה גם בנייה?', a: 'בהחלט. בנייה בג’ל בכל הצורות והאורכים, וגם מבנה אנטומי לחיזוק ציפורן טבעית. אם את לא בטוחה מה מתאים לך — נתייעץ יחד בתחילת התור.' },
  { q: 'מה קורה אם נשברה לי ציפורן?', a: 'כתבי לי בוואטסאפ ונמצא חלון לתיקון נקודתי, בדרך כלל תוך יום-יומיים. שבירה בשבוע הראשון אחרי הטיפול — על חשבוני.' },
  { q: 'איך להגיע לטיפול?', a: 'עדיף להגיע עם ציפורניים נקיות מלק רגיל, בלי קרם ידיים ביום הטיפול, ועם רעיון או תמונה של מה שאהבת. גם אם אין לך רעיון — יש באתר "מצאי את העיצוב שלך".' },
  { q: 'אילו אמצעי תשלום קיימים?', a: 'מזומן, ביט, פייבוקס, אשראי ותשלומים החל מ־300 ₪. חשבונית נשלחת במייל בסיום.' },
];

/* ------------------------------------------------------------- אינסטגרם דמו */

export const FEED = [
  { img: 'assets/img/works/w03.svg', label: 'מראה מטאלית' },
  { img: 'assets/img/site/studio-1.svg', label: 'הסטודיו' },
  { img: 'assets/img/works/w09.svg', label: 'צרפתי' },
  { img: 'assets/img/works/w18.svg', label: 'ציורים' },
  { img: 'assets/img/site/studio-3.svg', label: 'טיפוח' },
  { img: 'assets/img/works/w12.svg', label: 'נצנץ' },
  { img: 'assets/img/works/w22.svg', label: 'רך ונקי' },
  { img: 'assets/img/site/studio-2.svg', label: 'פרטים' },
];
