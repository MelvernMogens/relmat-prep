/* ================= BANK RUMUS ================= */
function Rumus() {
  mount(`<div class="page">
    <header class="phead"><div class="kicker">Bank konsep & rumus</div><h1>Semua konsep, framework & rumus</h1><p class="lead">${Object.keys(F).length} kartu W1–W7, lengkap dengan arti tiap bagian. Tiap kartu ada link ke contoh kasus yang memakainya.</p>
      <div class="row mt"><div class="search">${icon('eye')}<input id="rq" type="search" placeholder="Cari… (mis. recency, audit, sentiment, persona)" autocomplete="off"></div><a class="btn" href="#/hafalan">${icon('cards')} Mode hafalan</a></div>
      <div class="jump" id="rwk">${WEEKS.map(w => `<button class="chip" data-w="${w.n}">W${w.n}</button>`).join('')}</div>
    </header>
    <div id="rlist">${WEEKS.map(w => `<section class="sec" data-wk="${w.n}" id="rw-${w.n}"><div class="sec-h"><h2><span class="wb lg">W${w.n}</span> ${esc(w.title)}</h2></div>${w.topics.filter(t => t.formulas.length).map(t => `<div class="rtopic" data-tp><h3><a href="#/t/${t.id}">${esc(t.title)}</a></h3><div class="fgrid">${t.formulas.map(f => `<div data-f="${esc((f.title + ' ' + (f.def || '') + ' ' + f.vars.map(v => v.sym + ' ' + v.meaning).join(' ') + ' ' + t.title).toLowerCase())}">${formulaCard(f, false)}</div>`).join('')}</div></div>`).join('')}</section>`).join('')}</div>
    <p class="muted center" id="rnone" hidden>Tidak ada yang cocok.</p>
  </div>`);
  $$('#rwk .chip').forEach(b => { b.onclick = () => $('#rw-' + b.dataset.w).scrollIntoView({ behavior: smooth(), block: 'start' }); });
  $('#rq').addEventListener('input', ev => {
    const q = ev.target.value.trim().toLowerCase();
    let any = false;
    $$('[data-f]').forEach(d => { const ok = !q || d.dataset.f.indexOf(q) >= 0; d.hidden = !ok; any = any || ok; });
    $$('[data-tp]').forEach(d => { d.hidden = !$$('[data-f]', d).some(x => !x.hidden); });
    $$('[data-wk]').forEach(d => { d.hidden = !$$('[data-f]', d).some(x => !x.hidden); });
    $('#rnone').hidden = any;
  });
}

/* ================= HAFALAN (flashcards) ================= */
function Hafalan() {
  const all = TOPICS.flatMap(t => t.formulas);
  let wk = 0, deck = [], i = 0, flip = false;
  const known = () => Store.get('known', {});
  function build() { deck = shuffle(all.filter(f => !wk || f.topic.wk.n === wk)); i = 0; flip = false; }
  mount(`<div class="page narrow">
    <nav class="crumb"><a href="#/rumus">Bank konsep</a>${icon('chev')}<span>Hafalan</span></nav>
    <header class="phead"><div class="kicker">Kartu hafalan</div><h1>Konsep & rumus</h1><p class="lead">Lihat nama konsep → jelaskan dulu di kepala (definisi + bagian-bagiannya) → balik kartu.</p>
      <div class="seg" id="hwk"><button data-w="0" class="on">Semua</button>${WEEKS.map(w => `<button data-w="${w.n}">W${w.n}</button>`).join('')}</div></header>
    <div id="fc"></div>
  </div>`);
  function paint() {
    const f = deck[i], k = known();
    const nk = deck.filter(x => k[x.key]).length;
    $('#fc').innerHTML = `<div class="fc-meta"><span>Kartu ${i + 1} / ${deck.length}</span><span>${nk} sudah hafal</span></div>
      <div class="bar"><i style="width:${(i + 1) / deck.length * 100}%"></i></div>
      <button class="flash ${flip ? 'flipped' : ''}" id="flash" aria-label="Balik kartu">
        <div class="face front"><span class="tag blue">W${f.topic.wk.n} · ${esc(f.topic.title)}</span><div class="ft">${esc(f.title)}</div><small>${icon('refresh')} Ketuk untuk lihat jawabannya</small></div>
        <div class="face back"><div class="ft sm">${esc(f.title)}</div>${fBody(f)}</div>
      </button>
      <div class="row between mt"><button class="btn ghost" id="fprev">${icon('chevl')} Sebelumnya</button>
      <div class="row"><button class="btn" id="fno">${icon('x')} Belum hafal</button><button class="btn primary" id="fyes">${icon('check')} Sudah hafal</button></div></div>
      <div class="row center mt"><button class="btn ghost sm" id="fsh">${icon('shuffle')} Acak ulang</button>${k[f.key] ? '<span class="tag green">✓ ditandai hafal</span>' : ''}</div>`;
    $('#flash').onclick = () => { flip = !flip; $('#flash').classList.toggle('flipped', flip); };
    const go = d => { i = (i + d + deck.length) % deck.length; flip = false; paint(); };
    $('#fprev').onclick = () => go(-1);
    $('#fyes').onclick = () => { const k2 = known(); k2[f.key] = 1; Store.set('known', k2); go(1); };
    $('#fno').onclick = () => { const k2 = known(); delete k2[f.key]; Store.set('known', k2); go(1); };
    $('#fsh').onclick = () => { build(); paint(); };
  }
  $$('#hwk button').forEach(b => { b.onclick = () => { $$('#hwk button').forEach(x => x.classList.toggle('on', x === b)); wk = +b.dataset.w; build(); paint(); }; });
  build(); paint();
}

