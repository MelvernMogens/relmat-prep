/* ================= BOOT ================= */
window.addEventListener('hashchange', route);
window.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const t = $$('.extab'); const i = t.findIndex(b => b.classList.contains('on'));
    if (i < 0) return;
    const n = t[i + (e.key === 'ArrowRight' ? 1 : -1)];
    if (n) { n.click(); e.preventDefault(); }
  } else if (e.key === ' ' || e.key === 'Enter') {
    const b = $('#exbox [data-a="next"], #esbox [data-a="next"]');
    if (b && document.activeElement === document.body) { b.click(); e.preventDefault(); }
  }
});
(function killBadge(){const k=()=>{const f=document.getElementById('nl-badge-frame');if(f)f.remove();};k();if(window.MutationObserver){const mo=new MutationObserver(k);mo.observe(document.body,{childList:true});setTimeout(()=>mo.disconnect(),15000);}})();
buildShell();
route();
