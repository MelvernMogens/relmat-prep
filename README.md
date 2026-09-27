# Relationship Marketing — Belajar dari Kasus

Web app belajar interaktif mata kuliah **Relationship Marketing** (Prasetiya Mulya, Dr. Eka Ardianto): materi W1–W4 & W6–W7 disusun jadi kasus → pengerjaan → jawaban → konsep.

Live: https://melvernmogens.github.io/relmat-prep/

## Isi
- Materi 6 week: framework RM, customer life cycle, customer value, customer experience, customer satisfaction, customer bonding.
- Bank konsep (kartu hafalan) + rumus/model (CLV, satisfaction, loyalty ladder, dll).
- Bank soal PG per week + pembahasan.
- Simulasi ujian: PG + essay dengan rubrik self-grade.

## Struktur
- `content/*.md` — konten pakai DSL (lihat `docs/CONTENT-SPEC.md`); angka diverifikasi `@check` Python saat build.
- `src/` — engine SPA single-file offline (fork dari busmath-prep v2).
- `build/` — parse + build + deploy (`uv run python build/build.py`).
- Slide asli dosen TIDAK di-commit (`sources/`, `src_txt/` di-gitignore).

## Deploy
```bash
uv run python build/build.py && bash build/deploy.sh
```