/* ================= QUIZ (PG) ================= */
function qStats() { return Store.get('qs', {}); }
function quizTotals() { const s = qStats(); let n = 0, r = 0; Object.keys(s).forEach(k => { n += s[k].a; r += s[k].r; }); return { n, r }; }
function recordQ(q, ok) { const s = qStats(); const x = s[q.id] || { a: 0, r: 0 }; x.a++; if (ok) x.r++; x.last = ok ? 1 : 0; s[q.id] = x; Store.set('qs', s); }
function qText(q) { return soalHTML(q.q); }
function QuizHome(k, v) {
  if (k === 't' && T[v]) return runQuiz(QZ.filter(q => q.topic === v), `Latihan: ${T[v].title}`, '#/t/' + v);
  if (k === 'w' && +v >= 1 && +v <= 7) return runQuiz(shuffle(QZ.filter(q => q.week === +v)), `Latihan PG Week ${v}`, '#/latihan');
  const s = qStats();
  const wrong = QZ.filter(q => s[q.id] && s[q.id].last === 0);
  const tt = quizTotals();
  mount(`<div class="page">
    <header class="phead"><div class="kicker">Latihan</div><h1>Latihan soal</h1><p class="lead">Pilihan ganda dengan pembahasan langsung, plus studi kasus bergaya ujian.</p></header>
    <div class="grid2">
      <button class="lcard" data-go="mix"><span class="lc-ic blue">${icon('shuffle')}</span><b>Campuran 10 soal</b><small>Acak dari semua week</small></button>
      <button class="lcard" data-go="wrong" ${wrong.length ? '' : 'disabled'}><span class="lc-ic red">${icon('refresh')}</span><b>Ulangi yang salah</b><small>${wrong.length ? wrong.length + ' soal terakhir salah' : 'Belum ada soal salah'}</small></button>
    </div>
    <div class="sec-h mt-l"><h2>Per week</h2><span class="muted sm">${tt.n ? `akurasi total ${Math.round(tt.r / tt.n * 100)}% dari ${tt.n} jawaban` : ''}</span></div>
    <div class="qweeks">${WEEKS.map(w => { const qs = QZ.filter(q => q.week === w.n); const done = qs.filter(q => s[q.id]).length; const right = qs.filter(q => s[q.id] && s[q.id].last === 1).length; return `<a class="qw" href="#/latihan?w=${w.n}"><span class="wb lg">W${w.n}</span><span class="qw-b"><b>${esc(w.title)}</b><small>${qs.length} soal · ${done ? right + ' benar dari ' + done + ' dicoba' : 'belum dicoba'}</small><span class="bar"><i style="width:${qs.length ? right / qs.length * 100 : 0}%"></i></span></span>${icon('chev', 'go')}</a>`; }).join('')}</div>
    <div class="sec-h mt-l"><h2>Studi kasus</h2><a href="#/essay">Buka studi kasus ${icon('chev')}</a></div>
    <div class="grid3">${ES_KEYS.map((k2, i) => `<a class="lcard" href="#/essay/${k2}"><span class="lc-ic amber">${i + 1}</span><b>${esc(T[ES_TOPIC[k2]].title.replace('Kasus: ', ''))}</b><small>${esc(T[ES_TOPIC[k2]].sub.split('.')[0])}</small></a>`).join('')}</div>
  </div>`);
  $$('[data-go]').forEach(b => {
    b.onclick = () => {
      if (b.dataset.go === 'mix') runQuiz(shuffle(QZ).slice(0, 10), 'Campuran 10 soal', '#/latihan');
      else runQuiz(shuffle(wrong), 'Ulangi yang salah', '#/latihan');
    };
  });
}
function optsHTML(q, order, chosen, reveal) {
  return order.map((oi, j) => {
    let c = 'opt';
    if (reveal) { if (oi === q.ans) c += ' right'; else if (oi === chosen) c += ' wrong'; else c += ' dim'; }
    else if (oi === chosen) c += ' sel';
    return `<button class="${c}" data-oi="${oi}" ${reveal ? 'disabled' : ''}><span class="ol">${LETTERS[j]}</span><span class="ot">${esc(q.opts[oi])}</span>${reveal && oi === q.ans ? icon('check', 'oi') : ''}${reveal && oi === chosen && oi !== q.ans ? icon('x', 'oi') : ''}</button>`;
  }).join('');
}
function whyHTML(q) {
  return `<div class="why"><div class="label">${icon('bulb')} Pembahasan</div>${q.why.map(l => `<p>${esc(l)}</p>`).join('')}</div>${usesHTML(q.uses)}<a class="minilink" href="#/t/${q.topic}">${icon('book')} Pelajari topik: ${esc(T[q.topic].title)}</a>`;
}
function runQuiz(list, title, back) {
  if (!list.length) return;
  let i = 0; const res = [];
  const orders = list.map(q => shuffle(q.opts.map((_, i) => i)));
  mount(`<div class="page narrow quiz"><nav class="crumb"><a href="${back}">${icon('chevl')} Kembali</a></nav><div id="qz"></div></div>`);
  function paint() {
    const q = list[i];
    $('#qz').innerHTML = `<div class="qhead"><span class="kicker">${esc(title)}</span><span class="muted sm">Soal ${i + 1} / ${list.length}</span></div>
      <div class="bar"><i style="width:${i / list.length * 100}%"></i></div>
      <article class="card qcard"><div class="row"><span class="tag blue">W${q.week}</span><span class="tag">${esc(T[q.topic].title)}</span></div>
      <div class="qtext">${qText(q)}</div><div class="opts">${optsHTML(q, orders[i], null, false)}</div><div id="qfb"></div></article>`;
    $$('.opt', $('#qz')).forEach(b => {
      b.onclick = () => {
        const oi = +b.dataset.oi, ok = oi === q.ans;
        res[i] = { q, ok, oi };
        recordQ(q, ok);
        $('.opts', $('#qz')).innerHTML = optsHTML(q, orders[i], oi, true);
        $('#qfb').innerHTML = `<div class="verdict ${ok ? 'ok' : 'no'}">${icon(ok ? 'check' : 'x')} ${ok ? 'Benar!' : 'Belum tepat — jawaban benar: ' + LETTERS[orders[i].indexOf(q.ans)]}</div>${whyHTML(q)}
          <div class="row end mt"><button class="btn primary" id="qnext">${i + 1 < list.length ? 'Soal berikutnya ' + icon('chev') : 'Lihat hasil ' + icon('chev')}</button></div>`;
        if (!RM) $('#qfb').classList.add('new');
        $('#qnext').onclick = () => { i++; i < list.length ? paint() : done(); window.scrollTo({ top: 0, behavior: smooth() }); };
      };
    });
  }
  function done() {
    const r = res.filter(x => x && x.ok).length;
    const byT = {};
    res.forEach(x => { if (!x) return; const b = byT[x.q.topic] = byT[x.q.topic] || { n: 0, r: 0 }; b.n++; if (x.ok) b.r++; });
    const pct = Math.round(r / list.length * 100);
    $('#qz').innerHTML = `<article class="card result"><div class="kicker">${esc(title)}</div><div class="score ${pct >= 70 ? 'good' : pct >= 50 ? 'mid' : 'bad'}"><b>${r}</b><span>/ ${list.length}</span></div><p class="lead">${pct >= 80 ? 'Mantap, sudah siap.' : pct >= 60 ? 'Lumayan — ulangi topik yang merah.' : 'Pelajari lagi contoh soal di topik yang merah.'}</p>
      <div class="tbreak">${Object.keys(byT).map(tid => { const b = byT[tid]; return `<a href="#/t/${tid}" class="${b.r === b.n ? 'ok' : 'no'}"><span>${esc(T[tid].title)}</span><b>${b.r}/${b.n}</b></a>`; }).join('')}</div>
      <div class="row center mt"><a class="btn" href="${back}">Selesai</a><button class="btn primary" id="qagain">${icon('refresh')} Ulangi</button></div></article>
      <div class="sec-h mt-l"><h2>Review jawaban</h2></div>
      ${res.map((x, j) => `<details class="card rev"><summary><span class="${x.ok ? 'okc' : 'noc'}">${icon(x.ok ? 'check' : 'x')}</span><span>${j + 1}. ${esc(x.q.q[0]).slice(0, 110)}${x.q.q[0].length > 110 ? '…' : ''}</span></summary><div class="qtext">${qText(x.q)}</div><div class="opts">${optsHTML(x.q, orders[j], x.oi, true)}</div>${whyHTML(x.q)}</details>`).join('')}`;
    $('#qagain').onclick = () => runQuiz(shuffle(list), title, back);
    const onT = e => { if (e.target.closest('details.rev')) {} };
    void onT;
  }
  paint();
}

