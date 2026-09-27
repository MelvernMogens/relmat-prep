# quiz W7 :: Managing Customer Bonding
# 14 soal PG. Header `@quiz W<x>` tidak didukung parse.py (unknown quiz tag),
# jadi section header pakai komentar; gate tetap `uv run python build/parse.py`.

@q 7 :: w7-bonding-pos :: w7-bonding
Toko Roti Maya mencatat 5 kejadian: (1) pembeli mencoba gratisan roti varian baru dekat kasir, (2) rapat manajemen soal target biaya bahan baku, (3) ada yang DM Instagram menanyakan stok, (4) bagian keuangan menutup buku pajak, (5) orang yang lewat membaca selebaran promo. Menurut Exhibit 3.3, berapa kejadian yang termasuk momen pembentuk customer bonding?
- 2, karena hanya sentuhan langsung produk/servis yang dihitung bonding
- 4, karena semua kejadian kecuali rapat internal ikut membentuk bonding
+ 3 — kejadian 1, 3, dan 5 menyentuh produk, organisasi, atau program marketing
- 5, karena semua kegiatan perusahaan pada dasarnya ikut memengaruhi pelanggan
@why
Kriteria Exhibit 3.3: bonding terjadi setiap kali prospect/customer berinteraksi dengan produk, servis, organisasi, ATAU komponen program marketing — interaksinya tidak harus transaksi. Cicip gratisan = produk; DM admin = organisasi/layanan; baca selebaran = program marketing → 3 momen. Rapat bahan baku dan tutup buku pajak gugur karena tidak ada prospect/customer yang bersentuhan dengan apa pun milik firma. Bonus insight: tiap momen itu juga peluang mempelajari customer lebih dalam.
@check len([1,3,5]) == 3
@end

@q 7 :: w7-bonding-pos :: w7-bonding
Definisi paling tepat: kapan customer bonding terbentuk menurut kerangka integrated relationship marketing?
- Hanya saat transaksi pembelian berhasil terjadi di kasir atau di halaman checkout online
- Saat customer mendaftar program loyalty dan datanya masuk ke database perusahaan
- Saat tim marketing menjalankan kampanye advertising besar-besaran di media massa
+ Setiap kali prospect/customer berinteraksi dengan produk, servis, organisasi, atau program marketing
@why
Exhibit 3.3 menegaskan bonding terbentuk di TIAP interaksi — UX aplikasi, layanan CS, sampai handling komplain pun momen pembentuk bond, bukan cuma transaksi atau kartu member (itu miskonsepsi di @trap materi). Tiap kontak juga kesempatan ganda: mengenal customer lebih dalam DAN memperkuat bond.
@check len(['produk','servis','organisasi','program marketing']) == 4
@end

@q 7 :: w7-bonding-pos :: w7-rm-wheel
Di roda integrated relationship marketing (slide 4), di posisi berapa customer bonding duduk — dan diapit oleh elemen apa?
+ Elemen ke-6, di antara customer satisfaction (5) dan branding in RM (7)
- Elemen ke-4, di antara customer value dan customer satisfaction
- Elemen ke-7, di antara customer satisfaction dan RM process
- Elemen ke-8, sebagai elemen terakhir yang memayungi semuanya
@why
Urutan roda: 1 framework, 2 customer life cycle, 3 customer value, 4 customer experience, 5 customer satisfaction, 6 customer bonding, 7 branding in RM, 8 RM process — makanya bab ini berjudul "6. Managing Customer Bonding". Posisinya penting: satisfaction tanpa bonding gampang ditinggal saat kompetitor memberi pengalaman serupa. Elemen ke-4 itu customer experience; ke-8 itu RM process, bukan bonding.
@check 7 - 5 == 2
@end

