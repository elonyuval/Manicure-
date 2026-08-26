/**
 * NOA — Nail Atelier · לוגיקת האתר
 * ------------------------------------------------------------------
 * מודולים: ניווט · גלריה + מודאל · שירותים · שאלון התאמה ·
 *          קביעת תור · FAQ · אנימציות scroll.
 * ללא ספריות חיצוניות.
 */

import {
  STUDIO, WHATSAPP, SERVICES, FILTERS, WORKS, QUIZ,
  VALUES, STATS, REVIEWS, FAQ, FEED,
} from './data.js';

/* ------------------------------------------------------------- utilities */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const state = {
  filter: 'all',
  shown: 12,
  modalIndex: -1,
  design: null,          // העבודה שנבחרה מהגלריה
  booking: { service: null, date: null, time: null, name: '', phone: '', notes: '' },
  step: 1,
  quiz: { i: 0, answers: {} },
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

function goTo(hash) {
  const target = $(hash);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 78;
  window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------- WhatsApp / חובה */
function initStaticContent() {
  const waMsg = `היי ${STUDIO.artist.split(' ')[0]}, הגעתי דרך האתר ואשמח לקבוע תור 💅`;
  $$('[data-wa]').forEach((a) => { a.href = WHATSAPP(waMsg); });

  $('#hoursList').innerHTML = STUDIO.hours
    .map((h) => `<span class="hours-row"><span>${esc(h.day)}</span><span>${esc(h.time)}</span></span>`)
    .join('');

  $('#year').textContent = new Date().getFullYear();

  $('#valuesList').innerHTML = VALUES
    .map((v) => `<li class="value reveal"><b>${esc(v.t)}</b><span>${esc(v.d)}</span></li>`)
    .join('');

  $('#statsList').innerHTML = STATS
    .map((s) => `<li class="stat"><b>${esc(s.n)}</b><span>${esc(s.t)}</span></li>`)
    .join('');

  $('#reviewsRail').innerHTML = REVIEWS.map((r) => `
    <article class="review reveal">
      <span class="stars" aria-label="חמישה כוכבים">★★★★★</span>
      <p>“${esc(r.text)}”</p>
      <footer><b>${esc(r.name)}</b>${esc(r.meta)}</footer>
    </article>`).join('');

  $('#feedGrid').innerHTML = FEED.map((f) => `
    <a class="feed-item reveal" href="${STUDIO.instagramUrl}" target="_blank" rel="noopener" data-label="${esc(f.label)}">
      <img src="${f.img}" width="800" height="800" loading="lazy" decoding="async"
           alt="פוסט מהאינסטגרם של הסטודיו — ${esc(f.label)}">
    </a>`).join('');
}

/* ---------------------------------------------------------------- ניווט */
function initNav() {
  const header = $('#siteHeader');
  const burger = $('#burger');
  const mobileNav = $('#mobileNav');
  const sticky = $('#stickyBar');

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'פתיחת תפריט' : 'סגירת תפריט');
    mobileNav.hidden = open;
  });
  $$('#mobileNav a').forEach((a) => a.addEventListener('click', closeMenu));

  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 12);
    sticky.classList.toggle('is-visible', y > 520);
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // הדגשת הסעיף הפעיל בתפריט
  const links = $$('.nav a');
  const sections = links
    .map((a) => ({ a, sec: $(a.getAttribute('href')) }))
    .filter((x) => x.sec);
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.remove('is-active'));
      const hit = sections.find((s) => s.sec === e.target);
      if (hit) hit.a.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObs.observe(s.sec));

  // גלילה רכה לכל עוגן פנימי
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;
    if (!$(hash)) return;
    ev.preventDefault();
    closeMenu();
    goTo(hash);
    if (a.hasAttribute('data-book')) resetBookingIfIdle();
  });
}

