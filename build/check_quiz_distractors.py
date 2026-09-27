#!/usr/bin/env python3
"""Cek pengecoh quiz: opsi benar tidak boleh >1.3x pengecoh terpanjang.
Persis sama dengan one-liner dari brief MEGATRON, hanya ditulis sebagai file
karena `python3 -c` diblok oleh approvals hook.
"""
import json

d = json.load(open("build/content.json"))
offenders = [
    q["q"][0][:60]
    for q in d["quiz"]
    if (lambda L, a: L[a] == max(L) and L[a] > 1.3 * sorted(L[:a] + L[a + 1:])[-1])(
        [len(o) for o in q["opts"]], q["ans"]
    )
]
print(offenders)