/* ================= KASUS: generator RFM acak ================= */
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const BRANDS = [['Seduh', 'toko teh online'], ['Batik Rasa', 'brand batik modern'], ['SkinLab', 'brand skincare lokal'], ['Roti Pagi', 'bakery omnichannel'], ['Kopi Senja', 'kedai kopi'], ['Lari.id', 'toko perlengkapan lari'], ['Wangi', 'brand parfum lokal'], ['Tani Segar', 'e-grocery sayur']];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dstr(d) { return `${String(d.getUTCDate()).padStart(2, '0')}-${MON[d.getUTCMonth()]}-${d.getUTCFullYear()}`; }
function rankEq(vals, v, asc) { return 1 + vals.filter(x => (asc ? x < v : x > v)).length; }
function qScore(rank, n) { return 6 - Math.ceil(Math.round(rank / n * 5 * 1e9) / 1e9); }
function gridSeg(r, fm) {
  const b = fm >= 4 ? 0 : fm >= 2.5 ? 1 : 2;
  if (r === 5) return ['Champions', 'Recent Users', 'Price Sensitive'][b];
  if (r === 4) return ['Loyal Customers', 'Potential Loyalist', 'Promising'][b];
  if (r === 3) return ['Loyal Customers', 'Needs Attention', 'About To Sleep'][b];
  return ["Can't Lose Them", 'Hibernating', 'Lost'][b];
}
const SEG_ACT = { 'Champions': 'VIP / loyalty eksklusif', 'Loyal Customers': 'retensi + cross-sell, referral', 'Potential Loyalist': 'naikkan frekuensi/nilai', 'Recent Users': 'nurture ke loyalitas', 'Promising': 'selective nurture', 'Needs Attention': 'diagnosa + nurture', 'About To Sleep': 're-engagement', "Can't Lose Them": 'win-back personal, hati-hati', 'Hibernating': 'win-back biaya terkontrol', 'Lost': 'reactivation test murah', 'Price Sensitive': 'penawaran value/harga tertarget' };
function rfmCompute(rows, n) {
  const Rs = rows.map(r => r.R), Fs = rows.map(r => r.F), Ms = rows.map(r => r.M);
  rows.forEach(r => {
    r.rkR = rankEq(Rs, r.R, true); r.rkF = rankEq(Fs, r.F, false); r.rkM = rankEq(Ms, r.M, false);
    r.r = qScore(r.rkR, n); r.f = qScore(r.rkF, n); r.m = qScore(r.rkM, n);
    r.fm = (r.f + r.m) / 2; r.code = '' + r.r + r.f + r.m; r.seg = gridSeg(r.r, r.fm);
  });
  return rows;
}

