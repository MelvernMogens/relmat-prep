# CONTENT-SPEC — Brand Analytics study app (FROZEN contract)

App: single-file offline study web app for the course **Brand Analytics (Prasetiya Mulya, 2026), Week 1–7**, for an Indonesian student preparing for the exam. Content is written in a line-based DSL in `content/*.md`, parsed + VERIFIED by `python3 build/parse.py` (build FAILS on any error). Whoever changes this contract edits this file.

## Voice & learning format (non-negotiable — the user rejected weaker versions before)
- Language: **Bahasa Indonesia santai-jelas** (bukan gaul berlebihan). Istilah teknis tetap English (Recency, data dictionary, unit of analysis…) + penjelasan Indonesia.
- The student learns from **worked cases**, not theory walls. Every example = SOAL (story, self-contained, all data shown) → PENGERJAAN step by step (each step: judul + penjelasan KENAPA) → JAWABAN → konsep yang dipakai.
- Every number must be traceable: never let a number "appear from nowhere". Show where it comes from.
- Stick to the slides' content (source text in `src_txt/week*.txt`, image transcriptions in `src_txt/images_notes.md`). Do not invent frameworks the lecturer didn't teach. You MAY invent fictional Indonesian brands/datasets for new practice cases (e.g. "Kopi Nusa", "Batik Rasa", "SkinLab") as long as they apply the lecturer's framework.
- If a slide has an error, say so explicitly in a `@trap` ("Slide tertulis X, yang benar Y karena Z").

## DSL (line based; field separator is ` :: ` with spaces)
```
@week N :: Judul week :: satu kalimat ringkasan
@topic <id> :: Judul topik :: satu kalimat ringkasan
@intro                      ← following lines starting with "- " = bullet "inti materi" (4–8 bullets)
@concept <key> :: Judul konsep :: definisi 1–2 kalimat
@vars                       ← following lines "istilah :: arti" (the parts / dimensions / criteria of the concept)
@formula <key> :: Judul :: <LaTeX>      ← ONLY for real math (RFM, weighted score, %). Followed by @vars "symbol :: meaning"
@table Judul tabel          ← following lines are rows "| a | b | c |"; FIRST row = header
@trap Judul :: teks          ← common mistake / slide error
@tip Judul :: teks
@widget <name>               ← only names that exist: rfm, rfmquick, audit, clean  (ask orchestrator before using)
@example Judul contoh :: Sumber
@soal                        ← following lines = problem text. Lines starting "|" = data table (first row header). "(a) ..." = sub-question. "• " = bullet.
@step Judul langkah :: penjelasan kenapa :: <LaTeX optional>
   continuation lines after a @step:  "| a | b |" = table rows for this step (first row header);  "$ <latex>" = extra math line;  any other text = extra explanation paragraph
@answer teks jawaban final (one paragraph; use (a) (b) (c) to separate parts)
@uses key1, key2             ← concept/formula keys used (must exist somewhere; any week)
@check <python expr> ~ <expected number>     ← numeric check (tolerance from decimals of expected)
@check <python expr> == <python literal>     ← exact check (strings, ints)
@end
```
- Lines starting with `#` are comments. Blank lines are ignored (inside @soal they separate paragraphs).
- `Sumber` tag conventions: `Slide W3 · Mini case`, `Latihan W5 · Workshop`, `Kasus latihan` (new case you wrote), `UTS-style`.
- Keys are lowercase-with-dashes, prefixed by week: `w3-dq-dimensions`. Must be globally unique.
- Every @example needs ≥3 @step, an @answer, and ≥1 @uses. Every number that you computed needs a @check.
- `@check` namespace: python math functions + `NB` (NusaBean RFM data, see build/rfm.json: `NB['C']['CUST004']['M']`).

## Quiz file (`content/quiz.md`)
```
@q <week> :: <topic-id> :: <key1, key2 (optional)>
Teks soal (boleh beberapa baris; boleh baris "| a | b |" untuk tabel data)
- opsi salah
+ opsi benar          ← exactly 4 options, exactly 1 "+"
- opsi salah
- opsi salah
@why
Penjelasan kenapa jawaban benar DAN kenapa pengecoh salah (2–4 baris).
@check ...            ← if numeric
@end
```
Distractors must be plausible (the typical student mistakes listed in slides: pakai GrossSales, recency dibalik, menyamakan review dengan customer, causal claim dari chart, dll).

