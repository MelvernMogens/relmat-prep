# Relationship Marketing — Belajar dari Kasus

Study app interaktif untuk mata kuliah **Relationship Marketing** (Prasetiya Mulya, Dr. Eka Ardianto): contoh kasus yang dibedah langkah demi langkah, bank konsep & rumus, latihan PG dengan pembahasan, essay dengan rubrik, dan simulasi ujian ber-timer.

**Live:** https://melvernmogens.github.io/relmat-prep/

## Cakupan materi

| Week | Topik | Status |
|---|---|---|
| W1 | The Framework of Relationship Marketing | ✅ |
| W2 | Managing Customer Life Cycle | ✅ |
| W3 | Managing Customer Value | ✅ |
| W4 | Managing Customer Experience | ✅ |
| W5 | — | ❌ slide tidak tersedia |
| W6 | Managing Customer Satisfaction | ✅ |
| W7 | Managing Customer Bonding | ✅ |

Total: 30 topik, 63 contoh kasus step-reveal, 57 kartu rumus/konsep, 84 soal PG, 7 essay, 1 simulasi ujian (30 PG + 3 essay, 120 menit).

## Kenapa

Slide kuliah isinya framework + diagram; yang bikin paham adalah melihat framework itu *dipakai* pada kasus. Tiap contoh mengikuti urutan **soal → pengerjaan (dengan alasan tiap langkah) → jawaban → konsep yang dipakai**, dan tidak ada angka yang muncul tanpa asal-usul.

## Struktur repo

```
relmat-prep/
├── content/            # SEMUA KONTEN — sumber kebenaran app
│   ├── w1.md … w7.md   # materi per week (DSL, lihat bawah)
│   ├── quiz_w*.md      # bank soal PG per week
│   ├── kasus_teori.md  # bank essay + rubrik (dipakai simulasi)
│   └── corrections.json# catatan koreksi (opsional)
├── src/                # engine SPA (jangan disentuh kecuali perlu)
│   ├── core.js         # router, store, render contoh/konsep
│   ├── learn.js        # halaman Beranda + Materi
│   ├── practice.js     # quiz, essay, simulasi ujian
│   ├── widgets.js      # lab interaktif
│   ├── boot.js         # bootstrap
│   └── style.css
├── assets/             # font + KaTeX (di-embed saat build)
├── build/
│   ├── parse.py        # DSL → content.json + jalankan @check
│   ├── build.py        # inline semuanya → out/index.html
│   ├── texcheck.js     # render semua LaTeX, gagal kalau rusak
│   └── deploy.sh       # push out/ ke branch gh-pages
├── docs/CONTENT-SPEC.md# spec DSL (kontrak untuk penulis konten)
├── sources/            # PPTX dosen (gitignore — JANGAN commit)
├── src_txt/            # transkrip slide hasil vision (gitignore)
└── out/index.html      # hasil build (gitignore, di-publish ke gh-pages)
```

## Format konten (DSL)

Konten ditulis di `content/*.md` pakai tag per baris — build gagal kalau satu angka salah:

```
@week 6 :: Managing Customer Satisfaction
@topic w6-blueprint :: Service Blueprint :: deskripsi singkat topik
@intro               # bullet poin kunci
@formula key :: Judul :: \text{rumus LaTeX}
@vars               # arti tiap variabel
@concept key :: Judul :: definisi      # kartu hafalan
@trap Judul :: miskonsepsi yang dihindari
@example Judul contoh :: Kelompok tag
@soal               # teks soal (tabel pakai baris | … |)
@step Judul :: alasan langkah :: LaTeX opsional
@answer             # jawaban final ringkas
@uses key1, key2    # rumus/konsep yang dipakai (wajib ≥1)
@check <python> ~ <hasil>   # verifikasi angka otomatis
@end
```

File quiz (`quiz_w*.md`) pakai format `@q / opsi + (pengecoh) / - (benar) / @why / @check / @end`. Detail lengkap: `docs/CONTENT-SPEC.md`.

## Cara kerja build

```
content/*.md  (DSL)
      │
      ▼
build/parse.py   ── jalankan semua @check (Python) ── GAGAL kalau 1 angka salah
      │
      ▼
build/build.py   ── inline JS/CSS/KaTeX/font ──► out/index.html (1 file, offline)
      │
      ▼
build/texcheck.js ── render semua LaTeX (KaTeX) ── GAGAL kalau 1 rumus rusak
node --check build/_app.js ── syntax gate
```

## Menambah / mengubah konten

1. Edit file di `content/` (atau tambah `quiz_w5.md` begitu slide W5 tersedia).
2. `uv run python build/parse.py` — harus `ALL CHECKS PASS`.
3. `uv run python build/build.py && node --check build/_app.js && node build/texcheck.js`
4. `bash build/deploy.sh` — build + push ke `gh-pages`, live ±40 detik.

Butuh `uv` (Python) + Node. Tanpa bundler, tanpa dependency npm.

## Build lokal (tanpa deploy)

```bash
uv run python build/build.py
cd out && python3 -m http.server 8796   # buka http://127.0.0.1:8796/
```

## QA & verifikasi

- Semua angka contoh diverifikasi `@check` Python saat build (92 check aktif).
- Audit independen: 84/84 jawaban PG dicek silang ke transkrip slide; 7 temuan atribusi (istilah textbook vs isi slide) sudah diperbaiki.
- Mobile-first: audit overflow 390px = 0 di semua halaman.
- Progress belajar disimpan `localStorage relmat.v1` (tombol Reset di Beranda).

## Batasan jujur

- W5 tidak dibuat karena slide-nya tidak tersedia.
- Format simulasi ujian (30 PG + 3 essay, 120 menit) adalah tebakan wajar — belum ada bocoran format UTS.
- Beberapa slide resolusinya rendah; bagian yang direkonstruksi ditandai eksplisit di konten ("interpretasi", "disusun sendiri"), bukan dianggap isi slide.
- Materi slide milik dosen/Prasetiya Mulya; ini ringkasan belajar pribadi — PPTX asli sengaja tidak di-commit.

## Stack

Vanilla JS SPA (hash router, localStorage), KaTeX + font di-embed sebagai data-URI — satu file HTML jalan offline. Fork dari engine [brand-analytics-prep](https://github.com/MelvernMogens/brand-analytics-prep).
