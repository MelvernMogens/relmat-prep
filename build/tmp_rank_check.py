#!/usr/bin/env python3
"""Verify rank->score computations for quiz_w5 distractor design."""
import json, math

ROOT = '/Users/melvernmogens/Code/brand-analytics-prep'
nb = json.load(open(f'{ROOT}/content/data/nusabean.json'))
C = nb['C']

def score(rank, n):
    return 6 - math.ceil(rank / n * 5)

# --- Tie M: CUST019 M=417.68 ---
Mvals = [C[c]['M'] for c in C]
m = 417.68
rank = 1 + sum(1 for v in Mvals if v > m)
print('M sorted desc:', sorted(Mvals, reverse=True))
print('rank of 417.68 =', rank, '-> score', score(rank, 20))

# --- F=6 rank (CUST002, CUST013) ---
Fvals = [C[c]['F'] for c in C]
f = 6
rank_f = 1 + sum(1 for v in Fvals if v > f)
print('F sorted desc:', sorted(Fvals, reverse=True))
print('rank of F=6 =', rank_f, '-> score', score(rank_f, 20))

# --- n=5 grid of scores for ranks 1..5 ---
print('n=5:', [score(r, 5) for r in range(1, 6)])
# --- n=8 grid of scores for ranks 1..8 ---
print('n=8:', [score(r, 8) for r in range(1, 9)])
# --- n=10 ---
print('n=10:', [score(r, 10) for r in range(1, 11)])
# --- n=20 ---
print('n=20:', [score(r, 20) for r in range(1, 21)])

# --- Tebak Kopi: recency ranking with ties (scenario in Q13) ---
# recencies: 12, 40, 40, 61, 75  (rank ascending, small=1)
rec = [12, 40, 40, 61, 75]
for v in rec:
    r = 1 + sum(1 for x in rec if x < v)
    print(f'recency {v}: rank {r} -> R score {score(r, 5)}')
# spends: 150, 150, 280, 380, 540 (rank desc, big=1)
sp = [150, 150, 280, 380, 540]
for v in sp:
    r = 1 + sum(1 for x in sp if x > v)
    print(f'spend {v}: rank {r} -> M score {score(r, 5)}')

# --- Q7 RANK.EQ tie: values 10,9,9,8,8,7,7,7,6,6,5,5,4,4,3,3,2,2,2,1 ---
freqs = [10, 9, 9, 8, 8, 7, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 1]
for v in [7, 6, 5]:
    r = 1 + sum(1 for x in freqs if x > v)
    print(f'F={v}: rank {r} -> score {score(r, 20)}')

# --- Kopi Rasa rank->score with n=8 (mini case Q10) ---
# invoices: B1 8, B2 6, B3 6, B4 3, B5 2, B6 1, B7 7, B8 5
inv = [8, 6, 6, 3, 2, 1, 7, 5]
for v in sorted(set(inv), reverse=True):
    r = 1 + sum(1 for x in inv if x > v)
    print(f'B: F={v}: rank {r} -> score {score(r, 8)}')

# --- NB assertions for @check lines ---
print('NB CUST004:', C['CUST004']['R'], C['CUST004']['F'], round(C['CUST004']['M'], 2), C['CUST004']['code'])
print('NB CUST010 code/tot/seg:', C['CUST010']['code'], C['CUST010']['tot'], C['CUST010']['seg'])
print('NB CUST019 seg:', C['CUST019']['seg'], 'M:', C['CUST019']['M'])
print('NB CUST009 seg:', C['CUST009']['seg'])
print('NB CUST020 seg:', C['CUST020']['seg'])
print('top4sum pct:', round(nb['top4sum'] / nb['total'] * 100, 1))
print('loyal M:', nb['SEG']['Loyal Customers']['M'], 'n:', nb['SEG']['Loyal Customers']['n'])
print('CLT M:', nb["SEG"]["Can't Lose Them"]['M'])
print('ref:', nb['ref'])
print('CUST004 G-M:', round(C['CUST004']['G'] - C['CUST004']['M'], 2))
print('total/20:', round(nb['total'] / 20, 2))
print('loyal avg:', round(nb['SEG']['Loyal Customers']['M'] / 4, 2))
print('CLT avg:', round(nb["SEG"]["Can't Lose Them"]['M'] / 2, 2))

# FM values
for c in ['CUST001', 'CUST016', 'CUST019', 'CUST005', 'CUST009', 'CUST010']:
    print(c, 'fm=', C[c]['fm'], 'r=', C[c]['r'], 'seg=', C[c]['seg'])

# Recency days cross-month checks
import datetime
def days(a, b):
    d1 = datetime.date.fromisoformat(a)
    d2 = datetime.date.fromisoformat(b)
    return (d2 - d1).days
print('12 May -> 30 Jun:', days('2026-05-12', '2026-06-30'))
print('29 Jul -> 19 Aug:', days('2026-07-29', '2026-08-19'))
print('14 Jun -> 19 Aug:', days('2026-06-14', '2026-08-19'))
print('23 Apr -> 15 Jun:', days('2026-04-23', '2026-06-15'))
print('18 Aug -> 19 Aug:', days('2026-08-18', '2026-08-19'))
