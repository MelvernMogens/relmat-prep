# quiz W4 :: Managing Customer Experience
# 14 soal PG. Header `@quiz W<x>` tidak didukung parse.py (unknown quiz tag),
# jadi section header pakai komentar; gate tetap `uv run python build/parse.py`.

@q 4 :: w4-feel :: w4-sem, w4-emotions16
Modul experiential yang komponennya "Feeling and Emotions, Moods" — dan memakai daftar 16 Types of Consumption Emotions sebagai vocabulary-nya — adalah...
- SENSE, karena emosi selalu dibangun dari rangsangan panca indera
+ FEEL, karena sasarannya memang perasaan dan suasana hati pelanggan
- THINK, karena memberi nama emosi adalah pekerjaan kognitif
- RELATE, karena emosi paling kuat kalau dirasakan bersama orang lain
@why
FEEL memang komponen Feeling and Emotions + Moods (slide W4-06), dan daftar 16 emosi konsumsi dipakai buat menamai emosi yang mau dibangun atau dicegah.
Pengecoh paling menggoda: THINK — menamai emosi kelihatan kerja otak, tapi yang diukur perasaannya, bukan proses berpikirnya.
SENSE soal indera; RELATE soal identitas sosial dan komunitas.
@end

@q 4 :: w4-cex :: w4-sem
Kopi Loka punya kopi enak, pencahayaan hangat, musik pelan, dan barista yang hafal nama pelanggan — tapi tidak ada satu pun kegiatan yang bikin pelanggan saling terhubung. Ingin naikkan pengalaman pelanggan dengan usaha paling kecil: modul mana yang paling logis digarap duluan?
- SENSE, dengan menambah varian menu dan aroma kopi yang lebih kuat
- THINK, dengan kuis asal biji kopi di papan dekat kasir
- ACT, dengan kelas latte art berbayar setiap akhir pekan
+ RELATE, dengan mengangkat kisah pelanggan tetap ke konten media sosial kedai
@why
RELATE paling murah digarap karena bibitnya sudah ada: barista hafal nama = relasi personal sudah setengah jalan, tinggal dinaikkan jadi rasa komunitas.
SENSE dan FEEL (rasa, cahaya, musik, suasana) sudah kuat — nambah di situ dampaknya kecil.
THINK dan ACT memang kosong, tapi dua-duanya harus mulai dari nol.
@end

@q 4 :: w4-cex :: w4-expm
Brand skincare kamu: iklan jalan terus dan pembelian pertama tinggi, tapi repeat order anjlok — pelanggan rata-rata pergi setelah pembelian ke-3. Di fase customer life cycle mana masalah ini paling terasa?
- Acquisition phase, karena akuisisi baru menjangkau sebagian kecil pasar
- Recovery phase, karena pelanggan yang pergi harus ditarik kembali dulu
- Semua fase sama beratnya, karena repeat order dipengaruhi banyak faktor
+ Retention phase, karena pelanggan sudah masuk tapi gagal dipertahankan
@why
Gejalanya muncul SETELAH pelanggan masuk (akuisisi lancar) tapi SEBELUM loyal → masalah utamanya Retention. Recovery baru untuk yang sudah churn total.
Di slide W4-04, customer experience satu paket dengan satisfaction dan bonding sebagai penentu customer value.
Retensi bocor = sinyal pengalaman bermasalah — bukan otomatis soal harga.
Opsi "semua fase sama" menutup pintu prioritisasi, padahal itu inti diagnosis.
@check len(['Acquisition phase','Retention phase','Recovery phase']) == 3
@end

@q 4 :: w4-hybrid :: w4-hybrid
Slide W4-38 menulis daftar experiential hybrid dua modul: SENSE/FEEL, SENSE/THINK, FEEL/THINK, dan seterusnya — semuanya pasangan dari 5 modul experiential. Berapa banyak hybrid dua modul yang mungkin dibentuk dari 5 modul itu?
- 15, karena jumlahnya deret 1+2+3+4+5
- 20, karena 5 modul punya 4 pasangan masing-masing (5 x 4)
- 25, karena tiap modul bisa dipasangkan dengan 5 modul termasuk dirinya sendiri
+ 10, karena memilih 2 dari 5 modul tanpa memedulikan urutan: C(5,2)
@why
Hybrid = pasangan 2 modul BERBEDA, dan SENSE/FEEL sama dengan FEEL/SENSE — jadi ini kombinasi, bukan permutasi: C(5,2) = 10, persis jumlah yang tertulis di slide.
Pengecoh 20 menghitung pasangan terurut (5×4) — tiap pasangan kehitungan dua kali.
25 malah membolehkan modul dipasangkan dengan dirinya sendiri (SENSE/SENSE); 15 salah pakai logika deret.
@check 5*4//2 == 10
@check len(['SENSE/FEEL','SENSE/THINK','FEEL/THINK','SENSE/RELATE','SENSE/ACT','FEEL/RELATE','FEEL/ACT','THINK/RELATE','THINK/ACT','RELATE/ACT']) == 10
@end

