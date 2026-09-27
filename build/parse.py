#!/usr/bin/env python3
"""Parse content/*.md (DSL) -> build/content.json, and VERIFY every @check.

DSL (line based, separator ' :: '):
  @week N :: Title :: subtitle
  @topic id :: Title :: one-line summary
  @intro            (following '- ' lines = bullets)
  @formula key :: Title :: latex
  @vars             (following 'sym :: meaning' lines)
  @trap Title :: text
  @tip Title :: text
  @widget name
  @example Title :: source
  @soal             (following lines = problem text, until next @)
  @step Title :: explanation :: latex(optional)
  @answer text
  @uses key1, key2
  @check <python expr> ~ <expected literal>   (tolerance from decimals of expected)
  @end

Quiz file (quiz.md):
  @q <week> :: <topic-id> :: <uses keys>
  question text lines
  - wrong option
  + correct option
  @why   (following lines = explanation lines)
  @check ...
  @end
"""
import json, math, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content'
OUT = ROOT / 'build' / 'content.json'

SAFE = {k: getattr(math, k) for k in dir(math) if not k.startswith('_')}
SAFE.update(abs=abs, round=round, min=min, max=max, sum=sum, pow=pow, len=len, sorted=sorted, int=int, str=str, list=list)
NBF = ROOT / 'content' / 'data' / 'nusabean.json'
SAFE['NB'] = {}
SAFE['math'] = math
LKF = ROOT / 'content' / 'data' / 'nonexistent.json'
SAFE['LK'] = json.loads(LKF.read_text()) if LKF.exists() else {}
G = {'__builtins__': {}, **SAFE}

errors = []
nchecks = 0


def check(expr, where):
    global nchecks
    if '==' in expr and '~' not in expr.split('==')[-1]:
        lhs, rhs = expr.split('==', 1)
        try:
            got = eval(lhs, G); exp = eval(rhs, G)
        except Exception as e:
            errors.append(f'{where}: eval error {e!r} in {expr}'); return
        nchecks += 1
        if got != exp:
            errors.append(f'{where}: CHECK FAIL {lhs.strip()} = {got!r}, expected {rhs.strip()}')
        return
    if '~' not in expr:
        errors.append(f'{where}: bad @check (no ~ or ==): {expr}')
        return
    lhs, rhs = expr.rsplit('~', 1)
    rhs = rhs.strip()
    try:
        got = eval(lhs, G)
        exp = eval(rhs, G)
    except Exception as e:
        errors.append(f'{where}: eval error {e!r} in {expr}')
        return
    m = re.search(r'\.(\d+)', rhs)
    dec = len(m.group(1)) if m and re.fullmatch(r'-?[\d.]+', rhs) else 0
    tol = 0.5 * 10 ** (-dec) + 1e-9 if dec else 1e-6 * max(1, abs(exp))
    nchecks += 1
    if abs(got - exp) > tol:
        errors.append(f'{where}: CHECK FAIL {lhs.strip()} = {got!r}, expected {rhs} (tol {tol})')


def row(line):
    return [c.strip() for c in line.strip().strip('|').split('|')]


def split(s, n):
    parts = [p.strip() for p in s.split(' :: ')]
    while len(parts) < n:
        parts.append('')
    return parts


