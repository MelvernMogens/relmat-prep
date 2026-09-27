"""Verifikasi simplifikasi: bandingkan blok DSL (git HEAD vs working tree).
Blok = unit (header @q/@why/@soal/@step/@answer/@check/@end + isi).
Harusnya hanya blok 'why' (quiz) / 'soal','step','answer' (kasus_teori) yang beda isi.
Opsi (baris - / +) dan @check TIDAK BOLEH berubah sama sekali."""
import subprocess, sys, collections

FILES = ['quiz_w1.md','quiz_w2.md','quiz_w3.md','quiz_w4.md','quiz_w6.md','quiz_w7.md','kasus_teori.md']
BASE = 'content/'

def blocks(text):
    """Pecah jadi list (kind, [lines]). kind = tag pembuka blok."""
    out = []
    cur_kind, cur = None, []
    mode = None
    for raw in text.splitlines():
        s = raw.rstrip()
        st = s.strip()
        if st.startswith('@'):
            tag = st[1:].split(' ', 1)[0]
            if tag in ('q','why','soal','step','answer','check','end','uses','slide'):
                # tutup blok sebelumnya
                if cur is not None:
                    out.append((cur_kind, cur))
                if tag == 'end':
                    out.append(('end', ['@end']))
                    cur_kind, cur = None, None
                else:
                    cur_kind, cur = tag, [s]
                continue
            out.append(('other:'+tag, [s]))
            cur_kind, cur = 'cont:'+tag, [s]
            continue
        if cur is None:
            cur_kind, cur = 'top', []
        cur.append(s)
    if cur is not None:
        out.append((cur_kind, cur))
    return out

ok = True
for f in FILES:
    head = subprocess.run(['git','show','HEAD:'+BASE+f], capture_output=True, text=True).stdout
    if not head:
        print(f'{f}: (belum ada di HEAD / belum diubah)'); continue
    now = open(BASE+f).read()
    bh, bn = blocks(head), blocks(now)
    # bandingkan sebagai dict berurutan: pakai diff posisi sederhana via difflib pada tuple kind
    import difflib
    sm = difflib.SequenceMatcher(a=[ (k,'\n'.join(v)) for k,v in bh ],
                                  b=[ (k,'\n'.join(v)) for k,v in bn ])
    changed_kinds = collections.Counter()
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            continue
        for k, _ in bh[i1:i2]:
            changed_kinds['-'+k] += 1
        for k, _ in bn[j1:j2]:
            changed_kinds['+'+k] += 1
    print(f'{f}:', dict(changed_kinds) if changed_kinds else 'TIDAK BERUBAH')

# cek keras: baris opsi & @check tidak boleh beda
for f in FILES:
    head = subprocess.run(['git','show','HEAD:'+BASE+f], capture_output=True, text=True).stdout
    if not head:
        continue
    now = open(BASE+f).read()
    def keep(t):
        out = []
        mode = None
        for l in t.splitlines():
            s = l.strip()
            if s.startswith('@q'): mode='q'; continue
            if s.startswith('@why'): mode='why'; continue
            if s.startswith('@'): mode=None; continue
            if mode=='q' and (s.startswith('- ') or s.startswith('+ ')):
                out.append(s)
        return out
    kh, kn = keep(head), keep(now)
    if kh != kn:
        ok = False
        print(f'!!! {f}: OPSI BERUBAH — HENTIKAN')
    def checks(t):
        return [l.strip() for l in t.splitlines() if l.strip().startswith('@check')]
    if checks(head) != checks(now):
        ok = False
        print(f'!!! {f}: @CHECK BERUBAH — HENTIKAN')

print('OPSICHECK-OK' if ok else 'OPSICHECK-FAIL')