/* --------------------------------------------------------------- גלריה */
function workCard(w) {
  return `
    <button class="work" type="button" data-work="${w.id}"
            aria-label="פתיחת פרטי העבודה ${esc(w.title)}">
      <img src="${w.img}" width="900" height="1200" loading="lazy" decoding="async" alt="${esc(w.alt)}">
      <span class="work-tag">${esc(w.shape)} · ${esc(w.lengthHe)}</span>
      <span class="work-overlay">
        <span class="work-title">${esc(w.title)}</span>
        <span class="work-meta">${esc(w.style)}</span>
      </span>
    </button>`;
}

function filteredWorks() {
  return state.filter === 'all' ? WORKS : WORKS.filter((w) => w.tags.includes(state.filter));
}

function renderWorks() {
  const grid = $('#worksGrid');
  const list = filteredWorks();
  const visible = list.slice(0, state.shown);

  grid.innerHTML = visible.length
    ? visible.map(workCard).join('')
    : `<p class="gallery-empty">לא נמצאו עבודות בסגנון הזה — אבל אפשר לבקש כל עיצוב בהתאמה אישית.</p>`;

  // אנימציית כניסה מדורגת
  $$('.work', grid).forEach((el, i) => { el.style.animationDelay = `${Math.min(i, 8) * 45}ms`; });

  const label = FILTERS.find((f) => f.id === state.filter)?.label || '';
  $('#filterCount').textContent = state.filter === 'all'
    ? `${list.length} עבודות בגלריה`
    : `${list.length} עבודות בסגנון ${label}`;

  $('#loadMore').hidden = list.length <= state.shown;
  $('#loadMore').textContent = `להצגת עוד ${list.length - state.shown} עבודות`;
}

function initGallery() {
  $('#filters').innerHTML = FILTERS.map((f) => `
    <button class="chip" type="button" data-filter="${f.id}" aria-pressed="${f.id === 'all'}">${esc(f.label)}</button>`
  ).join('');

  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    state.shown = 12;
    $$('#filters .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
    renderWorks();
  });

  $('#loadMore').addEventListener('click', () => {
    state.shown = filteredWorks().length;
    renderWorks();
  });

  $('#worksGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-work]');
    if (!btn) return;
    openModal(btn.dataset.work);
  });

  renderWorks();
}

/* ---------------------------------------------------------------- מודאל */
let lastFocused = null;

function openModal(id) {
  const list = filteredWorks();
  const idx = list.findIndex((w) => w.id === id);
  state.modalIndex = idx >= 0 ? idx : WORKS.findIndex((w) => w.id === id);
  lastFocused = document.activeElement;
  renderModal();
  const modal = $('#workModal');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  $('.modal-close', modal).focus();
}

function closeModal() {
  $('#workModal').hidden = true;
  document.body.classList.remove('no-scroll');
  if (lastFocused) lastFocused.focus();
}

function renderModal() {
  const list = filteredWorks().length ? filteredWorks() : WORKS;
  const w = list[state.modalIndex];
  if (!w) return;
  const svc = SERVICES.find((s) => s.id === w.service);

  $('#modalContent').innerHTML = `
    <div class="modal-img">
      <img src="${w.img}" width="900" height="1200" alt="${esc(w.alt)}">
    </div>
    <div class="modal-body">
      <p class="eyebrow">${esc(FILTERS.find((f) => f.id === w.tags[0])?.label || 'Design')}</p>
      <h3 id="modalTitle">${esc(w.title)}</h3>
      <p class="muted">${esc(w.style)}</p>
      <dl class="modal-specs">
        <div class="spec"><dt>סוג</dt><dd>${esc(svc ? svc.name : 'עיצוב אישי')}</dd></div>
        <div class="spec"><dt>צורה</dt><dd>${esc(w.shape)}</dd></div>
        <div class="spec"><dt>אורך</dt><dd>${esc(w.lengthHe)}</dd></div>
        <div class="spec"><dt>סגנון</dt><dd>${esc(w.tags.map((t) => FILTERS.find((f) => f.id === t)?.label).filter(Boolean)[0] || '—')}</dd></div>
      </dl>
      <div class="modal-actions">
        <button class="btn btn-dark" type="button" data-want="${w.id}">אני רוצה כזה 💅</button>
        <a class="btn btn-outline" data-wa href="#" target="_blank" rel="noopener">שאלה בוואטסאפ</a>
      </div>
      <p class="modal-service">${svc ? `הטיפול המתאים: ${esc(svc.name)} · ${svc.price} ₪${svc.priceNote ? ' ' + esc(svc.priceNote) : ''} · ${svc.duration} דק’` : ''}</p>
    </div>`;

  $$('[data-wa]', $('#modalContent')).forEach((a) => {
    a.href = WHATSAPP(`היי, ראיתי באתר את העיצוב "${w.title}" ויש לי שאלה 🙂`);
  });
}

