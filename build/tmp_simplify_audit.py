import re, sys, json

# Audit bahasa bank soal: hitung kalimat panjang & pasif-akademik per blok DSL.
# Dipakai untuk memutuskan apa yang perlu disederhanakan (brief @growth 28 Sep).
files = ['quiz_w1.md', 'quiz_w2.md', 'quiz_w3.md', 'quiz_w4.md', 'quiz_w6.md', 'quiz_w7.md', 'kasus_teori.md']
BASE = '/Users/melvernmogens/Code/relmat-prep/content/'

report = {}
for f in files:
    lines = open(BASE + f).read().splitlines()
    mode = None
    blocks = {'q': [], 'why': [], 'soal': [], 'step': [], 'answer': []}
    for i, l in enumerate(lines, 1):
        s = l.strip()
        if s.startswith('@q '):
            mode = 'q'; continue
        if s.startswith('@why'):
            mode = 'why'; continue
        if s.startswith('@soal'):
            mode = 'soal'; continue
        if s.startswith('@step'):
            mode = 'step'; continue
        if s.startswith('@answer'):
            mode = 'answer'; continue
        if s.startswith('@end'):
            mode = None; continue
        if s.startswith('@'):
            continue
        if not s or s.startswith('#') or s.startswith('|'):
            continue
        if mode in blocks:
            blocks[mode].append((i, s))
    out = {}
    for m, items in blocks.items():
        if not items:
            continue
        wcs = [len(t.split()) for _, t in items]
        out[m] = {
            'n_lines': len(items),
            'avg_words': round(sum(wcs) / len(wcs), 1),
            'max_words': max(wcs),
            'over40w': [(ln, len(t.split()), t[:70]) for ln, t in items if len(t.split()) > 40],
        }
    report[f] = out

print(json.dumps(report, ensure_ascii=False, indent=1))
