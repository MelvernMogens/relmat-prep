#!/usr/bin/env python3
"""Assemble single-file offline HTML: v2/out/index.html"""
import json, pathlib, subprocess, sys, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / 'build' / 'parse.py')], check=True)
subprocess.run(['node', str(ROOT / 'build' / 'texcheck.js')], check=True)
data = json.loads((ROOT / 'build' / 'content.json').read_text())
corr = ROOT / 'content' / 'corrections.json'
if corr.exists():
    data['extra']['corrections'] = json.loads(corr.read_text())

A = ROOT / 'assets'
S = ROOT / 'src'
fonts = (A / 'fonts-embed.css').read_text()
kcss = (A / 'katex-embed.css').read_text()
kjs = (A / 'katex.min.js').read_text()
css = (S / 'style.css').read_text()
js = '\n'.join((S / f).read_text() for f in ['core.js', 'widgets.js', 'learn.js', 'practice.js', 'boot.js'])

def safe(s):
    return s.replace('</script', '<\\/script').replace('</style', '<\\/style')

data_js = 'window.__DATA__=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';'

html = f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<meta name="robots" content="noindex,nofollow">
<title>Brand Analytics — Belajar dari Kasus</title>
<style>{fonts}</style>
<style>{kcss}</style>
<style>{css}</style>
</head>
<body>
<header class="topbar"><a class="brand" href="#/"><span class="logo">B</span><span>Brand Analytics</span></a><button id="menu-btn" aria-label="Menu"><svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></header>
<aside id="side"><a class="brand" href="#/"><span class="logo">B</span><span>Brand Analytics<small>Prasetiya Mulya · W1–W7</small></span></a><nav id="snav"></nav><div id="side-tree"></div></aside>
<div id="scrim"></div>
<main><div id="view"></div></main>
<nav id="tabbar"></nav>
<script>{safe(kjs)}</script>
<script>{data_js}</script>
<script>{safe(js)}</script>
</body>
</html>'''

out = ROOT / 'out'
out.mkdir(exist_ok=True)
(out / 'index.html').write_text(html)
(out / '.nojekyll').write_text('')
# extract app js for syntax check
(ROOT / 'build' / '_app.js').write_text(js)
print(f'out/index.html  {len(html)/1024:.0f} KB')