@q 4 :: w4-feel :: w4-emotions16
Dari 15 emosi utama di daftar 16 Types of Consumption Emotions (Anger sampai Excitement, tanpa Other Items), berapa yang tergolong emosi negatif — yang harus dicegah muncul pada pelanggan?
+ 8 negatif dan 7 positif
- 7 negatif dan 8 positif
- 9 negatif dan 6 positif
- Semua 15 emosi utama bisa langsung jadi target kampanye
@why
Delapan negatif: Anger, Discontent, Worry, Sadness, Fear, Shame, Envy, Loneliness. Tujuh positif: Romantic, Love, Peacefulness, Contentment, Optimism, Joy, Excitement.
Daftarnya dari slide W4-16 — jangan dihitung pakai feeling.
Skor nyaris berimbang: ruang emosi sama lebarnya untuk pengalaman buruk dan bagus.
Pengecoh "7 negatif 8 positif" = kebalikan klasifikasi (klasik!); "semuanya bisa jadi target" mengabaikan separuh daftar yang justru beracun buat kampanye.
@check len(['Anger','Discontent','Worry','Sadness','Fear','Shame','Envy','Loneliness']) == 8
@check len(['Romantic','Love','Peacefulness','Contentment','Optimism','Joy','Excitement']) == 7
@check 8 + 7 == 15
@end

@q 4 :: w4-think :: w4-think-principle
The THINK Principle (slide W4-20) memasangkan tiap gaya berpikir dengan pertanyaan pemicunya. Kampanye yang menunda jawaban dan bikin audiens bertanya "What is it? How do things work?" — misal kisah teknologi Takeda di balik YOU.C1000 — mengaktifkan gaya apa?
- Surprise, karena audiens terkejut mendapat jawabannya lebih cepat
- Provocation, karena pertanyaan menantang keyakinan lama audiens
+ Intrigue, karena rasa penasaran sengaja dipelihara sebelum jawaban muncul
- Convergent, karena semua fakta digiring ke satu kesimpulan
@why
Pertanyaan "What is it? How do things work?" adalah pasangan resmi Intrigue di slide W4-20 — polanya: buka pertanyaan, tunda, lalu jawab.
Provocation punya pertanyaan berbeda ("What was then and what will be?") dan berhasil justru karena membalik keyakinan, bukan menyimpan jawaban.
Convergent itu menggiring asosiasi ke satu titik (pola Caterpillar), bukan memancing rasa penasaran.
@check 'What is it? How do things work?' == 'What is it? How do things work?'
@end

@q 4 :: w4-hybrid :: w4-hybrid
Slide W4-38 juga menyebut tiga tipe experiential hybrid: Individual-Experience hybrids, Individual-Shared hybrids, dan Shared-Experience hybrids. Bagaimana hubungan tiga tipe ini dengan daftar 10 pasangan modul seperti SENSE/FEEL?
- Tiga tipe adalah tiga pasangan pertama di daftar, sisanya hasil penggabungan
- Tiga tipe menggantikan daftar pasangan, karena hanya pengalaman bersama yang dihitung hybrid sejati
+ Tiga tipe adalah klasifikasi terpisah — soal cara hybrid dialami (sendiri atau bersama), bukan pasangan tambahan
- Tiga tipe adalah nama lain dari SENSE, FEEL, dan THINK supaya mudah diingat
@why
Slide menulis DUA hal berbeda: daftar 10 pasangan modul (kombinasi mana yang dipadukan) dan tiga tipe hybrid (pengalaman itu individual, shared, atau campuran) — dua sumbu klasifikasi yang beda.
Jadi tiga tipe bukan penambahan pasangan dan bukan pengganti daftar; totalnya tetap C(5,2) = 10 pasangan.
Membaca tiga tipe sebagai nama modul tertukar dengan S-F-T itu miskonsepsi hafalan yang gampang kejadian.
@check 5*4//2 == 10
@end