def parse_topics(path):
    weeks = []
    week = topic = ex = None
    mode = None  # which multiline block we're filling
    for ln, raw in enumerate(path.read_text().splitlines(), 1):
        line = raw.rstrip()
        where = f'{path.name}:{ln}'
        if line.startswith('@'):
            tag, _, rest = line[1:].partition(' ')
            rest = rest.strip()
            mode = None
            if tag == 'week':
                n, title, sub = split(rest, 3)
                week = dict(n=int(n), title=title, sub=sub, topics=[])
                weeks.append(week)
            elif tag == 'topic':
                tid, title, sub = split(rest, 3)
                topic = dict(id=tid, title=title, sub=sub, week=week['n'], intro=[], formulas=[],
                             traps=[], tips=[], widgets=[], examples=[], tables=[], slides=[])
                week['topics'].append(topic)
                ex = None
            elif tag == 'intro':
                mode = 'intro'
            elif tag in ('formula', 'concept'):
                key, title, body = split(rest, 3)
                f = dict(key=key, title=title, vars=[], kind=tag)
                if tag == 'formula': f['tex'] = body
                else: f['tex'] = ''; f['def'] = body
                topic['formulas'].append(f)
            elif tag == 'table':
                topic['tables'].append(dict(title=rest, rows=[]))
                mode = 'table'
            elif tag == 'vars':
                mode = 'vars'
            elif tag in ('trap', 'tip'):
                t, txt = split(rest, 2)
                topic[tag + 's'].append(dict(title=t, text=txt))
            elif tag == 'widget':
                topic['widgets'].append(rest)
            elif tag == 'example':
                title, src = split(rest, 2)
                ex = dict(title=title, src=src, soal=[], steps=[], answer='', uses=[], slides=[])
                topic['examples'].append(ex)
            elif tag == 'soal':
                mode = 'soal'
            elif tag == 'step':
                t, why, tex = split(rest, 3)
                ex['steps'].append(dict(title=t, why=why, tex=tex, rows=[], notes=[]))
                mode = 'step'
            elif tag == 'answer':
                ex['answer'] = rest
                mode = 'answer'
            elif tag == 'uses':
                ex['uses'] = [u.strip() for u in rest.split(',') if u.strip()]
            elif tag == 'slide':
                for sl in rest.split(','):
                    sl = sl.strip().lower().replace('slide ', '')
                    if not sl:
                        continue
                    if not re.fullmatch(r'w\d+-\d+', sl):
                        errors.append(f'{where}: bad slide key {sl!r} (expect w4-06)')
                    elif not (ROOT / 'assets' / 'slides' / f'{sl}.jpg').exists():
                        errors.append(f'{where}: unknown slide {sl} (no assets/slides/{sl}.jpg)')
                    elif ex is not None:
                        ex['slides'].append(sl)
                    elif topic is not None:
                        topic['slides'].append(sl)
                    else:
                        errors.append(f'{where}: @slide outside @topic/@example')
            elif tag == 'check':
                check(rest, where)
            elif tag == 'end':
                ex = None
            else:
                errors.append(f'{where}: unknown tag @{tag}')
            continue
        if not line.strip():
            if mode == 'soal' and ex and ex['soal'] and ex['soal'][-1] != '':
                ex['soal'].append('')
            continue
        if line.lstrip().startswith('#'):
            continue
        if mode == 'intro':
            topic['intro'].append(line.lstrip('- ').strip())
        elif mode == 'vars':
            sym, meaning = split(line.strip(), 2)
            topic['formulas'][-1]['vars'].append(dict(sym=sym, meaning=meaning))
        elif mode == 'soal':
            ex['soal'].append(line.strip())
        elif mode == 'table':
            topic['tables'][-1]['rows'].append(row(line))
        elif mode == 'step':
            st = ex['steps'][-1]
            L = line.strip()
            if L.startswith('|'):
                st['rows'].append(row(L))
            elif L.startswith('$ '):
                st['tex'] = (st['tex'] + r' \\ ' + L[2:].strip()) if st['tex'] else L[2:].strip()
            else:
                st['notes'].append(L)
        elif mode == 'answer':
            ex['answer'] += ' ' + line.strip()
        else:
            errors.append(f'{where}: stray text: {line[:60]}')
    return weeks