/* dosen generators removed for RM course */
const GEN = {};
const PATTERN = {
  rmonly: [['Analisis', '\text{baca kasus} \to \text{identifikasi konsep} \to \text{terapkan framework} \to \text{rekomendasi}']],
};
const ES_LABEL = { teori: 'Essay teori', rfm: 'RFM & rekomendasi', clean: 'Cleaning data', persona: 'Persona & theme-sentiment' };
function Essay(type, idx) {
  if (!T[ES_TOPIC[type]]) return ES_KEYS.length ? location.replace('#/essay/' + ES_KEYS[0]) : location.replace('#/latihan');
  const t = T[ES_TOPIC[type]];
  const gen = GEN[type];
  mount(`<div class="page">
    <nav class="crumb"><a href="#/latihan">Latihan</a>${icon('chev')}<span>Studi kasus</span></nav>
    <header class="phead"><div class="kicker">Studi kasus</div><h1>Latihan kasus</h1><p class="lead">Kerjakan di kertas dulu. Tiap langkah pembahasan = poin rubrik — tulis langkahnya, bukan cuma jawaban akhir.</p>
      <div class="seg big" id="estype">${ES_KEYS.map((k, i) => `<a href="#/essay/${k}" class="${k === type ? 'on' : ''}"><span class="num">${i + 1}</span>${ES_LABEL[k] || esc(T[ES_TOPIC[k]].title)}</a>`).join('')}</div>
    </header>
    ${PATTERN[type] ? `<section class="card pattern"><div class="label">${icon('list')} Pola jawaban — ${ES_LABEL[type]}</div><ol>${PATTERN[type].map(p => `<li><b>${p[0]}</b>${tex(p[1])}</li>`).join('')}</ol></section>` : ''}
    <section class="sec"><div class="sec-h"><h2>Kasus</h2>${gen ? `<button class="btn primary sm" id="esnew">${icon('shuffle')} Soal baru (acak)</button>` : ''}</div>
      <div class="extabs" id="estabs">${t.examples.map((e, j) => `<button class="extab" data-j="${j}"><span>${j + 1}</span><em>${esc(e.title)}</em></button>`).join('')}${gen ? `<button class="extab" data-j="r"><span>${icon('shuffle')}</span><em>Acak</em></button>` : ''}</div>
      <div id="esbox"></div></section>
  </div>`);
  const box = $('#esbox');
  const tabs = on => $$('#estabs .extab').forEach(b => b.classList.toggle('on', b.dataset.j === String(on)));
  const showPool = j => { tabs(j); renderExample(box, t.examples[j], { index: j, total: t.examples.length, onNext: (j + 1 < t.examples.length ? () => showPool(j + 1) : gen ? showRand : null) }); history.replaceState(null, '', `#/essay/${type}/${j}`); };
  const showRand = () => { tabs('r'); const g = gen(); renderExample(box, g, { onNext: showRand }); history.replaceState(null, '', `#/essay/${type}`); };
  $$('#estabs .extab').forEach(b => { b.onclick = () => (b.dataset.j === 'r' ? showRand() : showPool(+b.dataset.j)); });
  if (gen) $('#esnew').onclick = () => { showRand(); box.scrollIntoView({ behavior: smooth(), block: 'start' }); };
  showPool(idx != null && idx < t.examples.length ? idx : 0);
}