## FROZEN topic ids (use exactly these; `@q` must reference one of them)
| week | id | judul |
|---|---|---|
| 1 | w1-ba | Apa itu Brand Analytics |
| 1 | w1-equity | Brand Equity (Aaker) |
| 1 | w1-bigdata | Big Data dalam Branding (Marr, Netflix, Walmart) |
| 2 | w2-source | Sumber Data Brand (1st/2nd/public, platform fit) |
| 2 | w2-listening | Social Listening & Sentiment Coding |
| 2 | w2-audit | Data-Source Audit & Weighted Score |
| 2 | w2-sample | Sampling & Unit of Analysis |
| 2 | w2-doc | Data Dictionary, Provenance & Etika |
| 3 | w3-clean | Data Cleaning & Quality Dimensions |
| 3 | w3-struct | Struktur Data: Raw/Clean/Derived/Flag, Dictionary, DQ Log |
| 3 | w3-detect | Deteksi Masalah Data (missing, duplikat, kategori, teks, tanggal, angka, outlier) |
| 3 | w3-transform | Transformasi & Excel (mapping, tanggal, rule template, quality check) |
| 4 | w4-eda | Exploratory Data Analysis |
| 4 | w4-metrics | Descriptive Metrics (frekuensi, distribusi, cross-tab, tren) |
| 4 | w4-viz | Visualisasi yang Jujur (chart choice, integrity, storytelling) |
| 4 | w4-sentiment | Preliminary Sentiment & Interpretation Ladder |
| 5 | w5-concept | Konsep RFM |
| 5 | w5-calc | Menghitung & Skor RFM |
| 5 | w5-segment | Segmen RFM, Grid & Strategi |
| 5 | w5-case | Workshop NusaBean Coffee Club |
| 6 | w6-cluster | Clustering (K-Means & Hierarchical) |
| 6 | w6-persona | Dari Segmen ke Persona |
| 6 | w6-strategy | Strategic Response, Brand Equity & Severity-Urgency |
| 7 | w7-prep | Text Preprocessing & Theme Coding |
| 7 | w7-sentiment | Sentiment by Theme & Validasi |
| 7 | w7-assoc | Brand-Association Network & Social Listening Issues |
| 9 | es-rfm | Kasus: Hitung RFM & Rekomendasi |
| 9 | es-clean | Kasus: Diagnosis & Cleaning Data |
| 9 | es-persona | Kasus: Persona, Theme-Sentiment & Strategi |

File ownership: `w1.md w2.md w3.md` → @content · `w4.md w6.md w7.md` → @research · `quiz.md kasus.md` (kasus.md holds `@week 9 :: Studi Kasus` with topics es-clean + es-persona) → @analyst · `w5.md` + es-rfm → orchestrator. Do NOT edit files you don't own.

## Verified numbers you may reuse (already checked in Python — do not recompute differently)
- W2 audit weighted score, weights Relevance 25 / Access 15 / Coverage 15 / Quality 15 / Context 10 / Bias 10 / Privacy 10 (%). Scores (Google, Instagram, Tokopedia, X): Relevance 5,4,4,3 · Access 4,4,4,3 · Coverage 5,4,4,3 · Quality 4,3,5,3 · Context 4,5,4,4 · Bias 3,3,4,3 · Privacy 4,3,4,3. Correct weighted scores: **Google 4.30, Instagram 3.75, Tokopedia 4.15, X 3.10**. The slide prints 4.20 / 3.75 / 4.20 / 3.15 → slide is WRONG for Google, Tokopedia, X (only Instagram matches). Conclusion still holds (Google & Tokopedia strongest) but Google alone is highest.
- W2 running data Kopi Nusa: 120 records → 68 positive (56.7%), 22 neutral (18.3%), 30 negative (25.0%).
- W4 frequency table: Delivery delay 42 (30%), Staff attitude 31 (22%), App problem 26 (19%), Price concern 19 (14%) → implies N = 140 coded mentions (42/140 = 30%); 4 themes total 118, so 22 mentions (≈16%) are "other". Delivery + staff = 73/140 = 52.1% (slide says "51%" — rounding of 30%+22%≈52%, flag gently).
- W4 distribution: mean 3.9, median 4.0, low-star 18%, high-star 62%.
- W4 cross-tab (row %): Google 54/21/25, Instagram 68/19/13, E-commerce 43/18/39, CS chat 31/24/45 (Pos/Neu/Neg).
- W6 persona table (slide p.25): 10 customers, RFM_Score = R+F+M (SUM, range 3–15), segment rule implied: ≥12 Champion, 9 Loyal Customer, 6 At Risk, ≤4 Lost/Need Attention.
- W5 NusaBean: see build/rfm.json (orchestrator owns).
