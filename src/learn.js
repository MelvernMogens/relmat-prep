/* ================= HOME ================= */
function Home() {
  const seen = Store.get('seen', {});
  const nSeen = TOPICS.reduce((a, t) => a + t.examples.filter(e => seen[e.id]).length, 0);
  const qt = quizTotals();
  const hist = Store.get('simHist', []);
  const best = hist.length ? Math.max.apply(null, hist.map(x => x.total)) : null;
  const last = Store.get('last');
  const lastT = last && T[(last.match(/#\/t\/([\w-]+)/) || [])[1]];
  const nConcept = Object.values(F).filter(f => f.kind === 'concept').length, nFormula = Object.keys(F).length - nConcept;
  const CORR = (D.extra && D.extra.corrections) || [];
  mount(`<div class="page home">
    <section class="hero">
      <div class="kicker">${icon('grad')} Relationship Marketing · Week 1–7</div>
      <h1>Belajar dari kasus,<br><span class="hl">langkah demi langkah.</span></h1>
      <p class="lead">Materi Relationship Marketing (Prasetiya Mulya) W1–W7 disusun jadi <b>kasus → pengerjaan → jawaban → konsep yang dipakai</b>. Fokus: framework RM, customer life cycle, value, experience, satisfaction, bonding.</p>
      <div class="row hero-cta">
        <a class="btn primary" href="${lastT ? last : '#/t/' + TOPICS[0].id}">${icon('play')} ${lastT ? 'Lanjut: ' + esc(lastT.title) : 'Mulai dari Week 1'}</a>
        <a class="btn" href="#/uts">${icon('timer')} Simulasi ujian</a>
      </div>
      <div class="stats">
        <div class="stat"><b>${nSeen}<small>/${TOTAL_EX}</small></b><span>contoh sudah dibahas</span></div>
        <div class="stat"><b>${qt.n ? Math.round(qt.r / qt.n * 100) + '%' : '–'}</b><span>akurasi latihan PG</span></div>
        <div class="stat"><b>${best != null ? Math.round(best) : '–'}</b><span>skor simulasi terbaik</span></div>
      </div>
      <button class="resetlink" id="resetp">${icon('refresh')} Reset progress</button>
    </section>

    ${QZ.some(q => q.src === 'dosen') ? `<section class="card fmt leak">
      <div class="row between"><div class="label red">${icon('flag')} Latihan dari dosen — prioritas #1</div><span class="tag red">bocoran UTS</span></div>
      <div class="fmt-list">
        <a href="#/latihan?d=1"><span class="num">${QZ.filter(q => q.src === 'dosen').length}</span><span><b>PG asli dosen (5 opsi A–E)</b><small>kunci + pembahasan kenapa benar & kenapa pengecoh salah</small></span>${icon('chev')}</a>
        <a href="#/essay/teori"><span class="num">E</span><span><b>Essay teori</b><small>3 soal persis dari dosen + 4 prediksi · jawaban model per poin rubrik</small></span>${icon('chev')}</a>
        <a href="#/essay/dosen"><span class="num">∑</span><span><b>Essay hitungan: kedai kopi & Chitosi</b><small>negative ratio + RFM kuintil tanpa kalkulator, langkah demi langkah + soal acak serupa</small></span>${icon('chev')}</a>
      </div>
      <p class="note">${icon('bulb')}<span>Pola UTS kemungkinan: PG konsep & kasus W1–W7, essay teori (definisi → bandingkan → contoh → integrasi), dan essay hitung (rating → % → negative ratio; Recency → kuintil (urutkan, n/5 per skor) → kode RFM → segmen → persona → program).</span></p>
    </section>` : ''}

    <section class="card fmt">
      <div class="row between"><div class="label">${icon('target')} Peta belajar</div><span class="tag">alur course dosen</span></div>
      <div class="flow">${['Brand question', 'Acquire', 'Clean', 'Explore', 'Segment', 'Diagnose', 'Recommend'].map((s, i) => `<span class="fl"><b>${i + 1}</b>${s}</span>`).join('')}</div>
      <div class="fmt-list">
        <a href="#/w/5"><span class="num">R</span><span><b>RFM — bagian hitungan terbesar</b><small>Week 5 · recency, skor quintile, kode, grid, segmen</small></span>${icon('chev')}</a>
        <a href="#/essay"><span class="num">K</span><span><b>Studi kasus bergaya ujian</b><small>RFM, cleaning data, persona & theme-sentiment · kerjakan di kertas</small></span>${icon('chev')}</a>
      </div>
      <p class="note">${icon('bulb')}<span>Strategi: pahami alur 1→7 dulu (tiap week = satu tahap), kuasai hitungan RFM + weighted audit score, lalu latihan PG per week dan tutup dengan simulasi.</span></p>
    </section>

    <div class="sec-h mt-l"><h2>Materi per week</h2><a href="#/materi">Semua topik ${icon('chev')}</a></div>
    <div class="weeks">${WEEKS.map(weekCard).join('')}</div>

    <div class="sec-h mt-l"><h2>Latihan</h2></div>
    <div class="grid2">
      <a class="lcard" href="#/latihan"><span class="lc-ic blue">${icon('list')}</span><b>Pilihan ganda</b><small>${QZ.length} soal · pembahasan tiap soal</small></a>
      <a class="lcard" href="#/essay"><span class="lc-ic amber">${icon('pen')}</span><b>Studi kasus</b><small>${ES_KEYS.reduce((a, k) => a + T[ES_TOPIC[k]].examples.length, 0)} kasus + soal RFM acak tak terbatas</small></a>
      <a class="lcard" href="#/hafalan"><span class="lc-ic green">${icon('cards')}</span><b>Kartu hafalan</b><small>${nConcept} konsep + ${nFormula} rumus</small></a>
      <a class="lcard" href="#/uts"><span class="lc-ic red">${icon('timer')}</span><b>Simulasi ujian</b><small>${SIM_N} PG + ${SIM_ES.length} essay · timer ${SIM_MIN} menit</small></a>
    </div>

    ${CORR.length ? `<section class="card corr mt-l">
      <div class="label red">${icon('alert')} Salah di slide / kunci — sudah dikoreksi</div>
      <p class="muted">Dicek ulang dengan Python. Di app ini semua pakai angka yang benar.</p>
      <div class="corr-list">${CORR.map(c => `<a href="${c[2]}"><b>${esc(c[0])}</b><span>${c[1]}</span></a>`).join('')}</div>
    </section>` : ''}
  </div>`);
  $('#resetp').onclick = async () => {
    const ok = await modal('<h3>Reset semua progress?</h3><p>Semua tanda "sudah dibahas", riwayat latihan PG, kartu hafalan, dan riwayat simulasi akan dihapus. Tidak bisa dibatalkan.</p>', [{ label: 'Batal', value: false }, { label: 'Reset', value: true, primary: true }]);
    if (!ok) return;
    ['seen', 'qs', 'known', 'simHist', 'sim', 'last'].forEach(k => Store.set(k, undefined));
    try { localStorage.removeItem('relmat.v1'); } catch (e) {}
    REVEAL.clear();
    refreshTree();
    Home();
  };
}
function weekCard(w) {
  const p = weekProgress(w);
  return `<a class="wcard" href="#/w/${w.n}"><div class="wnum">W${w.n}</div><div class="wbody"><div class="wtitle">${esc(w.title)}</div><div class="wmeta">${w.topics.length} topik · ${p.tot} contoh${PRIO_W[w.n] ? ` <span class="tag red">${PRIO_W[w.n]}</span>` : ''}</div><div class="bar"><i style="width:${p.pct}%"></i></div></div>${icon('chev', 'go')}</a>`;
}

/* ================= MATERI / WEEK ================= */
function topicRow(t) {
  const p = topicProgress(t);
  const qn = QZ.filter(q => q.topic === t.id).length;
  const st = p.d === p.n ? 'done' : p.d ? 'part' : '';
  return `<a class="trow" href="#/t/${t.id}"><span class="tstat ${st}">${p.d === p.n ? icon('check') : p.d ? p.d + '/' + p.n : ''}</span><span class="tmain"><span class="ttl">${esc(t.title)}${PRIO_T[t.id] ? ` <span class="tag red">${PRIO_T[t.id]}</span>` : ''}</span><span class="tsub">${esc(t.sub)}</span><span class="tcnt">${p.n} contoh · ${t.formulas.length} konsep${qn ? ' · ' + qn + ' PG' : ''}${t.widgets.length ? ' · lab' : ''}</span></span>${icon('chev', 'go')}</a>`;
}
function Materi() {
  mount(`<div class="page">
    <header class="phead"><div class="kicker">Materi</div><h1>Semua topik W1–W7</h1><p class="lead">${TOPICS.length} topik · ${TOTAL_EX} contoh soal. Tanda centang hijau = semua contoh di topik itu sudah kamu buka pembahasannya.</p></header>
    ${WEEKS.map(w => `<section class="sec"><div class="sec-h"><h2><span class="wb lg">W${w.n}</span> ${esc(w.title)}</h2>${PRIO_W[w.n] ? `<span class="tag red">${PRIO_W[w.n]}</span>` : ''}</div><div class="tlist">${w.topics.map(topicRow).join('')}</div></section>`).join('')}
    <section class="sec"><div class="sec-h"><h2><span class="wb lg es">KS</span> Studi kasus</h2></div><div class="tlist">${ES_KEYS.map(k => { const t = T[ES_TOPIC[k]]; return `<a class="trow" href="#/essay/${k}"><span class="tstat es">${icon('pen')}</span><span class="tmain"><span class="ttl">${esc(t.title)}</span><span class="tsub">${esc(t.sub)}</span><span class="tcnt">${t.examples.length} kasus${GEN[k] ? ' + soal acak tak terbatas' : ''}</span></span>${icon('chev', 'go')}</a>`; }).join('')}</div></section>
  </div>`);
}
function Week(n) {
  const w = WEEKS.find(x => x.n === n);
  if (!w) return location.replace('#/materi');
  const p = weekProgress(w);
  const pw = WEEKS.find(x => x.n === n - 1), nw = WEEKS.find(x => x.n === n + 1);
  mount(`<div class="page">
    <nav class="crumb"><a href="#/materi">Materi</a>${icon('chev')}<span>Week ${n}</span></nav>
    <header class="phead"><div class="kicker">Week ${n}</div><h1>${esc(w.title)}</h1><p class="lead">${esc(w.sub)}</p>
      <div class="wprog"><div class="bar"><i style="width:${p.pct}%"></i></div><span class="muted sm">${p.done} dari ${p.tot} contoh sudah dibahas</span></div>
      <div class="row mt"><a class="btn primary" href="#/t/${w.topics[0].id}">${icon('play')} Mulai topik 1</a><a class="btn" href="#/latihan?w=${n}">${icon('list')} Latihan PG Week ${n}</a></div>
    </header>
    <div class="tlist">${w.topics.map(topicRow).join('')}</div>
    <footer class="tnav">${pw ? `<a class="tn" href="#/w/${pw.n}"><small>${icon('chevl')} Week ${pw.n}</small><span>${esc(pw.title)}</span></a>` : '<span></span>'}${nw ? `<a class="tn next" href="#/w/${nw.n}"><small>Week ${nw.n} ${icon('chev')}</small><span>${esc(nw.title)}</span></a>` : `<a class="tn next" href="#/essay"><small>Lanjut ${icon('chev')}</small><span>Studi kasus</span></a>`}</footer>
  </div>`);
}

/* ================= TOPIC ================= */
function Topic(id, exIdx) {
  const t = T[id];
  if (!t || t.wk.n > 7) return location.replace('#/materi');
  Store.set('last', '#/t/' + id);
  const i = TOPICS.indexOf(t), prev = TOPICS[i - 1], next = TOPICS[i + 1];
  const qn = QZ.filter(q => q.topic === t.id).length;
  const nEx = t.examples.length;
  const jumps = [['sec-ex', `Contoh (${nEx})`], ['sec-rm', `Konsep (${t.formulas.length})`]];
  if (t.tables && t.tables.length) jumps.push(['sec-tb', `Tabel (${t.tables.length})`]);
  if (t.traps.length || t.tips.length) jumps.push(['sec-tr', 'Jebakan & tips']);
  if (t.widgets.length) jumps.push(['sec-lab', 'Lab interaktif']);
  mount(`<div class="page topic">
    <nav class="crumb"><a href="#/materi">Materi</a>${icon('chev')}<a href="#/w/${t.wk.n}">Week ${t.wk.n}</a>${icon('chev')}<span>${esc(t.title)}</span></nav>
    <header class="thead">
      <div class="kicker">Week ${t.wk.n} · ${esc(t.wk.title)}${PRIO_T[t.id] ? ` <span class="tag red">${PRIO_T[t.id]}</span>` : ''}</div>
      <h1>${esc(t.title)}</h1><p class="lead">${esc(t.sub)}</p>
      <div class="jump">${jumps.map(j => `<button class="chip" data-jump="${j[0]}">${j[1]}</button>`).join('')}</div>
    </header>
    <section class="card inti"><div class="label">${icon('bulb')} Inti materi</div><ul>${t.intro.map(li => `<li>${esc(li)}</li>`).join('')}</ul>${(t.slides && t.slides.length) ? `<div class="slideshow inti-slides">${t.slides.map(sl => SLIDES[sl] ? `<figure class="slidefig"><img src="${SLIDES[sl]}" alt="Slide ${sl}" decoding="async"><figcaption>Slide asli dosen — ${sl.replace('-', '.')}</figcaption></figure>` : '').join('')}</div>` : ''}</section>

    <section class="sec" id="sec-ex">
      <div class="sec-h"><h2>Contoh kasus</h2><span class="muted sm">soal → pengerjaan → jawaban → konsep</span></div>
      <div class="extabs" role="tablist">${t.examples.map((e, j) => `<button class="extab" data-j="${j}" role="tab"><span>${j + 1}</span><em>${esc(e.title)}</em></button>`).join('')}</div>
      <div id="exbox"></div>
    </section>

    <section class="sec" id="sec-rm">
      <div class="sec-h"><h2>Konsep & rumus</h2><a href="#/rumus">Bank konsep ${icon('chev')}</a></div>
      <div class="fgrid">${t.formulas.map(f => formulaCard(f, false)).join('')}</div>
    </section>
    ${t.tables && t.tables.length ? `<section class="sec" id="sec-tb"><div class="sec-h"><h2>Tabel ringkas dari slide</h2></div>${t.tables.map(tb => `<div class="card tcard"><div class="label">${icon('list')} ${esc(tb.title)}</div>${tableHTML(tb.rows)}</div>`).join('')}</section>` : ''}

    ${(t.traps.length || t.tips.length) ? `<section class="sec" id="sec-tr"><div class="sec-h"><h2>Jebakan & tips</h2></div>
      ${t.traps.map(x => `<div class="callout trap">${icon('alert')}<div><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div></div>`).join('')}
      ${t.tips.map(x => `<div class="callout tip">${icon('bulb')}<div><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div></div>`).join('')}</section>` : ''}

    ${t.widgets.length ? `<section class="sec" id="sec-lab"><div class="sec-h"><h2>Lab interaktif</h2><span class="muted sm">geser & lihat hasilnya</span></div>${t.widgets.map(w => `<div class="card lab" data-widget="${w}"></div>`).join('')}</section>` : ''}

    ${qn ? `<a class="cta-quiz" href="#/latihan?t=${t.id}"><span class="lc-ic blue">${icon('list')}</span><span><b>Latihan PG topik ini</b><small>${qn} soal pilihan ganda dengan pembahasan</small></span>${icon('chev', 'go')}</a>` : ''}

    <footer class="tnav">${prev ? `<a class="tn" href="#/t/${prev.id}"><small>${icon('chevl')} Sebelumnya</small><span>${esc(prev.title)}</span></a>` : '<span></span>'}${next ? `<a class="tn next" href="#/t/${next.id}"><small>Berikutnya ${icon('chev')}</small><span>${esc(next.title)}</span></a>` : `<a class="tn next" href="#/essay"><small>Lanjut ${icon('chev')}</small><span>Studi kasus</span></a>`}</footer>
  </div>`);

  const box = $('#exbox');
  const seenTabs = () => { const s = Store.get('seen', {}); $$('.extab').forEach(b => b.classList.toggle('seen', !!s[t.examples[+b.dataset.j].id])); };
  const show = (j, scroll) => {
    $$('.extab').forEach(b => { const on = +b.dataset.j === j; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
    renderExample(box, t.examples[j], { index: j, total: nEx, onNext: j + 1 < nEx ? () => show(j + 1, true) : null, onDone: seenTabs });
    history.replaceState(null, '', `#/t/${t.id}/${j}`);
    Store.set('last', `#/t/${t.id}/${j}`);
    if (scroll) $('#sec-ex').scrollIntoView({ behavior: smooth(), block: 'start' });
  };
  $$('.extab').forEach(b => { b.onclick = () => show(+b.dataset.j, false); });
  $$('[data-jump]').forEach(b => { b.onclick = () => $('#' + b.dataset.jump).scrollIntoView({ behavior: smooth(), block: 'start' }); });
  seenTabs();
  show(Math.min(exIdx || 0, nEx - 1), false);
  if (exIdx) requestAnimationFrame(() => $('#sec-ex').scrollIntoView({ block: 'start' }));
  mountWidgets();
}
function mountWidgets(root) {
  $$('[data-widget]', root || document).forEach(el => {
    const fn = Widgets[el.dataset.widget];
    if (!fn) { el.remove(); return; }
    try { const d = fn(el); if (d) onDispose(d); } catch (e) { console.error('widget', el.dataset.widget, e); el.innerHTML = '<p class="muted">Lab gagal dimuat.</p>'; }
  });
}