@q 7 :: w7-bonding-degrees :: w7-degree, w7-exhibit33
Dita membeli kaus official bermerek kedai dan merasa satu nilai dengan brand-nya — tapi dia belum pernah chat CS, belum terdaftar di app, dan belum beli lewat member. Derajat bonding Dita?
- Awareness, karena dia baru mengenal brand lewat iklan dan merchandise resminya
- Relationship, karena memakai logo berarti brand sudah mengenal dia sebagai customer
+ Identity — keterikatan emosional pada nilai brand tanpa direct interaction dan database
- Community, karena para pemakai kaus logo membentuk kelompok fans di mata publik
@why
Identity bond: masih satu arah, belum ada direct interaction dan customer database — kaus bermerek adalah outward sign of affinity (slide 7). Miskonsepsi klasik: "sudah pakai logo = relationship" — salah, Relationship menuntut interaksi dua arah dan database driven (customer dikenal). Naik ke Relationship baru saat Dita terdaftar dan dua arah; Community butuh multilogue antar customer.
@end

@q 7 :: w7-bonding-degrees :: w7-monologue, w7-multilogue, w7-degree
Ujian sering menukar ciri antar level. Pasangan arah interaksi yang BENAR menurut derajat-derajat customer bonding:
+ Awareness & Identity = monologue satu arah; Relationship = dialogue dua arah; Community = multilogue antar customer
- Awareness & Identity = dialogue dua arah; Relationship = multilogue; Community = monologue
- Awareness = monologue; Identity = dialogue; Relationship & Community = multilogue bersama
- Semua derajat pada dasarnya dialogue, yang berbeda hanya jumlah pesannya
@why
Arah interaksi adalah pisau pembeda utama: Awareness/Identity masih monologue (customer tidak dikenal, tanpa database), Relationship jadi dialogue dua arah (database driven), Community jadi multilogue — Charles bicara dengan Albert DAN dengan customer lain. Hafalkan arahnya dulu, ciri lain (logo, app, word-of-mouth) menyusul dari situ.
@check len(['Awareness','Identity','Relationship','Community','Advocacy']) == 5
@end

@q 7 :: w7-bonding-degrees :: w7-exhibit33
Menurut Exhibit 3.3, weakness apa yang SAMA-sama dimiliki derajat Awareness dan Identity?
- Cuma fragile — soal biaya dan pengukuran konon sudah teratasi di era advertising digital
+ Fragile, expensive, sulit diukur, dan nothing learned about individual customer
- May be difficult to control, dengan heavy company involvement dari pihak perusahaan
- Competition may copy, karena pesaing bisa meniru programnya dengan cepat dan murah
@why
Awareness dan Identity sama-sama monologue satu arah — akibatnya: fragile, expensive, measurability/accountability difficult, dan nothing learned about individual customer (dua-duanya tidak mengumpulkan data customer). "Difficult to control" itu weakness Community; follow-through/incentives/empowerment justru critical success factors Advocacy. "Competition may copy" memang muncul di tabel slide 11, tapi bukan weakness BERSAMA Awareness & Identity — pasangan monologue ini lemah karena fragile, mahal, sulit diukur, dan tanpa data individu.
@end

@q 7 :: w7-bonding-degrees :: w7-exhibit33, w7-degree
Critical success factors "repetition, reach, creative execution" milik derajat mana — dan kenapa masuk akal begitu?
- Advocacy, karena word-of-mouth harus diulang sampai menjangkau jaringan luas
+ Awareness — monologue media massa memang harus diulang dan luas jangkauannya
- Relationship, karena database dibangun dari kampanye kreatif yang berulang
- Community, karena komunitas tumbuh dari event kreatif yang rutin digelar
@why
CSF Awareness = repetition, reach, creative execution — wajar karena awareness dibentuk lewat monologue (image advertising, promotions, PR, event sponsorship) yang harus diulang dan luas. Bandingkan: CSF Advocacy = excellent follow-through, incentives, empowerment — advocacy butuh konsistensi layanan dan keleluasaan customer bicara atas nama brand. Tukar-tukaran CSF antar derajat adalah pola soal ujian yang sering muncul.
@check len(['repetition','reach','creative execution']) == 3
@end

