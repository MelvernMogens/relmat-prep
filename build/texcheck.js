// Render every LaTeX string in content.json with the same fixTex+KaTeX as the app. Exit 1 on any error.
const fs = require('fs'), path = require('path');
global.window = {}; global.document = undefined;
const katex = (0, eval)(fs.readFileSync(path.join(__dirname, '..', 'assets', 'katex.min.js'), 'utf8') + ';katex');
const core = fs.readFileSync(path.join(__dirname, '..', 'src', 'core.js'), 'utf8');
const fixSrc = core.match(/function fixTex\(s\) \{.*\}/)[0];
const fixTex = (0, eval)('(' + fixSrc.replace('function fixTex', 'function') + ')');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));
const errs = []; let n = 0;
const chk = (s, where) => { if (!s) return; n++; try { katex.renderToString(fixTex(s), { displayMode: true, throwOnError: true, strict: 'ignore' }); } catch (e) { errs.push(where + ': ' + e.message.slice(0, 160)); } };
d.weeks.forEach(w => w.topics.forEach(t => {
  t.formulas.forEach(f => { chk(f.tex, t.id + '/' + f.key); f.vars.forEach(v => { if (/\\/.test(v.sym)) chk(v.sym, t.id + '/' + f.key + ' var'); }); });
  t.examples.forEach((e, i) => e.steps.forEach((s, j) => chk(s.tex, `${t.id} ex${i + 1} step${j + 1}`)));
}));
console.log(`tex strings=${n} errors=${errs.length}`);
errs.forEach(e => console.log('  ✗', e));
process.exit(errs.length ? 1 : 0);