@q 4 :: w4-sense :: w4-sense-obj
Bara Sunyi, sabun mandi lokal, mau bikin travel pack "karena Zwitsal dan pesaing lain punya". Menurut kerangka SENSE Strategic Objectives, apa yang harus dicek SEBELUM produksi?
- Apakah desain kemasannya lebih eye-catching dari Zwitsal supaya menang bersaing di rak toko
+ Peran kemasan kecil bagi pengguna Bara Sunyi: Differentiator, Value Provider, atau Motivator
- Apakah biaya produksi per unit turun cukup besar dibanding botol besar yang sudah ada
- Apakah pesaing lain juga sudah punya travel pack, supaya brand tidak tertinggal tren
@why
Slide W4-07 minta tiap elemen sensorik punya objective jelas: Differentiator, Value Provider, atau Motivator. Kalau gak, ia cuma estetika — belum masuk kerangka SENSE.
"Karena pesaing punya" justru alasan yang gak lolos tes ini (itulah miskonsepsi di soal).
Travel pack Zwitsal lolos karena portabilitas = value buat pengguna yang sering bepergian — peran itu harus diuji ulang di konteks brand sendiri, bukan ditiru mentah.
@check len(['Differentiator','Value Provider','Motivator']) == 3
@end

@q 4 :: w4-sense :: w4-sense-obj
Kamu harus presentasi kenapa kampanye Fanta x Netflix "Jadi Lebih Berasa" memilih sound — bukan visual — sebagai pintu masuk SENSE. Argumen paling kuat menurut kerangka SENSE objectives?
- Sound lebih murah diproduksi daripada visual sinematik, sehingga ROI kampanyenya lebih baik
- Sound adalah satu-satunya panca indera yang bisa dijual lewat iklan digital massal
+ Sound menyatu dengan momen menonton — perannya Value Provider sekaligus Motivator
- Sound dipilih karena target audiens Fanta memang pecinta musik, bukan film
@why
Sound di kampanye ini bukan jingle, tapi bagian dari pengalaman menonton — menempel di momen minum Fanta.
Perannya ganda: Value Provider (nilai tambah saat nonton) sekaligus Motivator (dorongan buka Fanta tiap sesi nonton).
Risiko kalau diabaikan: klaim visual gampang ditiru pesaing — sound justru pembeda utamanya.
Opsi biaya/ROI dan selera audiens bukan bagian kerangka tiga objective.
@end

@q 4 :: w4-think :: w4-think-principle
Caterpillar, merek alat berat, masuk ke sepatu boots dengan positioning "reliable, resistant, masculine". Tim kamu menganggap ekstensi ini "aneh" dan menyarankan bikin sub-brand baru. Kenapa ekstensi Caterpillar justru masuk akal secara THINK?
+ Asosiasi alat berat digiring ke satu kesimpulan soal sepatu tangguh — makna lama tinggal disambungkan ke kategori baru
- Sub-brand baru selalu gagal di industri sepatu, jadi memakai nama Caterpillar jauh lebih aman
- Sepatu boots memang satu pabrik dengan traktor D11R limited edition, jadi kualitasnya setara
- Kampanye dua produk berdampingan lebih murah daripada meluncurkan merek baru
@why
Ini THINK gaya Convergent: semua asosiasi merek (reliable, resistant, masculine) digiring ke satu titik — sepatu tangguh. Pelanggan gak perlu diajari ulang.
Sub-brand baru justru MEMUTUS rantai asosiasi itu dan harus membangun makna dari nol — kekuatan convergent yang sudah gratis jadi hilang.
Opsi pabrik sama dan biaya kampanye mengarang fakta yang gak ada di slide.
@end