@q 7 :: w7-bonding-strategies :: w7-service-value-core
Lihat diagram Types of Bonding Strategies (slide 13). Apa yang berada di PUSAT diagram, dan apa maknanya?
- Customer database — fondasi yang menghubungkan Financial, Social, Customization, dan Structural
- Customer bonding degree — target kenaikan tingkat yang dikejar keempat strategi tersebut
- Financial bonds — strategi pertama sekaligus terkuat, yang lain hanyalah penguatnya saja
+ Excellent Service Quality and Value — inti yang dilayani keempat keluarga strategi
@why
Pusat diagram: Excellent Service Quality and Value — keempat strategi (I Financial, II Social, III Customization, IV Structural) mengelilingi dan bertumpu padanya. Maknanya: program bonding bukan pengganti kualitas layanan; bonding di atas layanan buruk justru mempercepat customer pergi. "Customer database" terdengar pintar tapi itu alat Customization, bukan pusat diagram; "financial bonds terkuat" kebalikan dari isi materi (financial paling mudah ditiru).
@check len(['Financial','Social','Customization','Structural']) == 4
@end

@q 7 :: w7-bonding-strategies :: w7-financial-bonds
Warung Sederhana memberi tarif langganan lama lebih rendah setelah lima tahun jadi pelanggan. Ini masuk keluarga strategi bonding yang mana — dan bentuk spesifiknya?
- Social bonds — personal relationships, karena pelanggan sudah dikenal personally selama 5 tahun
+ Financial bonds — stable pricing, karena insentifnya harga lebih stabil/murah atas loyalitas durasi
- Customization bonds — customer intimacy, karena hubungan 5 tahun berarti kebutuhan sudah intim diketahui
- Structural bonds — joint investments, karena 5 tahun investasi waktu adalah investasi bersama
@why
Kata kunci "harga" memetakan ke keluarga Financial; bentuk spesifiknya stable pricing — slide 14 menyebut lower price increases (kenaikan harga lebih kecil) untuk customer lama dibanding baru. Pengecoh social/customization menjerat mereka yang membaca "5 tahun" sebagai relasi personal atau keintiman — durasi bukan penentu keluarga; MEKANISME ikatannya (uang, relasi, penyesuaian, sistem) yang menentukan.
@end

@q 7 :: w7-bonding-strategies :: w7-customization-bonds, w7-structural-bonds
KELUARGA STRATEGI BONDING — ISI (slide 13)
| Keluarga | Bentuknya |
| I. Financial | Volume & frequency rewards; bundling & cross selling; stable pricing |
| II. Social | Social bonds among customers; personal relationships; continuous relationships |
| III. Customization | Customer intimacy; mass customization; anticipation/innovation |
| IV. Structural | Integrated information system; joint investments; shared processes & equipment |
Program: "aplikasi membaca pola belanja dan mengirim notifikasi bahan dapur yang biasanya habis di minggu yang sama". Program ini masuk...
- Financial — volume and frequency rewards, karena reminder mendorong pembelian berulang
- Social — continuous relationships, karena reminder menjaga hubungan tetap jalan terus
- Structural — integrated information system, karena sistem informasi yang menjalankannya
+ Customization — anticipation/innovation, karena database memprediksi reorder tiap individu
@why
Prediksi kebutuhan + reminder dari database = anticipation/innovation, bentuk Customization (slide 16: database memprediksi kapan customer perlu reorder). Jebakan besar di sini Structural: sistem informasi memang menjalankan program, tapi integrated information system sebagai bentuk Structural menunjuk pada sistem yang MENYATUKAN OPERASI dua pihak (seperti tablet POS terhubung di mitra), bukan sekadar alat internal pengirim reminder. Financial/Social menjerat yang membaca efeknya (beli lagi, hubungan jalan) bukan mekanismenya.
@end