/* ================= SIMULASI UJIAN ================= */
const SIM_MIX = { 1: 4, 2: 5, 3: 5, 4: 6, 6: 5, 7: 5 };
const SIM_N = Object.values(SIM_MIX).reduce((a, b) => a + b, 0);
const SIM_PG_PTS = 2;
const SIM_ES = ['teori','teori'];
const SIM_ES_PTS = 40 / 3;
const SIM_MIN = 120;
function newSim() {
  const pg = [];
  const dq = [];
  Object.keys(SIM_MIX).forEach(w => {
    const want = SIM_MIX[w], fromD = [];
    const rest = shuffle(QZ.filter(q => q.week === +w)).slice(0, want);
    fromD.concat(rest).forEach(q => pg.push(q.id));
  });
  const essays = [];
  const pool = T['es-teori'] ? shuffle(T['es-teori'].examples) : [];
  const teori = pool.slice(0, 3);
  teori.forEach(ex => essays.push({ type: 'teori', ex }));

  
  if (essays.length < 3 && pool.length) essays.push({ type: 'teori', ex: pool[essays.length % pool.length] });
  return { v: 2, pg: shuffle(pg), ord: pg.map(id => shuffle(QMAP[id].opts.map((_, i) => i))), esPts: SIM_ES_PTS, pgPts: SIM_PG_PTS, ans: {}, flag: {}, essays: essays.map(E => ({ type: E.type, ex: { title: E.ex.title, src: E.ex.src, soal: E.ex.soal, steps: E.ex.steps, answer: E.ex.answer, uses: E.ex.uses } })), start: Date.now(), dur: SIM_MIN * 60 * 1000, status: 'run', cur: 0, rub: {} };
}
function Sim() {
  let st = Store.get('sim');
  if (st && st.v !== 2) { Store.set('sim', null); st = null; }
  if (st && st.status === 'run') return simRun(st);
  if (st && st.status === 'grade') return simGrade(st);
  const hist = Store.get('simHist', []);
  const pgMax = SIM_N * SIM_PG_PTS;
  mount(`<div class="page narrow">
    <header class="phead"><div class="kicker">Simulasi ujian</div><h1>Latihan ujian ${SIM_MIN} menit</h1><p class="lead">${SIM_N} PG (${pgMax} poin) + 3 essay (40 poin), semuanya essay konsep/kasus. Dikerjakan di kertas, lalu nilai sendiri pakai rubrik langkah.</p></header>
    <section class="card"><div class="fmt-list plain">
      <div><span class="num">${SIM_N}</span><span><b>Pilihan ganda — ${SIM_PG_PTS} poin/soal</b><small>${Object.keys(SIM_MIX).map(w => 'W' + w + ' ×' + SIM_MIX[w]).join(' · ')} — acak dari bank ${QZ.length} soal</small></span></div>
      <div><span class="num">3</span><span><b>Essay — 40 poin</b><small>3 essay konsep/kasus dari bank, diacak tiap attempt</small></span></div>
      <div><span class="num">${icon('timer')}</span><span><b>Timer ${SIM_MIN} menit</b><small>Otomatis submit saat waktu habis. Progress tersimpan kalau halaman ditutup.</small></span></div>
    </div><p class="note">${icon('bulb')}<span>Format umum UTS mata kuliah konsep: PG + essay. Bobot poin tebakan wajar — sesuaikan kalau ada bocoran format.</span></p>
    <div class="row center mt"><button class="btn primary lg" id="simgo">${icon('play')} Mulai simulasi</button></div></section>
    ${hist.length ? `<div class="sec-h mt-l"><h2>Riwayat</h2></div><div class="card hist">${hist.slice().reverse().map(h => `<div class="hrow"><span>${new Date(h.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span><span>PG ${h.pg}/${pgMax}</span><span>Essay ${fmt(h.es, 1)}/40</span><b>${fmt(h.total, 1)}</b></div>`).join('')}</div>` : ''}
  </div>`);
  $('#simgo').onclick = () => { const s = newSim(); Store.set('sim', s); simRun(s); };
}
function simSave(st) { Store.set('sim', st); }
function simRun(st) {
  const N = st.pg.length;
  mount(`<div class="page sim">
    <div class="simbar"><div class="timer" id="stimer">--:--</div><div class="sim-prog" id="sprog"></div><button class="btn primary sm" id="ssub">Kumpulkan</button></div>
    <div class="sim-grid"><div id="sq"></div><aside class="card snav"><div class="label">Navigasi soal</div><div class="sgrid" id="sgrid"></div><div class="legend"><span><i class="lg-a"></i>dijawab</span><span><i class="lg-f"></i>ditandai</span></div><button class="btn ghost sm full" id="sexit">Keluar & simpan</button></aside></div>
  </div>`);
  function answered() { return Object.keys(st.ans).length; }
  function grid() {
    $('#sgrid').innerHTML = st.pg.map((id, i) => `<button class="${i === st.cur ? 'on ' : ''}${st.ans[i] != null ? 'a ' : ''}${st.flag[i] ? 'f' : ''}" data-i="${i}">${i + 1}</button>`).join('') + st.essays.map((e, j) => `<button class="es ${N + j === st.cur ? 'on' : ''}" data-i="${N + j}">K${j + 1}</button>`).join('');
    $$('#sgrid button').forEach(b => { b.onclick = () => { st.cur = +b.dataset.i; simSave(st); q(); }; });
    $('#sprog').innerHTML = `<span>${answered()}/${N} PG dijawab</span><div class="bar"><i style="width:${answered() / N * 100}%"></i></div>`;
  }
  function q() {
    const i = st.cur;
    if (i < N) {
      const Q = QMAP[st.pg[i]], ord = st.ord[i];
      $('#sq').innerHTML = `<article class="card qcard"><div class="row between"><span class="kicker">Soal ${i + 1} dari ${N} · ${SIM_PG_PTS} poin</span><button class="btn ghost sm ${st.flag[i] ? 'flagged' : ''}" id="sflag">${icon('flag')} ${st.flag[i] ? 'Ditandai' : 'Tandai'}</button></div>
        <div class="qtext">${qText(Q)}</div><div class="opts">${ord.map((oi, j) => `<button class="opt ${st.ans[i] === oi ? 'sel' : ''}" data-oi="${oi}"><span class="ol">${LETTERS[j]}</span><span class="ot">${esc(Q.opts[oi])}</span></button>`).join('')}</div>
        <div class="row between mt"><button class="btn ghost" id="sprev" ${i === 0 ? 'disabled' : ''}>${icon('chevl')} Sebelumnya</button><button class="btn" id="snext">Berikutnya ${icon('chev')}</button></div></article>`;
      $$('.opt', $('#sq')).forEach(b => { b.onclick = () => { st.ans[i] = +b.dataset.oi; simSave(st); $$('.opt', $('#sq')).forEach(x => x.classList.toggle('sel', x === b)); grid(); }; });
      $('#sflag').onclick = () => { st.flag[i] = !st.flag[i]; simSave(st); q(); };
    } else {
      const j = i - N, E = st.essays[j];
      $('#sq').innerHTML = `<article class="card qcard"><div class="row between"><span class="kicker">Essay ${j + 1} · ${ES_LABEL[E.type] || ''} · ${fmt(SIM_ES_PTS, 1)} poin</span></div>
        <div class="soal">${soalHTML(E.ex.soal)}</div><p class="note">${icon('pen')}<span>Kerjakan di kertas dengan langkah lengkap. Pembahasan & rubrik muncul setelah kamu kumpulkan.</span></p>
        <div class="row between mt"><button class="btn ghost" id="sprev">${icon('chevl')} Sebelumnya</button><button class="btn" id="snext" ${j === st.essays.length - 1 ? 'disabled' : ''}>Berikutnya ${icon('chev')}</button></div></article>`;
    }
    const pv = $('#sprev'), nx = $('#snext');
    if (pv) pv.onclick = () => { st.cur = Math.max(0, st.cur - 1); simSave(st); q(); };
    if (nx) nx.onclick = () => { st.cur = Math.min(N + st.essays.length - 1, st.cur + 1); simSave(st); q(); };
    grid();
  }
  function tick() {
    const left = st.start + st.dur - Date.now();
    if (left <= 0) { clearInterval(tm); finish(); return; }
    const m = Math.floor(left / 60000), s = Math.floor(left % 60000 / 1000);
    const el = $('#stimer'); if (!el) return;
    el.textContent = `${m}:${String(s).padStart(2, '0')}`;
    el.classList.toggle('warn', left < 10 * 60000);
  }
  function finish() { st.status = 'grade'; st.end = Date.now(); simSave(st); simGrade(st); }
  const tm = setInterval(tick, 1000); onDispose(() => clearInterval(tm)); tick();
  $('#ssub').onclick = async () => {
    const un = N - answered();
    const ok = await modal(`<h3>Kumpulkan jawaban?</h3><p>${un ? `<b>${un} soal PG belum dijawab.</b> ` : ''}Setelah dikumpulkan, jawaban tidak bisa diubah.</p>`, [{ label: 'Batal', value: false }, { label: 'Kumpulkan', value: true, primary: true }]);
    if (ok) { clearInterval(tm); finish(); }
  };
  $('#sexit').onclick = () => { location.hash = '#/'; };
  q();
}
function simGrade(st) {
  const N = st.pg.length;
  let right = 0;
  st.pg.forEach((id, i) => { if (st.ans[i] === QMAP[id].ans) right++; });
  const PGP = st.pgPts || SIM_PG_PTS, ESP = st.esPts || SIM_ES_PTS;
  const pgScore = right * PGP;
  const esScore = () => st.essays.reduce((s, E, j) => { const r = st.rub[j] || {}; const c = Object.keys(r).filter(k => r[k]).length; return s + c / E.ex.steps.length * ESP; }, 0);
  const mins = Math.round(((st.end || Date.now()) - st.start) / 60000);
  mount(`<div class="page narrow">
    <header class="phead"><div class="kicker">Hasil simulasi ujian</div><h1>Nilai kamu</h1><p class="lead">Waktu pengerjaan ${mins} menit.</p></header>
    <section class="card result"><div class="sc-row"><div><small>PG</small><b>${pgScore}</b><span>/${N * PGP}</span></div><div><small>Essay</small><b id="ess">0</b><span>/${fmt(st.essays.length * ESP, 0)}</span></div><div class="tot"><small>Total</small><b id="tot">0</b><span>/100</span></div></div>
      <p class="muted center">PG dinilai otomatis (${right}/${N} benar). Nilai essay: centang langkah yang kamu tulis dengan benar di kertas.</p></section>
    <div class="sec-h mt-l"><h2>Studi kasus — nilai sendiri</h2></div>
    ${st.essays.map((E, j) => `<section class="card rubric" data-j="${j}"><div class="row between"><div class="label">Essay ${j + 1} · ${ES_LABEL[E.type] || ''}</div><span class="tag" id="rs${j}"></span></div><div class="soal sm">${soalHTML(E.ex.soal)}</div>
      <div class="rsteps">${E.ex.steps.map((s, k) => `<label class="rstep"><input type="checkbox" data-k="${k}" ${st.rub[j] && st.rub[j][k] ? 'checked' : ''}><span class="rb"><span class="step-t">${k + 1}. ${esc(s.title)}</span>${s.rows && s.rows.length ? tableHTML(s.rows, 'sm') : ''}${s.tex ? `<span class="step-math">${tex(s.tex, true)}</span>` : ''}</span></label>`).join('')}</div>${answerHTML(E.ex.answer)}</section>`).join('')}
    <div class="sec-h mt-l"><h2>Review PG</h2><span class="muted sm">${right} benar · ${N - right} salah/kosong</span></div>
    ${st.pg.map((id, i) => { const Q = QMAP[id], ok = st.ans[i] === Q.ans; return `<details class="card rev"><summary><span class="${ok ? 'okc' : 'noc'}">${icon(ok ? 'check' : 'x')}</span><span>${i + 1}. ${esc(Q.q[0]).slice(0, 110)}${Q.q[0].length > 110 ? '…' : ''}</span></summary><div class="qtext">${qText(Q)}</div><div class="opts">${optsHTML(Q, st.ord[i], st.ans[i] == null ? -1 : st.ans[i], true)}</div>${whyHTML(Q)}</details>`; }).join('')}
    <div class="row center mt-l"><button class="btn" id="sdone">Simpan nilai & selesai</button><button class="btn primary" id="snew">${icon('refresh')} Simulasi baru</button></div>
  </div>`);
  function upd() {
    st.essays.forEach((E, j) => { const r = st.rub[j] || {}; const c = Object.keys(r).filter(k => r[k]).length; $('#rs' + j).textContent = `${fmt(c / E.ex.steps.length * ESP, 1)} / ${fmt(ESP, 1)}`; });
    const es = esScore(); $('#ess').textContent = fmt(es, 1); $('#tot').textContent = fmt(pgScore + es, 1);
  }
  $$('.rubric').forEach(sec => { const j = +sec.dataset.j; $$('input', sec).forEach(cb => { cb.onchange = () => { st.rub[j] = st.rub[j] || {}; st.rub[j][cb.dataset.k] = cb.checked; simSave(st); upd(); }; }); });
  const save = () => { if (st.saved) return; const h = Store.get('simHist', []); h.push({ at: Date.now(), pg: pgScore, es: esScore(), total: pgScore + esScore() }); Store.set('simHist', h.slice(-20)); st.saved = true; };
  $('#sdone').onclick = () => { save(); Store.set('sim', null); location.hash = '#/uts'; };
  $('#snew').onclick = () => { save(); const s = newSim(); Store.set('sim', s); simRun(s); };
  upd();
}