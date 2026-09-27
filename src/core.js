'use strict';
/* ================= DATA & INDEX ================= */
const D = window.__DATA__;
const WEEKS = D.weeks.filter(w => w.n <= 7);
const SLIDES = (D.slides || {});
const T = {}, F = {}, USES = {}, TOPICS = [];
D.weeks.forEach(w => w.topics.forEach(t => {
  T[t.id] = t; t.wk = w;
  if (w.n <= 7) TOPICS.push(t);
  t.formulas.forEach(f => { F[f.key] = f; f.topic = t; });
  t.examples.forEach((e, i) => {
    e.id = t.id + ':' + i; e.topic = t; e.idx = i;
    e.uses.forEach(k => (USES[k] = USES[k] || []).push(e));
  });
}));
const QZ = D.quiz;
const QMAP = {};
QZ.forEach(q => { QMAP[q.id] = q; });
const TOTAL_EX = TOPICS.reduce((a, t) => a + t.examples.length, 0);
const ES_KEYS = ['teori'].filter(k => T['es-' + k]);
const LETTERS = 'ABCDE';
const SENT = (D.extra && D.extra.sentences) || [];
const ES_TYPE = {}; const ES_TOPIC = {};
ES_KEYS.forEach(k => { ES_TYPE['es-' + k] = k; ES_TOPIC[k] = 'es-' + k; });
const PRIO_T = { 'w5-calc': 'Hitungan', 'w5-case': 'Workshop', 'w2-audit': 'Hitungan' };
const PRIO_W = { 5: 'banyak hitungan' };
const NB = (D.extra && D.extra.nusabean) || null;