function initModal() {
  const modal = $('#workModal');

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) closeModal();
    const want = e.target.closest('[data-want]');
    if (want) chooseDesign(want.dataset.want);
  });

  $('#modalNext').addEventListener('click', () => {
    const list = filteredWorks().length ? filteredWorks() : WORKS;
    state.modalIndex = (state.modalIndex + 1) % list.length;
    renderModal();
  });
  $('#modalPrev').addEventListener('click', () => {
    const list = filteredWorks().length ? filteredWorks() : WORKS;
    state.modalIndex = (state.modalIndex - 1 + list.length) % list.length;
    renderModal();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') $('#modalNext').click();
    if (e.key === 'ArrowRight') $('#modalPrev').click();
  });

  // "אני רוצה כזה" גם מתוצאות השאלון
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-want]');
    if (btn && !btn.closest('#workModal')) chooseDesign(btn.dataset.want);
  });
}

/** בחירת עיצוב מהגלריה → מעבר ישיר לקביעת תור עם העיצוב מצורף */
function chooseDesign(id) {
  const w = WORKS.find((x) => x.id === id);
  if (!w) return;
  state.design = w;
  state.booking.service = SERVICES.find((s) => s.id === w.service) || null;
  state.booking.date = null;
  state.booking.time = null;
  state.step = state.booking.service ? 2 : 1;
  closeModal();
  renderPickedDesign();
  renderBooking();
  goTo('#booking');
  toast(`העיצוב "${w.title}" צורף לתור שלך ✨`);
}

/* -------------------------------------------------------------- שירותים */
function initServices() {
  $('#servicesGrid').innerHTML = SERVICES.map((s) => `
    <article class="service reveal">
      ${s.popular ? '<span class="service-flag">הכי מבוקש</span>' : ''}
      <div class="service-top">
        <h3 class="service-name">${esc(s.name)}</h3>
        <span class="service-en">${esc(s.en)}</span>
      </div>
      <p class="service-desc">${esc(s.desc)}</p>
      <div class="service-meta">
        <span class="service-price">${s.price} ₪</span>
        ${s.priceNote ? `<span class="service-price-note">${esc(s.priceNote)}</span>` : ''}
        <span class="service-duration">${s.duration} דקות</span>
      </div>
      <button class="btn btn-outline btn-sm" type="button" data-service="${s.id}">קביעת תור לטיפול</button>
    </article>`).join('');

  $('#servicesGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-service]');
    if (!btn) return;
    state.booking.service = SERVICES.find((s) => s.id === btn.dataset.service);
    state.booking.date = null;
    state.booking.time = null;
    state.step = 2;
    renderBooking();
    goTo('#booking');
  });
}

/* ---------------------------------------------------- שאלון "מצאי את הסט" */
function renderQuiz() {
  const q = QUIZ[state.quiz.i];
  $('#quizBar').style.width = `${((state.quiz.i) / QUIZ.length) * 100 + 33}%`;
  $('#quizStep').textContent = `${state.quiz.i + 1} / ${QUIZ.length}`;
  $('#quizBack').hidden = state.quiz.i === 0;
  $('#quizBody').innerHTML = `
    <h3 class="quiz-q">${esc(q.q)}</h3>
    <div class="quiz-options">
      ${q.options.map((o) => `
        <button class="quiz-opt" type="button" data-q="${q.id}" data-v="${esc(o.v)}">
          <b>${esc(o.label)}</b><span>${esc(o.note)}</span>
        </button>`).join('')}
    </div>`;
}

