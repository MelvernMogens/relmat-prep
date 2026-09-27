#!/usr/bin/env python3
"""Verifikasi khusus dua soal brief MEGATRON di quiz_w5.md + atribusi offender per week.
Tmp — dihapus setelah lapor."""
import json

d = json.load(open("build/content.json"))
print("quiz entry keys:", sorted(d["quiz"][0].keys()))

targets = ["Menurut tabel Step 6", "NusaBean Coffee Club: CUST016"]
for q in d["quiz"]:
    head = q["q"][0]
    if any(head.startswith(t) for t in targets):
        L = [len(o) for o in q["opts"]]
        a = q["ans"]
        max_d = sorted(L[:a] + L[a + 1:])[-1]
        print(f"W{q.get('week','?')} | {head[:55]!r}")
        print(f"   lens={L} ans_idx={a} correct={L[a]} max_distractor={max_d} ratio={L[a]/max_d:.2f}")

print("\nOffender per week:")
per = {}
for q in d["quiz"]:
    L = [len(o) for o in q["opts"]]
    a = q["ans"]
    if L[a] == max(L) and L[a] > 1.3 * sorted(L[:a] + L[a + 1:])[-1]:
        per.setdefault(q.get("week", "?"), []).append(q["q"][0][:40])
for w in sorted(per, key=str):
    print(f"  week {w}: {len(per[w])} soal")