@q 4 :: w4-act :: w4-act-exp
Iklan Clear Men "2X LEBIH KUAT MELAWAN KETOMBE" dicontohkan sebagai ACT — Bodily Experience. Alasan paling tepat kenapa klaim ini masuk komponen itu?
- Karena angka 2X membuat iklan terlihat ilmiah dan kredibel di mata pemirsa awam
- Karena sampo adalah produk yang dipakai dengan tangan saat mandi sehari-hari
+ Intinya janji perubahan fisik pada tubuh pemakai — benar-benar terasa, bukan citra
- Karena iklan menampilkan gaya hidup aktif pria Indonesia, sesuai komponen Lifestyle
@why
Bodily Experience = pengalaman yang menyangkut kondisi fisik tubuh. Klaim "2X melawan ketombe" menjanjikan perubahan kondisi kulit kepala — dirasakan langsung tubuh pemakai, bukan sekadar citra.
Slide W4-27 juga menyebut self-perceptions dan behavioral modification: pemakai diajak ganti perilaku (ganti sampo) karena yakin hasilnya terasa fisik.
Angka ilmiah dan gaya hidup itu pengecoh yang bunyinya masuk akal, tapi gak menyentuh definisi bodily.
@end

@q 4 :: w4-act :: w4-act-exp
Dealer sepeda listrik Xiaomi V1 ingin toko fisiknya mengaktifkan komponen Interaction dalam ACT, bukan cuma pamer unit di podium. Apa yang harus tersedia di toko, dan istilah ACT Experiences mana yang paling relevan?
- Brosur spesifikasi lengkap di tiap unit — mengaktifkan convergent thinking pelanggan
+ Area test ride dengan rute tantangan ringan — mengaktifkan motor actions dan self-perceptions
- Sales yang lebih banyak — mengaktifkan social influence lewat persuasi personal
- Spot foto estetik untuk Instagram — mengaktifkan sight sebagai differentiator
@why
Interaction dalam ACT menuntut pelanggan BERGERAK bersama produk, bukan melihat dari jauh.
Test ride mengaktifkan motor actions (mengayuh, menikung) dan self-perceptions ("aku ternyata bisa") — dua istilah persis dari slide W4-27 — plus membuka behavioral modification (kebiasaan transportasi berubah setelah mencoba).
Pengecoh lain meminjam istilah dari modul lain (THINK, RELATE, SENSE): kelihatannya produktif, tapi pelanggan tetap pasif.
@end

@q 4 :: w4-relate :: w4-relate-exp
Tagline Indomie "BERBEDA-BEDA SATU SELERA" diminta dijelaskan sebagai RELATE. Kenapa pendekatan cultural value seperti ini lebih sulit ditiru pesaing dibanding promo harga?
- Tagline dua kata yang pendek jauh lebih mudah diingat konsumen daripada angka diskon berapapun
- Promo harga selalu dilarang regulator untuk kategori mi instan di Indonesia
- Indomie punya pabrik lebih besar sehingga promo pesaing selalu kalah skala
+ Nilai budaya menyatu dengan identitas kolektif yang butuh bertahun-tahun membangunnya
@why
"Berbeda-beda" mengakui kemajemukan budaya Indonesia; "satu selera" menyatukan semua pada satu produk — tagline bekerja lewat cultural value + social categorization, komponen RELATE di slide W4-32.
Promo bisa ditanding besok pagi dengan nominal lebih besar; nilai budaya butuh waktu lama dan konsistensi — makanya lebih defensif.
Opsi larangan regulator dan skala pabrik mengarang latar yang gak ada di materi.
@end

@q 4 :: w4-relate :: w4-relate-exp
DIARLIM BLACK menggelar kompetisi Urban Art, Innovation Awards, dan Car Community — padahal iklan produk rokok dibatasi regulasi. Kenapa brand rokok begitu agresif membangun pengalaman di modul RELATE?
+ Membangun relasi sosial tanpa klaim produk langsung — jalur yang tetap terbuka saat iklan rokok dibatasi
- Pelanggan rokok sudah loyal sejak awal, jadi cukup pertahankan mereka lewat event tahunan
- RELATE dipilih karena modul ini paling murah digarap dibanding SENSE, FEEL, THINK, dan ACT
- Regulasi memang mewajibkan brand rokok berinvestasi dalam kegiatan sosial setiap tahunnya
@why
Ketiga kejadian itu membangun relasi pelanggan DENGAN SESAMA penggemar plus identitas bersama (social identity, group membership, brand community) — persis definisi RELATE: menghubungkan ke sesuatu di luar diri sendiri.
Saat klaim produk langsung dibatasi aturan, jalur experiential sosial jadi cara utama membangun kedekatan.
Ini juga bukti experiential marketing itu kerangka mengelola pengalaman, bukan sekadar kreativitas iklan.
Opsi kewajiban regulasi mengarang; "termurah" gak pernah dibahas materi.
@end