/** מנוע ההתאמה: ניקוד לפי וייב (משקל 3), אורך (2) וצורה (2) */
function matchWorks({ vibe, length, shape }) {
  return WORKS
    .map((w) => {
      let score = 0;
      if (vibe && w.vibe.includes(vibe)) score += 3;
      if (length && w.length === length) score += 2;
      if (shape && w.shape === shape) score += 2;
      return { w, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .slice(0, 3)
    .map((x) => x.w);
}

function renderQuizResult() {
  const a = state.quiz.answers;
  const matches = matchWorks(a);
  const labelOf = (id, v) => QUIZ.find((q) => q.id === id).options.find((o) => o.v === v)?.label || v;

  $('#quiz').hidden = true;
  const box = $('#quizResult');
  box.hidden = false;
  box.innerHTML = `
    <div class="result-head">
      <h3>נראה שמצאנו את הסט שלך ✨</h3>
      <div class="result-tags">
        <span class="result-tag">${esc(labelOf('vibe', a.vibe))}</span>
        <span class="result-tag">${esc(labelOf('length', a.length))}</span>
        <span class="result-tag">${esc(labelOf('shape', a.shape))}</span>
      </div>
    </div>
    <div class="result-grid">
      ${matches.map((w) => `
        <article class="result-card">
          <img src="${w.img}" width="900" height="1200" loading="lazy" decoding="async" alt="${esc(w.alt)}">
          <div class="result-body">
            <strong>${esc(w.title)}</strong>
            <small>${esc(w.shape)} · ${esc(w.lengthHe)} · ${esc(w.style)}</small>
            <button class="btn btn-dark btn-sm" type="button" data-want="${w.id}">אני רוצה כזה</button>
          </div>
        </article>`).join('')}
    </div>
    <div class="result-actions">
      <button class="btn btn-outline" type="button" id="quizAgain">לענות שוב</button>
      <a class="btn btn-outline" href="#gallery">לגלריה המלאה</a>
    </div>`;

  $('#quizAgain').addEventListener('click', () => {
    state.quiz = { i: 0, answers: {} };
    box.hidden = true;
    $('#quiz').hidden = false;
    renderQuiz();
  });
}

function initQuiz() {
  $('#startQuiz').addEventListener('click', () => {
    $('#finderIntro').hidden = true;
    $('#quiz').hidden = false;
    state.quiz = { i: 0, answers: {} };
    renderQuiz();
  });

  $('#quizBody').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    state.quiz.answers[btn.dataset.q] = btn.dataset.v;
    if (state.quiz.i < QUIZ.length - 1) {
      state.quiz.i += 1;
      renderQuiz();
    } else {
      renderQuizResult();
    }
  });

  $('#quizBack').addEventListener('click', () => {
    if (state.quiz.i > 0) { state.quiz.i -= 1; renderQuiz(); }
  });
}

/* ---------------------------------------------------------- קביעת תור */
const DAY_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MON_HE = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];

function nextDates(count = 14) {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    if (d.getDay() !== 6) out.push(new Date(d)); // שבת סגור
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** תפוסה דמו יציבה: אותו תאריך תמיד מציג את אותן שעות */
function slotsFor(date) {
  const friday = date.getDay() === 5;
  const base = friday
    ? ['09:00', '10:30', '12:00']
    : ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];
  const seed = date.getDate() * 7 + date.getMonth() * 3;
  return base.map((time, i) => ({ time, free: (seed + i * 5) % 7 !== 0 && (seed + i * 3) % 5 !== 0 }));
}

