/* ================= PLOT HELPER ================= */
const COL = { d: '#2563eb', s: '#ea580c', s2: '#ea580c', g: '#16a34a', r: '#dc2626', ink: '#0f172a', mut: '#64748b', grid: '#eef2f7', axis: '#94a3b8', p: '#7c3aed' };
function niceStep(r) { const p = Math.pow(10, Math.floor(Math.log10(r))); const f = r / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; }
function mkPlot(cv, h) {
  const ctx = cv.getContext('2d');
  const pad = { l: 46, r: 14, t: 14, b: 30 };
  const P = { ctx, pad, h };
  P.resize = () => { const dpr = window.devicePixelRatio || 1; P.w = Math.max(260, cv.clientWidth); cv.width = P.w * dpr; cv.height = h * dpr; cv.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  P.set = (x0, x1, y0, y1) => { Object.assign(P, { x0, x1, y0, y1 }); };
  P.X = x => pad.l + (x - P.x0) / (P.x1 - P.x0) * (P.w - pad.l - pad.r);
  P.Y = y => h - pad.b - (y - P.y0) / (P.y1 - P.y0) * (h - pad.t - pad.b);
  P.clear = (xl, yl) => {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, P.w, h);
    ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
    const sx = niceStep((P.x1 - P.x0) / 7), sy = niceStep((P.y1 - P.y0) / 6);
    ctx.lineWidth = 1;
    for (let x = Math.ceil(P.x0 / sx) * sx; x <= P.x1 + 1e-9; x += sx) { ctx.strokeStyle = COL.grid; ctx.beginPath(); ctx.moveTo(P.X(x), pad.t); ctx.lineTo(P.X(x), h - pad.b); ctx.stroke(); ctx.fillStyle = COL.mut; ctx.textAlign = 'center'; ctx.fillText(fmt(x, 2), P.X(x), h - pad.b + 15); }
    for (let y = Math.ceil(P.y0 / sy) * sy; y <= P.y1 + 1e-9; y += sy) { ctx.strokeStyle = COL.grid; ctx.beginPath(); ctx.moveTo(pad.l, P.Y(y)); ctx.lineTo(P.w - pad.r, P.Y(y)); ctx.stroke(); ctx.fillStyle = COL.mut; ctx.textAlign = 'right'; ctx.fillText(fmt(y, 2), pad.l - 6, P.Y(y) + 4); }
    ctx.strokeStyle = COL.axis; ctx.lineWidth = 1.2;
    if (P.y0 <= 0 && P.y1 >= 0) { ctx.beginPath(); ctx.moveTo(pad.l, P.Y(0)); ctx.lineTo(P.w - pad.r, P.Y(0)); ctx.stroke(); }
    if (P.x0 <= 0 && P.x1 >= 0) { ctx.beginPath(); ctx.moveTo(P.X(0), pad.t); ctx.lineTo(P.X(0), h - pad.b); ctx.stroke(); }
    ctx.fillStyle = COL.ink; ctx.font = '600 11px ' + getComputedStyle(document.body).fontFamily;
    if (xl) { ctx.textAlign = 'right'; ctx.fillText(xl, P.w - pad.r, h - pad.b - 6); }
    if (yl) { ctx.textAlign = 'left'; ctx.fillText(yl, pad.l + 6, pad.t + 10); }
  };
  P.clip = f => { ctx.save(); ctx.beginPath(); ctx.rect(pad.l, pad.t, P.w - pad.l - pad.r, h - pad.t - pad.b); ctx.clip(); f(); ctx.restore(); };
  P.fn = (f, col, lw = 2.2, dash) => P.clip(() => {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath();
    let pen = false; const n = 400;
    for (let i = 0; i <= n; i++) { const x = P.x0 + (P.x1 - P.x0) * i / n, y = f(x); if (!isFinite(y) || Math.abs(y) > 1e7) { pen = false; continue; } pen ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)); pen = true; }
    ctx.stroke(); ctx.setLineDash([]);
  });
  P.seg = (x1, y1, x2, y2, col, lw = 1.2, dash = [4, 4]) => P.clip(() => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(P.X(x1), P.Y(y1)); ctx.lineTo(P.X(x2), P.Y(y2)); ctx.stroke(); ctx.setLineDash([]); });
  P.poly = (pts, fill) => P.clip(() => { ctx.fillStyle = fill; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y))); ctx.closePath(); ctx.fill(); });
  P.dot = (x, y, col, label, pos) => {
    if (x < P.x0 || x > P.x1 || y < P.y0 || y > P.y1) return;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), 4.5, 0, 7); ctx.fill(); ctx.stroke();
    if (label) { ctx.font = '600 11.5px ' + getComputedStyle(document.body).fontFamily; ctx.fillStyle = col; ctx.textAlign = pos === 'l' ? 'right' : 'left'; ctx.fillText(label, P.X(x) + (pos === 'l' ? -8 : 8), P.Y(y) + (pos === 'b' ? 16 : -8)); }
  };
  P.label = (x, y, txt, col, al = 'left') => { ctx.font = '600 11.5px ' + getComputedStyle(document.body).fontFamily; ctx.fillStyle = col; ctx.textAlign = al; ctx.fillText(txt, P.X(x), P.Y(y)); };
  return P;
}
function autoRedraw(el, draw) {
  let raf = 0;
  const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
  const ro = window.ResizeObserver ? new ResizeObserver(go) : null;
  if (ro) ro.observe(el); else window.addEventListener('resize', go);
  go();
  return () => { cancelAnimationFrame(raf); ro ? ro.disconnect() : window.removeEventListener('resize', go); };
}
function sl(id, label, min, max, step, val) { return `<label class="sl"><span class="sl-l">${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}-v">${val}</output></label>`; }
function sv(el, id) { const i = $('#' + id, el); const o = $('#' + id + '-v', el); if (o) o.textContent = fmt(+i.value, 3); return +i.value; }
function segCtl(id, opts, on) { return `<div class="seg sm" id="${id}">${opts.map(o => `<button data-v="${o[0]}" class="${o[0] === on ? 'on' : ''}">${o[1]}</button>`).join('')}</div>`; }
function bindSeg(el, id, cb) { $$('#' + id + ' button', el).forEach(b => { b.onclick = () => { $$('#' + id + ' button', el).forEach(x => x.classList.toggle('on', x === b)); cb(b.dataset.v); }; }); }
function readout(rows) { return `<div class="readout">${rows.map(r => `<div class="ro ${r[2] || ''}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`; }
function legend(items) { return `<div class="plegend">${items.map(i => `<span><i style="background:${i[1]}${i[2] ? ';opacity:.35' : ''}"></i>${i[0]}</span>`).join('')}</div>`; }

/* ================= WIDGETS ================= */
const GRID_CELLS = [
  ["Can't Lose Them", "Can't Lose Them", 'Loyal Customers', 'Loyal Customers', 'Champions'],
  ['Hibernating', 'Hibernating', 'Needs Attention', 'Potential Loyalist', 'Recent Users'],
  ['Lost', 'Lost', 'About To Sleep', 'Promising', 'Price Sensitive']];
const SEG_COL = { 'Champions': '#16a34a', 'Loyal Customers': '#2563eb', 'Potential Loyalist': '#0891b2', 'Recent Users': '#0d9488', 'Promising': '#65a30d', 'Price Sensitive': '#ca8a04', 'Needs Attention': '#d97706', 'About To Sleep': '#ea580c', "Can't Lose Them": '#dc2626', 'Hibernating': '#9333ea', 'Lost': '#64748b' };
/* NusaBean raw → RFM with switchable definitions (replicates workshop Excel) */
function nbCompute(opt) {
  const raw = NB.raw, ref = opt.today ? '2026-09-30' : NB.ref;
  const refD = Date.parse(ref);
  const by = {};
  raw.forEach(r => { const c = by[r[1]] = by[r[1]] || { id: r[1], last: '', inv: 0, units: 0, net: 0, gross: 0 }; if (r[2] > c.last) c.last = r[2]; c.inv++; c.units += r[4]; c.net += r[8]; c.gross += r[7]; });
  const rows = Object.values(by).sort((a, b) => a.id < b.id ? -1 : 1).map(c => ({ id: c.id, lastISO: c.last, R: Math.round((refD - Date.parse(c.last)) / 864e5), F: opt.units ? c.units : c.inv, M: Math.round((opt.gross ? c.gross : c.net) * 100) / 100 }));
  rfmCompute(rows, rows.length);
  return { rows, ref };
}
function segTable(rows) {
  const tot = rows.reduce((a, r) => a + r.M, 0), by = {};
  rows.forEach(r => { const s = by[r.seg] = by[r.seg] || { n: 0, M: 0 }; s.n++; s.M += r.M; });
  return Object.keys(by).map(s => ({ s, n: by[s].n, M: by[s].M, p: by[s].M / tot * 100 })).sort((a, b) => b.M - a.M);
}
const Widgets = {
  /* Kalkulator skor quintile: ketik nilai → rank → skor */
  rfmscore(el) {
    el.innerHTML = `<div class="lab-h"><b>Kalkulator skor quintile</b><span class="muted sm">Ketik nilai (pisah koma) → lihat rank & skor 1–5</span></div>
      ${segCtl('rsdir', [['R', 'Recency (kecil = bagus)'], ['FM', 'Frequency / Monetary (besar = bagus)']], 'R')}
      <label class="inp"><span>Nilai</span><input id="rsv" type="text" inputmode="decimal" value="0, 6, 14, 21, 29, 1, 17, 4, 38, 11"></label>
      <div id="rsout"></div>`;
    let dir = 'R';
    const draw = () => {
      const v = $('#rsv', el).value.split(/[,;\s]+/).map(Number).filter(x => isFinite(x) && String(x) !== '');
      if (v.length < 2) { $('#rsout', el).innerHTML = '<p class="muted">Isi minimal 2 angka.</p>'; return; }
      const n = v.length, asc = dir === 'R';
      const rows = v.map((x, i) => { const rk = rankEq(v, x, asc); return [String(i + 1), fmt(x, 2), String(rk), fmt(rk / n * 5, 3), String(Math.ceil(Math.round(rk / n * 5 * 1e9) / 1e9)), String(qScore(rk, n))]; });
      $('#rsout', el).innerHTML = `<p class="muted sm">n = ${n}. ${asc ? 'Urut NAIK: nilai terkecil = rank 1' : 'Urut TURUN: nilai terbesar = rank 1'}. Skor = 6 − ROUNDUP(rank/n × 5).</p>` + tableHTML([['#', 'Nilai', 'Rank', 'rank/n×5', 'ROUNDUP', 'Skor'], ...rows], 'sm num');
    };
    bindSeg(el, 'rsdir', v => { dir = v; draw(); });
    $('#rsv', el).addEventListener('input', draw);
    draw();
  },
  /* Grid R × FM: pilih skor → segmen + aksi */
  rfmgrid(el) {
    el.innerHTML = `<div class="lab-h"><b>Grid segmen R × FM</b><span class="muted sm">Pilih skor R, F, M → lihat posisi & segmen</span></div>
      <div class="lab-grid"><div id="gg"></div><div class="lab-ctl">
        ${sl('gr', 'R score', 1, 5, 1, 4)}${sl('gf', 'F score', 1, 5, 1, 5)}${sl('gm', 'M score', 1, 5, 1, 4)}
        <div id="gout"></div></div></div>`;
    const draw = () => {
      const r = sv(el, 'gr'), f = sv(el, 'gf'), m = sv(el, 'gm'), fm = (f + m) / 2, seg = gridSeg(r, fm);
      const row = fm >= 4 ? 0 : fm >= 2.5 ? 1 : 2, col = r - 1;
      $('#gg', el).innerHTML = `<div class="rgrid"><div class="ry">F&amp;M ↑</div>${GRID_CELLS.map((rw, i) => rw.map((s, j) => `<div class="rc ${i === row && j === col ? 'on' : ''}" style="--c:${SEG_COL[s]}"><span>${esc(s)}</span></div>`).join('')).join('')}<div class="rx">${[1, 2, 3, 4, 5].map(x => `<span>R=${x}</span>`).join('')}</div></div>`;
      $('#gout', el).innerHTML = `<div class="lw"><small>FM = (F + M) / 2</small>${tex(`FM = \\tfrac{${f} + ${m}}{2} = ${fmt(fm, 1)}`, true)}</div><div class="lw res"><small>Kode ${r}${f}${m} → segmen</small><b class="segb" style="--c:${SEG_COL[seg]}">${esc(seg)}</b><p class="muted sm">${esc(SEG_ACT[seg])}</p></div>`;
    };
    $$('input', el).forEach(i => i.addEventListener('input', draw));
    draw();
  },
  /* Lab NusaBean: data asli 108 invoice, definisi bisa diubah */
  rfm(el) {
    if (!NB) { el.innerHTML = ''; return; }
    const opt = { gross: false, units: false, today: false };
    el.innerHTML = `<div class="lab-h"><b>Lab NusaBean — RFM dari 108 invoice asli</b><span class="muted sm">Coba definisi yang SALAH → lihat segmen yang berubah</span></div>
      <div class="chips-t"><button class="chip" data-o="gross">Monetary = GrossSales ✗</button><button class="chip" data-o="units">Frequency = unit ✗</button><button class="chip" data-o="today">Referensi = 30-Sep (TODAY) ✗</button></div>
      <div id="nbsum"></div><div id="nbtbl"></div>`;
    const base = nbCompute({});
    const draw = () => {
      const { rows, ref } = nbCompute(opt);
      const changed = rows.filter((r, i) => r.seg !== base.rows[i].seg).length;
      const codeCh = rows.filter((r, i) => r.code !== base.rows[i].code).length;
      const st = segTable(rows);
      $('#nbsum', el).innerHTML = `${readout([['Referensi', ref], ['Customer', rows.length], ['Total M', fmtN(rows.reduce((a, r) => a + r.M, 0))], ['Kode RFM berubah', codeCh ? codeCh + ' customer' : 'tidak ada', codeCh ? 'bad' : 'good'], ['Segmen berubah', changed ? changed + ' customer' : 'tidak ada', changed ? 'bad' : 'good']])}
        <div class="segbars">${st.map(x => `<div class="sbar"><span class="sb-l">${esc(x.s)} <small>(${x.n})</small></span><span class="sb-t"><i style="width:${x.p}%;background:${SEG_COL[x.s]}"></i></span><b>${fmt(x.p, 1)}%</b></div>`).join('')}</div>`;
      $('#nbtbl', el).innerHTML = tableHTML([['Customer', 'Last', 'R', 'F', 'M', 'Kode', 'FM', 'Segmen'], ...rows.map((r, i) => [r.id, r.lastISO.slice(5), r.R, r.F, fmt(r.M, 2), r.code + (r.code !== base.rows[i].code ? ' ⚠' : ''), fmt(r.fm, 1), r.seg + (r.seg !== base.rows[i].seg ? ' ⚠' : '')].map(String))], 'sm num');
    };
    $$('[data-o]', el).forEach(b => { b.onclick = () => { opt[b.dataset.o] = !opt[b.dataset.o]; b.classList.toggle('on', opt[b.dataset.o]); b.classList.toggle('bad', opt[b.dataset.o]); draw(); }; });
    draw();
  }
};

/* ================= HALAMAN DATASET NUSABEAN ================= */
function NBPage() {
  if (!NB) return location.replace('#/');
  const inv = NB.raw;
  mount(`<div class="page">
    <nav class="crumb"><a href="#/w/5">Week 5</a>${icon('chev')}<span>Lab NusaBean</span></nav>
    <header class="phead"><div class="kicker">Workshop RFM · file Excel dosen</div><h1>NusaBean Coffee Club</h1><p class="lead">Retailer kopi omnichannel, 12 minggu transaksi (1-Jun s/d 19-Aug-2026). Semua hasil di bawah dihitung ulang dari data mentah dengan rumus workshop.</p>
      <div class="row mt"><a class="btn" href="#/t/w5-case">${icon('book')} Pembahasan workshop</a><a class="btn" href="#/t/w5-calc">${icon('sigma')} Cara menghitung</a></div></header>
    <div class="card lab" data-widget="rfm"></div>
    <section class="sec"><div class="sec-h"><h2>Data mentah (${inv.length} invoice)</h2><span class="muted sm">cari customer untuk trace</span></div>
      <div class="search">${icon('eye')}<input id="nbq" type="search" placeholder="mis. CUST004" autocomplete="off"></div>
      <div id="nbraw" class="mt"></div></section>
  </div>`);
  const paint = () => {
    const q = ($('#nbq').value || '').trim().toUpperCase();
    const rows = inv.filter(r => !q || r[1].indexOf(q) >= 0 || r[0].indexOf(q) >= 0);
    const net = rows.reduce((a, r) => a + r[8], 0);
    $('#nbraw').innerHTML = (q ? `<p class="muted sm">${rows.length} invoice · total Net ${fmtN(net)}</p>` : '') + tableHTML([['Invoice', 'Customer', 'Tanggal', 'Kategori', 'Qty', 'Diskon', 'Gross', 'Net'], ...rows.map(r => [r[0], r[1], r[2], r[3], r[4], Math.round(r[6] * 100) + '%', fmt(r[7], 2), fmt(r[8], 2)].map(String))], 'sm num');
  };
  $('#nbq').addEventListener('input', paint);
  paint();
  mountWidgets();
}