@q 7 :: w7-bonding-strategies :: w7-structural-bonds
Dibanding ketiga keluarga lainnya, kenapa structural bonds paling "mengunci" customer?
- Karena struktur organisasi perusahaan menjadi lebih rapi sehingga layanan jadi makin cepat
- Karena structural bonds adalah strategi termurah sehingga margin bisa dipakai untuk diskon besar
+ Sistem dan proses sudah menyatu dengan operasi customer — pindah berarti rombak operasi
- Karena struktur memastikan customer selalu mendapat harga terbaik dibanding kompetitor mana pun
@why
Structural bonds mengikat lewat sistem dan operasi yang menyatu dengan customer/mitra — pola free computers di slide 17: peralatan dan proses sudah nyambung, pindah berarti rombak operasi. I → IV memang bisa dibaca sebagai eskalasi: financial mengikat lewat uang (mudah ditiru), social lewat relasi, customization lewat penyesuaian individu, structural paling tertanam di operasi. Opsi hemat biaya dan harga terbaik mengarang logika yang gak ada di slide.
@end

@q 7 :: w7-bonding-strategies :: w7-financial-bonds, w7-social-bonds
Anggap: poin reward kamu ditiru persis oleh kompetitor minggu depan dengan nominal lebih besar. Apa bacaan yang paling sesuai materi bonding?
- Berarti financial bonds gagal total dan sebaiknya langsung dihapus dari strategi perusahaan
+ Financial bonds mudah ditiru — beri alasan ekonomis, tapi ikatan sejatinya dari social/customization/structural
- Tidak masalah, karena loyalty program pada dasarnya tidak pernah ditiru oleh kompetitor
- Kompetitor melanggar aturan, karena program loyalty dilindungi regulasi persaingan usaha
@why
Miskonsepsi di @trap materi: diskon dan poin sering disangka bonding "sejati". Financial bonds mengikat lewat insentif uang — gampang ditiru kompetitor (weakness "competition may copy") dan tidak membangun ikatan emosional/struktural. Empat keluarga itu pelengkap berlapis: financial = alasan ekonomis tinggal; social, customization, structural = alasan relasional dan struktural. Jadi bukan "hapus financial", tapi jangan berhenti di financial.
@end

@q 7 :: w7-bonding-strategies :: w7-customization-bonds
Mass customization didefinisikan slide 16 sebagai "the use of flexible processes and organizational structures to produce varied and often individually products". Customization bonds BEDA dari segmentasi pasar karena...
- Segmentasi hanya dipakai di industri B2B, sedangkan customization hanya dipakai di B2C
- Customization selalu membutuhkan produk fisik, sementara segmentasi hanya untuk jasa
+ Upaya ikatan berbasis penyesuaian individual (one-to-one), bukan pengelompokan pasar
- Keduanya sama saja; istilah customization hanya versi kekinian dari segmentasi
@why
Miskonsepsi di trap materi: customization bonding ≠ segmentasi. Segmentasi MENGELOMPOKKAN pasar; customization bonding adalah UPAYA IKATAN di level individu — customer intimacy = solusi one-to-one, mass customization = proses dan struktur organisasi fleksibel untuk produk yang bervariasi/individual. Fokusnya proses+struktur organisasi, bukan klasifikasi pelanggan. Opsi "sama saja" adalah miskonsepsi dilusi makna.
@end

@q 7 :: w7-bonding-strategies :: w7-social-bonds
Industri asuransi dicontohkan slide 15 sebagai social bonds. Di warung, pelayan langganan inget pesanan favorit Bu Ratna dan selalu menyapa keadaan keluarganya. Bentuk social bonds apa yang paling tepat, dan kenapa "arisan komunitas pelanggan" TIDAK ikut bentuk itu?
+ Personal relationships (staf-customer); arisan pelanggan itu social bonds among customers
- Personal relationships — dan arisan juga termasuk, karena sama-sama membangun kedekatan manusiawi
- Social bonds among customers — dan arisan juga termasuk, karena keduanya melibatkan banyak orang
- Continuous relationships — karena yang penting frekuensi interaksi berulang, bukan arahnya
@why
Personal relationships = relasi personal customer-staf (pola industri asuransi: personal touches bikin client betah). Arisan pelanggan = social bonds among customers — marketer memfasilitasi interaksi ANTAR customer, bukan dengan staf. Arah relasinya yang membedakan, bukan jumlah orangnya. Opsi "frekuensi saja" menggampangkan: continuous relationships memang bentuk lain di keluarga yang sama, tapi mengaburkan pembedaan arah yang justru diuji di sini.
@end