function fmtDate(d) {
  return `יום ${DAY_HE[d.getDay()]}, ${d.getDate()} ב${MON_HE[d.getMonth()]}`;
}

function renderPickedDesign() {
  const box = $('#pickedDesign');
  if (!state.design) { box.hidden = true; box.innerHTML = ''; return; }
  const w = state.design;
  box.hidden = false;
  box.innerHTML = `
    <img src="${w.img}" width="900" height="1200" alt="${esc(w.alt)}">
    <span class="pd-text">
      <span class="pd-label">העיצוב שבחרת</span>
      <strong>${esc(w.title)}</strong>
      <span class="muted" style="font-size:.8rem">${esc(w.shape)} · ${esc(w.lengthHe)}</span>
    </span>
    <button class="link-btn" type="button" id="clearDesign">הסרה</button>`;
  $('#clearDesign').addEventListener('click', () => {
    state.design = null;
    renderPickedDesign();
  });
}

function setSteps() {
  $$('#steps li').forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle('is-active', n === state.step);
    li.classList.toggle('is-done', n < state.step);
  });
  $('#bookBack').hidden = state.step === 1 || state.step === 5;
}

function renderBooking() {
  const body = $('#bookingBody');
  const b = state.booking;
  setSteps();
  $('#bookHint').textContent = '';

  if (state.step === 1) {
    body.innerHTML = `
      <div class="book-step">
        <h3 class="book-title">איזה טיפול נעשה?</h3>
        <div class="opt-list">
          ${SERVICES.map((s) => `
            <button class="opt ${b.service?.id === s.id ? 'is-selected' : ''}" type="button" data-pick-service="${s.id}">
              <span class="opt-main"><b>${esc(s.name)}</b><small>${s.duration} דקות · ${esc(s.en)}</small></span>
              <span class="opt-side">${s.price} ₪<small>${s.priceNote ? esc(s.priceNote) : 'מחיר טיפול'}</small></span>
            </button>`).join('')}
        </div>
      </div>`;
    $('#bookHint').textContent = 'שלב 1 מתוך 5 · אפשר לשנות בכל רגע';
  }

  if (state.step === 2) {
    const dates = nextDates(14);
    body.innerHTML = `
      <div class="book-step">
        <h3 class="book-title">מתי נוח לך?</h3>
        <div class="dates">
          ${dates.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const open = slotsFor(d).some((s) => s.free);
            return `<button class="date ${b.date === iso ? 'is-selected' : ''}" type="button" data-date="${iso}" ${open ? '' : 'disabled'}>
              <span class="d-day">${DAY_HE[d.getDay()]}</span>
              <span class="d-num">${d.getDate()}</span>
              <span class="d-mon">${MON_HE[d.getMonth()]}</span>
            </button>`;
          }).join('')}
        </div>
        <p class="slots-note">בשבת הסטודיו סגור. ימים ללא תורים פנויים מסומנים באפור.</p>
      </div>`;
    $('#bookHint').textContent = `הטיפול שנבחר: ${b.service?.name || '—'}`;
  }

  if (state.step === 3) {
    const d = new Date(b.date + 'T00:00:00');
    const slots = slotsFor(d);
    body.innerHTML = `
      <div class="book-step">
        <h3 class="book-title">שעות פנויות · ${esc(fmtDate(d))}</h3>
        <div class="slots">
          ${slots.map((s) => `
            <button class="slot ${b.time === s.time ? 'is-selected' : ''}" type="button" data-time="${s.time}" ${s.free ? '' : 'disabled'}>
              ${s.time}
            </button>`).join('')}
        </div>
        <p class="slots-note">משך הטיפול: כ־${b.service?.duration || 60} דקות. השעות המוצגות כבר מתחשבות במשך הטיפול.</p>
      </div>`;
  }

  if (state.step === 4) {
    body.innerHTML = `
      <div class="book-step">
        <h3 class="book-title">רק הפרטים ונסיים</h3>
        <form class="form-grid" id="detailsForm" novalidate>
          <div class="field">
            <label for="fName">שם מלא</label>
            <input id="fName" name="name" type="text" autocomplete="name" placeholder="למשל: מיכל כהן" value="${esc(b.name)}" required>
            <span class="err" hidden>נשמח לדעת איך לפנות אלייך</span>
          </div>
          <div class="field">
            <label for="fPhone">טלפון</label>
            <input id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="050-000-0000" value="${esc(b.phone)}" required>
            <span class="err" hidden>מספר טלפון לא תקין</span>
          </div>
          <div class="field">
            <label for="fNotes">משהו שכדאי שאדע? (לא חובה)</label>
            <textarea id="fNotes" name="notes" placeholder="אלרגיות, אורך מועדף, אירוע מיוחד...">${esc(b.notes)}</textarea>
          </div>
          <button class="btn btn-dark" type="submit">לסיכום התור</button>
        </form>
      </div>`;

    $('#detailsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#fName');
      const phone = $('#fPhone');
      let ok = true;

      const mark = (input, valid) => {
        input.closest('.field').classList.toggle('has-error', !valid);
        $('.err', input.closest('.field')).hidden = valid;
        if (!valid) ok = false;
      };
      mark(name, name.value.trim().length >= 2);
      mark(phone, /^0\d{1,2}-?\d{7}$|^0\d{9}$|^\+972\d{8,9}$/.test(phone.value.replace(/\s/g, '')));

      if (!ok) return;
      state.booking.name = name.value.trim();
      state.booking.phone = phone.value.trim();
      state.booking.notes = $('#fNotes').value.trim();
      state.step = 5;
      renderBooking();
    });
  }

  if (state.step === 5) {
    const d = new Date(b.date + 'T00:00:00');
    const waText = [
      `היי ${STUDIO.artist.split(' ')[0]}! קבעתי תור דרך האתר:`,
      `טיפול: ${b.service.name}`,
      `מועד: ${fmtDate(d)} בשעה ${b.time}`,
      state.design ? `העיצוב שבחרתי: ${state.design.title} (${state.design.shape}, ${state.design.lengthHe})` : '',
      `שם: ${b.name} · טלפון: ${b.phone}`,
      b.notes ? `הערה: ${b.notes}` : '',
    ].filter(Boolean).join('\n');

    body.innerHTML = `
      <div class="confirm">
        <span class="confirm-mark" aria-hidden="true">✨</span>
        <h3>התור שלך כמעט מוכן ✨</h3>
        <p>נשאר רק לאשר. מיד אחרי האישור תקבלי הודעת וואטסאפ עם כל הפרטים ותזכורת יום לפני.</p>

        <dl class="summary" style="width:min(30rem,100%);text-align:start">
          <div><dt>טיפול</dt><dd>${esc(b.service.name)}</dd></div>
          <div><dt>מועד</dt><dd>${esc(fmtDate(d))} · ${esc(b.time)}</dd></div>
          <div><dt>משך</dt><dd>כ־${b.service.duration} דקות</dd></div>
          ${state.design ? `<div><dt>העיצוב שבחרת</dt><dd>${esc(state.design.title)}</dd></div>` : ''}
          <div><dt>על שם</dt><dd>${esc(b.name)} · ${esc(b.phone)}</dd></div>
          <div class="total"><dt>לתשלום בסטודיו</dt><dd>${b.service.price} ₪${b.service.priceNote ? ' ' + esc(b.service.priceNote) : ''}</dd></div>
        </dl>

        ${state.design ? `
        <div class="picked-design" style="width:min(30rem,100%)">
          <img src="${state.design.img}" alt="${esc(state.design.alt)}">
          <span class="pd-text">
            <span class="pd-label">מצורף לתור</span>
            <strong>${esc(state.design.title)}</strong>
          </span>
        </div>` : ''}

        <div class="confirm-actions">
          <button class="btn btn-dark" type="button" id="confirmBtn">אישור התור</button>
          <a class="btn btn-outline" href="${WHATSAPP(waText)}" target="_blank" rel="noopener">שליחת הפרטים בוואטסאפ</a>
        </div>
        <p class="demo-note">זהו אתר הדגמה — התור אינו נשמר במערכת אמיתית. באתר חי כאן מתבצע חיבור ליומן הסטודיו ולהודעות אוטומטיות.</p>
      </div>`;

    $('#confirmBtn').addEventListener('click', () => {
      body.innerHTML = `
        <div class="confirm">
          <span class="confirm-mark" aria-hidden="true">💅</span>
          <h3>נתראה ${esc(fmtDate(d))} בשעה ${esc(b.time)}</h3>
          <p>שלחתי לך אישור לוואטסאפ. אם משהו משתנה — אפשר להודיע עד 24 שעות לפני, בלי עלות.</p>
          <div class="confirm-actions">
            <a class="btn btn-outline" href="${STUDIO.mapsUrl}" target="_blank" rel="noopener">איך מגיעים</a>
            <button class="btn btn-outline" type="button" id="restartBook">קביעת תור נוסף</button>
          </div>
          <p class="demo-note">אתר הדגמה · לא בוצעה קביעת תור אמיתית.</p>
        </div>`;
      $$('#steps li').forEach((li) => { li.classList.add('is-done'); li.classList.remove('is-active'); });
      $('#bookBack').hidden = true;
      $('#restartBook').addEventListener('click', () => {
        state.booking = { service: null, date: null, time: null, name: '', phone: '', notes: '' };
        state.design = null;
        state.step = 1;
        renderPickedDesign();
        renderBooking();
      });
      toast('התור אושר ✨ (הדגמה)');
    });
  }
}