/* ================= UTILS ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
function fmt(x, d = 2) {
  if (!isFinite(x)) return '–';
  const r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  let s = r.toFixed(d);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s === '-0' ? '0' : s;
}
function fmtN(x, d = 2) { const s = fmt(x, d); const p = s.split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (p[1] ? '.' + p[1] : ''); }
function polyTex(terms) {
  let s = '';
  for (const [c, v] of terms) {
    if (Math.abs(c) < 1e-12) continue;
    const neg = c < 0, ac = Math.abs(c);
    const cs = (Math.abs(ac - 1) < 1e-12 && v) ? '' : fmt(ac, 4);
    s += s ? (neg ? ' - ' : ' + ') : (neg ? '-' : '');
    s += cs + v;
  }
  return s || '0';
}
function smooth() { return RM ? 'auto' : 'smooth'; }

/* ================= TEX ================= */
const TEXC = new Map();
function fixTex(s) { return s.split(/(\\text\{[^{}]*\})/).map((part, i) => i % 2 ? part : part.replace(/(^|[^\\A-Za-z])([A-Z]{2,})(?![a-z])/g, (m, p, w) => p + '\\mathrm{' + w + '}')).join(''); }
function tex(s, disp) {
  const k = (disp ? '1' : '0') + s;
  let v = TEXC.get(k);
  if (v === undefined) {
    try { v = katex.renderToString(fixTex(s), { displayMode: !!disp, throwOnError: false, strict: 'ignore', output: 'html' }); }
    catch (e) { v = '<code>' + esc(s) + '</code>'; }
    TEXC.set(k, v);
  }
  return v;
}
function symHTML(s, plain) { return plain || (s.length > 2 && !/[\\^_{}]/.test(s)) ? '<span class="symw">' + esc(s) + '</span>' : tex(s); }
function tableHTML(rows, cls) {
  if (!rows || !rows.length) return '';
  const [h, ...b] = rows;
  return `<div class="tbl-wrap"><table class="dtbl ${cls || ''}"><thead><tr>${h.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${b.map(r => `<tr>${r.map(x => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ================= STORE ================= */
const Store = (() => {
  const K = 'relmat.v1';
  let d = {};
  try { d = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { d = {}; }
  return {
    get: (k, def) => (d[k] === undefined ? def : d[k]),
    set(k, v) { d[k] = v; try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
  };
})();
function markSeen(e) {
  if (!e.id) return;
  const s = Store.get('seen', {});
  if (!s[e.id]) { s[e.id] = Date.now(); Store.set('seen', s); refreshTree(); }
}
function topicProgress(t) { const s = Store.get('seen', {}); const n = t.examples.length; const d = t.examples.filter(e => s[e.id]).length; return { n, d }; }
function weekProgress(w) { let tot = 0, done = 0; w.topics.forEach(t => { const p = topicProgress(t); tot += p.n; done += p.d; }); return { tot, done, pct: tot ? done / tot * 100 : 0 }; }

/* ================= ICONS ================= */
const ICONS = {
  home: 'M3 11 12 4l9 7M5.5 9.5V20h13V9.5M10 20v-5h4v5',
  book: 'M4 5a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13v-4',
  sigma: 'M18 5H6l6 7-6 7h12',
  pen: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  timer: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 1.5M9.5 2.5h5',
  chev: 'M9 6l6 6-6 6', chevl: 'M15 6l-6 6 6 6', down: 'M6 9l6 6 6-6',
  check: 'M5 12.5l4.5 4.5L19 7.5', x: 'M6 6l12 12M18 6 6 18',
  flag: 'M5 21V4h12l-2.5 4L17 12H5', menu: 'M4 7h16M4 12h16M4 17h16',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.3V16h6v-.9c0-.5.2-1 .6-1.3A6 6 0 0 0 12 3z',
  alert: 'M12 3.5 2.5 20h19zM12 10v4.5M12 17.2v.3',
  lab: 'M9 3h6M10 3v6.5L4.6 18.6A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.4-2.4L14 9.5V3M7.5 15h9',
  shuffle: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  play: 'M8 5v14l11-7z', cards: 'M8 4h11a1 1 0 0 1 1 1v12M4 8h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  grad: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5'
};
function icon(n, c = '') { return `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`; }

/* ================= SHELL & ROUTER ================= */
const NAV = [['home', '#/', 'home', 'Beranda', 'Beranda'], ['materi', '#/materi', 'book', 'Materi', 'Materi'], ['rumus', '#/rumus', 'sigma', 'Konsep', 'Bank konsep & rumus'], ['latihan', '#/latihan', 'pen', 'Latihan', 'Latihan soal'], ['uts', '#/uts', 'timer', 'Ujian', 'Simulasi ujian']];
function buildShell() {
  $('#snav').innerHTML = NAV.map(n => `<a data-nav="${n[0]}" href="${n[1]}">${icon(n[2])}<span>${n[4]}</span></a>`).join('');
  $('#tabbar').innerHTML = NAV.map(n => `<a data-nav="${n[0]}" href="${n[1]}">${icon(n[2])}<span>${n[3]}</span></a>`).join('');
  $('#side-tree').innerHTML = WEEKS.map(w => `<div class="tw"><a class="tw-h" href="#/w/${w.n}"><span class="wb">W${w.n}</span><span>${esc(w.title)}</span></a>${w.topics.map(t => `<a class="tl" data-t="${t.id}" href="#/t/${t.id}"><i class="dot"></i><span>${esc(t.title)}</span></a>`).join('')}</div>`).join('') +
    `<div class="tw"><a class="tw-h" href="#/essay"><span class="wb es">KS</span><span>Studi kasus</span></a></div>`;
  refreshTree();
  $('#menu-btn').onclick = () => document.body.classList.toggle('drawer');
  $('#scrim').onclick = () => document.body.classList.remove('drawer');
}
function refreshTree() {
  $$('#side-tree .tl').forEach(a => {
    const p = topicProgress(T[a.dataset.t]);
    a.classList.toggle('done', p.d === p.n);
    a.classList.toggle('part', p.d > 0 && p.d < p.n);
  });
}
function setNav(key, tid) {
  $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === key));
  $$('#side-tree .tl').forEach(a => a.classList.toggle('on', a.dataset.t === tid));
  document.body.classList.remove('drawer');
  const cur = tid && $(`#side-tree .tl[data-t="${tid}"]`);
  if (cur && window.innerWidth >= 1024) {
    const side = $('#side'); const r = cur.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 20) cur.scrollIntoView({ block: 'center' });
    void side;
  }
}
let disposers = [];
function onDispose(f) { disposers.push(f); }
function mount(html) {
  disposers.splice(0).forEach(f => { try { f(); } catch (e) {} });
  const v = $('#view');
  v.innerHTML = html;
  if (!RM) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); }
  return v;
}
const ROUTES = [
  [/^#\/?$/, () => Home(), 'home'],
  [/^#\/materi$/, () => Materi(), 'materi'],
  [/^#\/w\/(\d)$/, m => Week(+m[1]), 'materi'],
  [/^#\/nb$/, () => NBPage(), 'materi'],
  [/^#\/t\/([\w-]+)(?:\/(\d+))?$/, m => Topic(m[1], +(m[2] || 0)), 'materi'],
  [/^#\/rumus$/, () => Rumus(), 'rumus'],
  [/^#\/hafalan$/, () => Hafalan(), 'rumus'],
  [/^#\/latihan(?:\?(\w)=([\w-]+))?$/, m => QuizHome(m[1], m[2]), 'latihan'],
  [/^#\/essay(?:\/(\w+))?(?:\/(\d+))?$/, m => Essay(m[1] || ES_KEYS[0], m[2] != null ? +m[2] : null), 'latihan'],
  [/^#\/uts$/, () => Sim(), 'uts']
];
function route() {
  const h = location.hash || '#/';
  for (const [re, fn, nav] of ROUTES) {
    const m = h.match(re);
    if (m) {
      fn(m);
      setNav(nav, (h.match(/^#\/t\/([\w-]+)/) || [])[1]);
      window.scrollTo(0, 0);
      return;
    }
  }
  location.replace('#/');
}

/* ================= SHARED COMPONENTS ================= */
function srcTag(src) {
  const s = src || '';
  let c = '';
  if (/^(UTS|Ujian)/.test(s)) c = 'red'; else if (/^Latihan/.test(s)) c = 'green'; else if (/^Slide/.test(s)) c = 'blue'; else c = 'amber';
  return `<span class="tag ${c}">${esc(s)}</span>`;
}
function soalHTML(lines) {
  let out = '', ul = false, tb = [];
  const flushT = () => { if (tb.length) { out += tableHTML(tb.map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim()))); tb = []; } };
  for (const L of lines) {
    if (L && L.charAt(0) === '|') { if (ul) { out += '</ul>'; ul = false; } tb.push(L); continue; }
    flushT();
    if (!L) { if (ul) { out += '</ul>'; ul = false; } continue; }
    if (L.charAt(0) === '•') { if (!ul) { out += '<ul>'; ul = true; } out += `<li>${esc(L.slice(1).trim())}</li>`; continue; }
    if (ul) { out += '</ul>'; ul = false; }
    const m = L.match(/^\(([a-h]|i{1,3}|iv|v|\d)\)\s*(.*)$/);
    out += m ? `<p class="sub"><b>(${m[1]})</b> ${esc(m[2])}</p>` : `<p>${esc(L)}</p>`;
  }
  flushT();
  if (ul) out += '</ul>';
  return out;
}
function answerHTML(txt) {
  let h = esc(txt)
    .replace(/\s\(((?:[b-h])|(?:ii|iii|iv))\)\s/g, '<br><b>($1)</b> ')
    .replace(/^\((a|i)\)\s/, '<b>($1)</b> ')
    .replace(/⚠/g, '<span class="warnmark">⚠</span>');
  return `<div class="answer"><div class="label">${icon('check')} Jawaban</div><p>${h}</p></div>`;
}
function varsTable(vars, plain) {
  return `<table class="vars ${plain ? 'cvars' : ''}"><tbody>${vars.map(v => `<tr><td>${symHTML(v.sym, plain)}</td><td>${esc(v.meaning)}</td></tr>`).join('')}</tbody></table>`;
}
function fBody(f) { return f.kind === 'concept' ? `<div class="fc-def">${esc(f.def)}</div>${varsTable(f.vars, true)}` : `<div class="fc-tex">${tex(f.tex, true)}</div>${varsTable(f.vars)}`; }
function usesHTML(keys) {
  const fs = (keys || []).map(k => F[k]).filter(Boolean);
  if (!fs.length) return '';
  return `<div class="uses"><div class="uses-h">${icon('sigma')} Konsep / rumus yang dipakai</div>${fs.map(f => `<details class="uf"><summary class="uf-t"><span>${esc(f.title)}</span><a class="uf-link" href="#/t/${f.topic.id}">${f.topic.wk.n === 9 ? 'Kasus' : 'W' + f.topic.wk.n} · ${esc(f.topic.title)}</a></summary>${fBody(f)}</details>`).join('')}</div>`;
}
function exHref(e) { return e.topic.wk.n === 9 ? `#/essay/${ES_TYPE[e.topic.id]}/${e.idx}` : `#/t/${e.topic.id}/${e.idx}`; }
function formulaCard(f, meta) {
  const ex = USES[f.key] || [];
  return `<div class="fcard" id="f-${f.key}">
    <div class="fc-h"><span class="fc-t">${f.kind === 'concept' ? '' : '<i class="fx">ƒx</i> '}${esc(f.title)}</span>${meta ? `<a class="tag blue" href="#/t/${f.topic.id}">W${f.topic.wk.n}</a>` : ''}</div>
    ${fBody(f)}
    ${ex.length ? `<div class="fc-ex"><span>Dipakai di:</span>${ex.slice(0, 8).map(e => `<a href="${exHref(e)}" title="${esc(e.title)}">${e.topic.wk.n === 9 ? 'Kasus' : 'W' + e.topic.wk.n} · ${e.idx + 1}</a>`).join('')}${ex.length > 8 ? `<span>+${ex.length - 8}</span>` : ''}</div>` : ''}
  </div>`;
}
function shortT(t) {
  const m = { 'w5-linear': 'D&S', 'w5-elastic': 'Elast', 'w5-eq': 'Eq', 'w5-control': 'Ceiling', 'w5-tax': 'Pajak', 'w5-surplus': 'Surplus', 'w3-rate': 'Laju', 'w3-rules': 'Aturan', 'w3-second': 'Max/min', 'w3-inflex': 'POI', 'w3-opt': 'Optim', 'w3-partial': 'Partial', 'w4-rules': 'Aturan', 'w4-sub': 'Subst', 'w4-def': 'Tentu', 'w4-rate': 'Rate', 'w1-basic': 'Dasar', 'w1-transpose': 'Transp', 'w1-frac': 'Pecahan', 'w1-quad': 'Kuadrat', 'w1-log': 'Log', 'w2-line': 'Garis', 'w2-spl': 'SPL', 'w2-ineq': 'LP', 'w2-quadfn': 'Kuadrat', 'es-tax': 'Tax', 'es-bm': 'BM', 'es-partial': 'Partial' };
  return m[t.id] || '';
}
function stepHTML(s, j) {
  return `<div class="step"><div class="step-n">${j + 1}</div><div class="step-b"><div class="step-t">${esc(s.title)}</div>${s.why ? `<div class="step-why">${esc(s.why)}</div>` : ''}${(s.notes || []).map(n => `<p class="step-note">${esc(n)}</p>`).join('')}${s.rows && s.rows.length ? tableHTML(s.rows, 'sm') : ''}${s.tex ? `<div class="step-math">${tex(s.tex, true)}</div>` : ''}</div></div>`;
}

/* Example with step-by-step reveal. o: {index,total,onNext,onDone} */
const REVEAL = new Map();
function renderExample(el, e, o = {}) {
  const key = e.id || e.key || (e.key = 'g' + Math.random().toString(36).slice(2));
  const n = e.steps.length;
  let k = Math.min(REVEAL.get(key) || 0, n);
  el.innerHTML = `<article class="card ex">
    <header class="ex-h"><div class="ex-tags">${srcTag(e.src)}${o.total ? `<span class="muted sm">Contoh ${o.index + 1} dari ${o.total}</span>` : ''}</div><h3>${esc(e.title)}</h3></header>
    ${(e.slides && e.slides.length) ? `<div class="slideshow">${e.slides.map(sl => SLIDES[sl] ? `<figure class="slidefig"><img src="${SLIDES[sl]}" alt="Slide ${sl}" decoding="async"><figcaption>Slide asli dosen — ${sl.replace('-', '.')}</figcaption></figure>` : '').join('')}</div>` : ''}
    <div class="soal"><div class="label">Soal</div>${soalHTML(e.soal)}</div>
    <div class="steps"></div><div class="ex-ctrl"></div><div class="ex-end"></div></article>`;
  const art = el.firstElementChild, S = $('.steps', art), C = $('.ex-ctrl', art), E = $('.ex-end', art);
  function addSteps(to, mode) {
    const from = S.children.length;
    for (let j = from; j < to; j++) {
      S.insertAdjacentHTML('beforeend', stepHTML(e.steps[j], j));
      if (mode && !RM) { const s = S.lastElementChild; s.classList.add('new'); s.style.animationDelay = (mode === 'all' ? (j - from) * 70 : 0) + 'ms'; }
    }
  }
  function paint(mode) {
    if (S.children.length > k) S.innerHTML = '';
    addSteps(k, mode);
    art.classList.toggle('open', k > 0);
    if (k < n) {
      C.innerHTML = k === 0
        ? `<div class="try"><p>${icon('pen')}<span>Coba kerjakan dulu di kertas, baru buka pembahasannya.</span></p><div class="row"><button class="btn primary" data-a="next">${icon('play')} Mulai pembahasan</button><button class="btn ghost" data-a="all">Tampilkan semua langkah</button></div></div>`
        : `<div class="stepbar"><div class="sb-prog"><span>Langkah ${k} dari ${n}</span><div class="bar"><i style="width:${k / n * 100}%"></i></div></div><div class="row"><button class="btn ghost sm" data-a="all">Semua</button><button class="btn primary" data-a="next">Langkah berikutnya ${icon('down')}</button></div></div>`;
      E.innerHTML = '';
    } else {
      C.innerHTML = '';
      if (!E.innerHTML) {
        E.innerHTML = answerHTML(e.answer) + usesHTML(e.uses) +
          `<div class="row between endrow"><button class="btn ghost sm" data-a="reset">${icon('refresh')} Tutup pembahasan</button>${o.onNext ? `<button class="btn primary" data-a="nextex">Contoh berikutnya ${icon('chev')}</button>` : ''}</div>`;
        if (mode && !RM) { E.classList.remove('new'); void E.offsetWidth; E.classList.add('new'); }
      }
      markSeen(e);
      if (o.onDone) o.onDone();
    }
  }
  art.addEventListener('click', ev => {
    const b = ev.target.closest('[data-a]');
    if (!b) return;
    const a = b.dataset.a;
    if (a === 'next') { k = Math.min(n, k + 1); REVEAL.set(key, k); paint('one'); const tgt = k < n ? C : E.firstElementChild; if (tgt) tgt.scrollIntoView({ behavior: smooth(), block: 'nearest' }); }
    else if (a === 'all') { k = n; REVEAL.set(key, k); paint('all'); }
    else if (a === 'reset') { k = 0; REVEAL.set(key, 0); S.innerHTML = ''; E.innerHTML = ''; paint(); art.scrollIntoView({ behavior: smooth(), block: 'start' }); }
    else if (a === 'nextex' && o.onNext) o.onNext();
  });
  paint();
}

/* Custom modal (no native confirm) */
function modal(html, buttons) {
  return new Promise(res => {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="card">${html}<div class="row end mt">${buttons.map((b, i) => `<button class="btn ${b.primary ? 'primary' : ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', ev => {
      const b = ev.target.closest('[data-i]');
      if (b) { m.remove(); res(buttons[+b.dataset.i].value); }
      else if (ev.target === m) { m.remove(); res(null); }
    });
  });
}