def parse_quiz(path):
    qs = []
    q = None
    mode = None
    for ln, raw in enumerate(path.read_text().splitlines(), 1):
        line = raw.rstrip()
        where = f'{path.name}:{ln}'
        if line.startswith('@'):
            tag, _, rest = line[1:].partition(' ')
            rest = rest.strip()
            if tag == 'q':
                wk, tid, uses = split(rest, 3)
                q = dict(id=f'q{len(qs)+1}', week=int(wk), topic=tid,
                         uses=[u.strip() for u in uses.split(',') if u.strip()],
                         q=[], opts=[], ans=-1, why=[])
                qs.append(q)
                mode = 'q'
            elif tag == 'why':
                mode = 'why'
            elif tag == 'check':
                check(rest, where)
            elif tag == 'end':
                mode = None
            else:
                errors.append(f'{where}: unknown quiz tag @{tag}')
            continue
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        if mode == 'q':
            if line.startswith('+ ') or line.startswith('- '):
                if line[0] == '+':
                    if q['ans'] != -1:
                        errors.append(f'{where}: two correct options')
                    q['ans'] = len(q['opts'])
                q['opts'].append(line[2:].strip())
            else:
                q['q'].append(line.strip())
        elif mode == 'why':
            q['why'].append(line.strip())
    for q in qs:
        nopt = 5 if 'dosen' in path.name else 4
        q['src'] = 'dosen' if 'dosen' in path.name else ''
        if q['ans'] < 0 or len(q['opts']) != nopt:
            errors.append(f"quiz {q['id']} ({q['q'][:1]}): needs {nopt} options + exactly 1 correct (got {len(q['opts'])}, ans={q['ans']})")
        if len(set(q['opts'])) != len(q['opts']):
            errors.append(f"quiz {q['id']}: duplicate options")
    return qs


def main():
    weeks = []
    for f in sorted(CONTENT.glob('w*.md')) + sorted(CONTENT.glob('kasus*.md')) + [f for f in [CONTENT / 'essay.md'] if f.exists()]:
        weeks += parse_topics(f)
    merged = {}
    for w in weeks:
        if w['n'] in merged:
            merged[w['n']]['topics'] += w['topics']
        else:
            merged[w['n']] = w
    weeks = sorted(merged.values(), key=lambda w: w['n'])
    for w in weeks:
        for t in w['topics']:
            t['week'] = w['n']
    quiz = []
    for qf in sorted(CONTENT.glob('quiz*.md')):
        quiz += parse_quiz(qf)
    import hashlib
    for q in quiz:
        q['id'] = 'q' + hashlib.md5((str(q['week']) + '|'.join(q['q'])).encode()).hexdigest()[:8]
    if len({q['id'] for q in quiz}) != len(quiz):
        errors.append('duplicate quiz question text')
    extra = json.loads((CONTENT / 'extra.json').read_text()) if (CONTENT / 'extra.json').exists() else {}

    # cross-reference: every @uses key must exist in some formula
    fkeys = {f['key'] for w in weeks for t in w['topics'] for f in t['formulas']}
    for w in weeks:
        for t in w['topics']:
            for e in t['examples']:
                for u in e['uses']:
                    if u not in fkeys:
                        errors.append(f"{t['id']} / {e['title']}: unknown formula key '{u}'")
                if not e['uses']:
                    errors.append(f"{t['id']} / {e['title']}: no @uses")
                if not e['steps']:
                    errors.append(f"{t['id']} / {e['title']}: no steps")
                if not e['answer']:
                    errors.append(f"{t['id']} / {e['title']}: no answer")
    tids = {t['id'] for w in weeks for t in w['topics']}
    for q in quiz:
        for u in q['uses']:
            if u not in fkeys:
                errors.append(f"quiz {q['id']}: unknown formula key '{u}'")
        if q['topic'] not in tids:
            errors.append(f"quiz {q['id']}: unknown topic '{q['topic']}'")

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(dict(weeks=weeks, quiz=quiz, extra=extra), ensure_ascii=False, indent=1))
    nt = sum(len(w['topics']) for w in weeks)
    ne = sum(len(t['examples']) for w in weeks for t in w['topics'])
    nf = len(fkeys)
    print(f'weeks={len(weeks)} topics={nt} examples={ne} formulas={nf} quiz={len(quiz)} checks={nchecks}')
    from collections import Counter
    print('quiz per week:', dict(sorted(Counter(q["week"] for q in quiz).items())))
    if errors:
        print(f'\n{len(errors)} ERROR(S):')
        for e in errors:
            print('  ✗', e)
        sys.exit(1)
    print('ALL CHECKS PASS ✓')


if __name__ == '__main__':
    main()