/** אם המשתמשת סיימה תהליך קודם – מתחילים נקי בלחיצה על "קבעי תור" */
function resetBookingIfIdle() {
  if (state.step === 5 && !$('#confirmBtn')) {
    state.booking = { service: null, date: null, time: null, name: '', phone: '', notes: '' };
    state.step = 1;
    renderBooking();
  }
}

function initBooking() {
  $('#bookingBody').addEventListener('click', (e) => {
    const svc = e.target.closest('[data-pick-service]');
    if (svc) {
      state.booking.service = SERVICES.find((s) => s.id === svc.dataset.pickService);
      state.step = 2;
      renderBooking();
      return;
    }
    const date = e.target.closest('[data-date]');
    if (date) {
      state.booking.date = date.dataset.date;
      state.booking.time = null;
      state.step = 3;
      renderBooking();
      return;
    }
    const time = e.target.closest('[data-time]');
    if (time) {
      state.booking.time = time.dataset.time;
      state.step = 4;
      renderBooking();
    }
  });

  $('#bookBack').addEventListener('click', () => {
    state.step = Math.max(1, state.step - 1);
    renderBooking();
  });

  renderBooking();
}

/* ------------------------------------------------------------------ FAQ */
function initFaq() {
  $('#faqList').innerHTML = FAQ.map((f, i) => `
    <div class="faq-item">
      <h3>
        <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${i}">${esc(f.q)}</button>
      </h3>
      <div class="faq-a" id="faq-a-${i}"><div><p>${esc(f.a)}</p></div></div>
    </div>`).join('');

  $('#faqList').addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const open = item.classList.contains('is-open');
    $$('.faq-item', $('#faqList')).forEach((it) => {
      it.classList.remove('is-open');
      $('.faq-q', it).setAttribute('aria-expanded', 'false');
    });
    if (!open) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ------------------------------------------------------- אנימציות scroll */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const watch = () => $$('.reveal:not(.is-in)').forEach((el) => obs.observe(el));
  watch();
  // אלמנטים שנוצרים דינמית
  new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
}

/* ------------------------------------------------------------------ init */
initStaticContent();
initNav();
initGallery();
initModal();
initServices();
initQuiz();
initBooking();
initFaq();
initReveal();
