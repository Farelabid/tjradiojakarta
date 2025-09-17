// lib/opini.ts
export type Opini = {
  slug: string;
  title: string;
  author: string;
  date: string;      // YYYY-MM-DD
  sourceUrl?: string;
  body: string;

  // ⬇️ baru
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export const OPINIS: Opini[] = [
  {
    slug: "kosmopolisme-jakarta-dan-panggung-global",
    title: "KOSMOPOLISME JAKARTA DAN PANGGUNG GLOBAL",
    author: "Rano Karno (Wakil Gubernur Daerah Khusus Jakarta)",
    date: "2027-09-16",
    sourceUrl:
      "https://www.kompas.id/artikel/kosmopolisme-jakarta-dan-panggung-global?utm_source=link&utm_medium=shared&utm_campaign=tpd_-_android_traffic",

    // ⬇️ tambahkan foto Pak Wagub
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Rano_Karno_Wagub_DKJ_%28cropped%29.jpg",
    imageAlt: "Rano Karno, Wakil Gubernur Daerah Khusus Jakarta",
    imageCaption: "Rano Karno (Wakil Gubernur DKJ). Foto: Wikipedia.",    
    body: `
Jakarta, tak ubahnya kalimat. Ia butuh tanda baca yang pas: koma untuk jeda, titik untuk bernapas, tanda tanya untuk menyoal sambil mempertanyakan kebiasaan. Di atasnya, langit kerap menyerupai halaman kosong yang dikoyak klakson dan doa subuh. Kota ini meminjamkan telinga bagi yang datang, sekaligus cermin bagi yang lama tinggal—membuat kita melihat diri, sekaligus menyimak dunia yang terbentang.

Di bawah hembusan angin dari laut, nama-nama lama bergema: Sunda Kelapa, Jayakarta, Batavia. Sejarahnya palimpsest—dicatat, dihapus, ditulis ulang—dan di lapisan-lapisannya tumbuh Betawi: akar yang lahir dari persekutuan antara pelabuhan dan daratan. Itulah sebab sapaan khas Betawi ramah pada siapa pun yang baru mendarat: “Abang dari mane?” “Non, mau ke mane?” Dalam sapaan itu, Jakarta menguji janji: mungkinkah menjadi global sambil tetap memeluk adat istiadat?

Bagi sebagian orang, “global” berarti menjulang: hutan beton, hotel berbintang, gedung yang pongah. Tapi global juga bisa merendah: menyapa kaki lima yang tertata, merapikan pasar tradisional yang sahaja, membiarkan musik gang kecil menyelinap ke panggung akbar. Global bukan semata arsitektur atau indeks; ia ritme pertemuan. Di sini Jakarta memberi pesan: sejak awal, lututnya tak gemetar menerima tamu. “Silakan duduk, mari makan, mari bicara”—sebuah meja panjang di mana nasi uduk dan spaghetti bersanding tanpa saling menihilkan.

Dari ruang perjumpaan itu, kita mengenang Mohammad Husni Thamrin—perintis politik kota yang berakar pada keberpihakan terhadap mau orang banyak. Baginya, kota bukan garis di peta, melainkan perjanjian antarwarga. Semacam kontrak sosial, perjanjian bebareng buat ngatur idup semua orang. Politik kota adalah seni membuat yang jauh menjadi dekat, yang kecil terdengar, yang asing bisa bertetangga. Ia tegak membela akses: jalan yang bisa dilewati, harga yang terjangkau, layanan yang bisa diraih. Kota, dalam pandangnya, adalah rumah yang tak mengusir. Maka ketika kita menyebut “kota global”, nama Husni Thamrin bercokol sebagai catatan kaki yang menguatkan teks: keadilan diukur di trotoar, bukan cuma di neraca makro; keberlanjutan pembangunan dirasakan di paru-paru pejalan, bukan sekadar dalam laporan; kemajuan menanggung yang rapuh, bukan cuma menghibur elit yang kuat.

Politik kota, bagi Thamrin, harus serius di trotoar sebagaimana di parlemen. Trotoar mengajarkan setara: menteri dan buruh melangkah di batu yang sama. Dan taman—laboratorium kecil bagi peradaban besar—menjadi tempat demokrasi bernafas: yang berbeda duduk sejajar, melepaskan lelah. Di situ, Pramono Anung, Gubernur Jakarta, ingin kehendak Husni Thamrin mewujud.

Itulah sebab Jakarta giat menumbuhkan ruang hijau sebagai bahasa baru. Taman tidak hanya memproduksi oksigen, ia memproduksi pertemuan. Ada pohon yang menantang panas, kolam dangkal yang menenangkan riuh, bangku-bangku untuk berbincang. Di pinggirnya, pedagang kecil membuka lapak: keripik, minuman lawas orson,  sambil menawarkan cerita.

Taman yang baik lahir dari perencanaan ilmiah—drainase, vegetasi, matahari, perawatan—dan empati: bangku untuk dua orang bertukar kisah, lintasan jalan aman bagi ibu dengan stroller, ruang pedagang yang tak mengotori, lampu terang agar anak-anak pulang tanpa cemas. Lulus di taman—maka kita akan siap di tempat-tempat lain. Di kota yang serba terburu-buru, taman mengajarkan: solidaritas—sebagaimana akar, tumbuh di tempat teduh.

Kota global membutuhkan panggung budaya berlapis-lapis: gedung besar berlangit tinggi, aula kampus yang riuh, pementasan di balai rakyat, kafe yang menyisakan sudut bagi gitar. Di layar lebar, film menyuguhkan perawakan Jakarta. Kota ini bisa menjadi kota sinema—dari kampung susun ke gedung tinggi, dari stasiun ke pelabuhan, dari loket kecil ke ruang sidang. Sinema adalah cara lain kota membaca diri: kamera menyusur lorong, cahaya menyingkap yang terlewat. Kita tertawa, tertegun, menangis—lalu pulang dengan perasaan baru: tergugah.

Jakarta mesti menguatkan panggung budaya terbuka: festival yang tak memaksakan selera, pameran bagi seniman muda, konser yang mengajak penonton menunggu sunyi. Di kelas kecil, anak diajak membaca, menulis, berdebat. Di sanggar, tubuh menemukan bahasa baru. Di layar, kita menonton film sambil menunggu kisah sehari-hari difilmkan. Ekosistemnya: perizinan transparan dan murah, pendanaan berkeadilan, insentif bagi karya yang masih tertatih—bahkan bila akhirnya berujung pada gagal yang terhormat.

Ekonomi kreatif menyumbang denyut. Satu lokasi shooting menyalakan lampu warung, menyewa kostum, memesan properti pengrajin, mengisi kamar penginapan. Karena itu, kota yang menyebut diri global perlu membuka jalur bagi pembuat cerita: kemudahan, fasilitas berbagi pakai, insentif proporsional, kepastian hak cipta. Dan tak kalah penting: kebebasan berekspresi yang dewasa—kuat mendengar kritik tanpa dibalas murka.

Pada saat sama, warga pun harus menjadi pengarang. Bukan hanya pemerintah menulis kota; komunitas pun berhak memegang pena. Di kampung jauh, anak muda bisa membangun perpustakaan swadaya. Di pelataran masjid, diskusi berlangsung tanpa mikrofon yang bising. Di sekolah, guru menukar ulangan dengan proyek menanam pohon. Di kelurahan, aplikasi mempertemukan aduan sampah dengan ayunan lengan petugas berbaju oranye. Kebanggaan kecil-kecil seperti ini menjadi antibodi melawan sinisme.

Kota global berani membaca sejarah tanpa takut. Sejarah Jakarta tak selalu rapi; ia berliku dan getir. Luka lama bukan alasan menunda—apa lagi berhenti. Melainkan, alasan untuk melangkah hati-hati. Barangkali, kelak suatu hari, gelombang protes datang lagi karena aspirasi akan terus meraba jalan. Akan ada orasi berapi-api, tapi tak membakar stasiun dan halte bus; akan ada aparat yang tegas, namun tak diniatkan untuk melukai. Dan di atas semua itu, Jakarta kembali menjadi dirinya: kosmopolis yang tahu bahwa perbedaan adalah kebiasaan, bukan ancaman; bahwa keadilan tak perlu api; bahwa duka bisa menjadi guru tanpa korban bertubi-tubi.

Di sana, kosmopolisme menjadi jangkar lembut: bukan untuk membatasi, melainkan menebar sapa. Itu sebab kita menemukan lagu Benyamin Suaeb bisa akrab dengan jazz; tari Topeng bersahabat dengan ballet; kerak telor berdamai dengan croissant. Kosmopolisme bukan blender yang menyeragamkan, melainkan meja panjang tempat aneka hidangan disajikan: orang memilih, mencicip, saling menawarkan. Akrab.

Dan, kota global bukan surga. Ia menuntut ongkos—kompetisi hebat, ritme melelahkan, harga lahan yang menanjak. Politik kota diuji. Bisakah kemajuan tidak menyingkirkan? Di rapat investasi, adakah kursi untuk pedagang kecil—tak tertinggal di lobi? Pada peta angkutan massal, masukkah pojok-pojok kampung tua, bukan hanya jalan protokol? Di sekolah negeri pinggir kali, hadirkah guru terbaik, bukan hanya di sekolah berbiaya mahal? Di rumah sakit, adakah antrean yang wajar, obat tersedia, perlakuan manusiawi? Pertanyaan-pertanyaan ini tak bisa selesai semalam. Tapi kota yang jujur akan berani menghadapinya setiap hari, sembari menata jawaban sepotong demi sepotong. Tak mungkin selesai dalam sepekan, lebih-lebih sehari. Tapi Jakarta, berkeras membereskan dengan ikhtiar sepenuh hati.

Infrastruktur—lebih dari beton dan baja, adalah tata bahasa. Ia menertibkan subjek dan objek, membuat kata kerja jadi gesit. Trotoar yang aman adalah kalimat jelas: pejalan kaki harus dihormati. Lajur sepeda bukan ornamen, ia tanda kita belajar mengeja keselamatan. Lift di stasiun untuk kursi roda bukan kemurahan hati, ia tata bahasa kesetaraan. Dengan tata bahasa yang jernih, warga menulis kalimat-kalimat hidup: berangkat, pulang, bertemu, merangkul.

Di tengah semua ini, kosmopolisme menjadi benang yang menjahit hari. Bukan kostum pesta yang usai lalu disimpan, melainkan pakaian hari-hari yang nyaman. Bahasa Betawi mengajari humor, supaya kita tak terlalu serius menghadapi keadaan. “Santai aje.” Santai bukan menunda, melainkan tenang mengerjakan: tak meledak-ledak, tak pura-pura. 

Keamanan tak cukup dengan memasang kamera di tiap tikungan jalan; ia meminta kesediaan saling jaga. Keamanan tumbuh dari relasi, bukan semata regulasi: polisi dan warga, satpam dan pedagang, guru dan murid, petugas kebersihan dan pemilik usaha—semua berbagi kewaspadaan. Kita boleh menyebutnya: solidaritas.

Perubahan iklim menghadirkan bab baru: panas bertambah, hujan bisa datang jadi amarah. Tanggul dan pintu air adalah teknik; sementara restorasi mangrove menahan abrasi. Keduanya perlu. Drainase cerdas adalah logika; sumur resapan jadi kebutuhan. Semuanya mesti berjalan. Pusat data hemat energi adalah masa depan; taman kota yang basah adalah masa depan yang lain. Kita harus memintal semuanya serentak, seperti kain yang kuat karena benang saling merangkul.

Kesehatan tak bisa dinegosiasi. Kota global bukanlah yang memamerkan rumah sakit mewah yang angkuh, melainkan puskesmas di ujung kelurahan yang punya cukup nakes, obat-obatan, layanan ramah. Kelas menengah boleh memiliki asuransi. Tak apa. Namun fondasinya adalah layanan dasar yang tak membuat warga kecil pulang kecewa. Pandemi kemarin mengajar: kota bisa menjadi jaringan rapuh; satu simpul abai, semuanya beranjak patah. 

Pendidikan adalah jembatan terpanjang—melintasi puluhan tahun masa depan seorang anak. Kita butuh kurikulum yang membiarkan tanya, menghidupkan debat—bukan sekadar mencatat. Guru perlu ruang untuk mencoba. Kota global tak ragu mengobral beasiswa. Perpustakaan tak tunduk pada jam kantor; buku bisa dipinjam dari gawai, literasi hadir di taman. Lagi, Pramono Anung terbius menyuguhkan hal-hal semacam itu.

Apakah semua ini utopis? Ya dan tidak. Utopia memberi arah; realitas memberi batas. Di antara keduanya, kita berjalan. Politik kota yang realistis namun berani lebih berguna daripada rencana besar tak terejawantah. Satu trotoar disambung tiap bulan, satu taman dirawat, satu gedung cagar budaya diperbaiki, satu perizinan dipangkas, satu data publik dibuka, satu komunitas diajak bicara.

Dari satu-satu itu tumbuh kepercayaan. Dan kepercayaan melipatgandakan kecepatan. Kota global lahir bukan dari satu lompatan raksasa, melainkan ribuan langkah pendek yang ogah berhenti. Itu sebab Pramono, Gubernur Jakarta, ambil inisiatif kabarkan warga—untuk kali pertama: APBD dibuka telanjang. Transparansi dan akuntabilitas bukan dongeng di ibu kota. Pramono ingin mengirim pesan, setiap rupiah pajak didedikasikan untuk maslahat warga. Lewat kerja-kerja teknokrasi dan tekad yang sungguh.

Namun, kota juga butuh “yang keras”: tata ruang tegas agar Jakarta tak menjadi labirin, pajak adil agar kota punya amunisi, kolaborasi lintas-kota agar tak merasa mahatahu, standar bangunan hijau agar listrik tak boros, pengolahan sampah agar tak lari mencemari sungai. Kita tak bisa memuji taman dan trotoar lalu lupa pipa air, kabel, angka, dokumen. Justru di level ini, imajinasi diperlukan: memberi alasan pada angka, meminjamkan paras pada pipa.

Jakarta adalah kota pesisir—berdiri di tepi air, diuji setiap tahun oleh air. Para perencana menatap peta, menarik garis, menegakkan struktur. Tapi orang tua di di pojok kampung juga hafal ilmu air: kapan datang, bagaimana berputar, ke mana lari. “Ilmu kota” tetap berkongsi dengan intuisi warga agar hujan tak menjelma musibah.

Kosmopolisme menuntut keramahan. Turis bukan dompet berjalan; mereka tamu. Pekerja harian bukan angka; mereka penggerak. Sopir, pedagang, barista, perawat, penata suara, teknisi pendingin, pustakawan—adalah wajah kota sehari-hari. Bila ingin dunia percaya pada Jakarta, pastikan Jakarta percaya pada dirinya melalui mereka: beri ruang berkembang, sapa dengan hormat. Kebiasaan kecil, bila dikumpulkan, jadi reputasi yang tak bisa dibeli iklan.

Tahun-tahun ke depan, Jakarta akan terus mencari dirinya. Kadang tersesat, kadang pulang. Saat bingung, kita bisa kembali pada tiga perihal: ruang, gerak, cerita. Ruang—apakah kita memberi tempat untuk semua? Gerak—apakah kita memudahkan manusia, bukan sekadar memudahkan kendaraan lalu lalang melintas? Cerita—apakah kita setia mendengar kisah yang tak menyenangkan, bukan hanya pujian? Di persilangan tiga hal itulah politik kota bernapas; di ritmenya kita semua menjaga ketukan. Sebab kota adalah tubuh; ia butuh irama agar jantungnya tak tersendat.

Tulisan ini bukan jawaban akhir, melainkan bingkai untuk percakapan lebih panjang—selembar kolom koran yang mungkin dilipat. Namun boleh jadi, ada satu kalimat bertahan: seseorang akan menatap taman lebih lama; menahan diri tak membuang sampah ke selokan; bertanya, “Bisakah izin diurus lebih sederhana?” Hal-hal kecil ini mungkin tak tercatat dalam indeks kota global. Tetapi di situlah globalisme menemukan tanah.

Kelak, anak-anak hari ini akan berkata: “Jakarta, tempat kami belajar berjalan.” Mereka mungkin lupa angka-angka statistik yang pernah dibanggakan, tetapi akan selalu ingat: tukang roti yang lewat, kereta MRT yang ditunggu di Stasiun Bank Jakarta, bus TransJakarta di terminal Blok-M, pantun yang dilempar dalam prosesi palang pintu, air hujan yang berhenti muntab karena kita terus belajar, manusia yang menahan suara ketika yang lain bertutur. Kota adalah paduan suara: indah ketika semua tahu kapan menyanyi, kapan diam, kapan menahan nada untuk memberi ruang pada hening ataupun nada yang lain.

Kepada Husni Thamrin, kita berutang bahasa politik: kota ini milik semua. Kepada Betawi, kita berutang bahasa rumah yang berucap: “ Nyok, masuk! Anggep aje rumah sendiri. Rumah gue rumah lu juga.” Kepada dunia, kita berutang bahasa akrab seorang kawan: “Mari baku tukar cerita.” Dan kepada diri sendiri, kita berutang janji yang mesti ditepati pelan-pelan: trotoar tersambung, taman terawat, data terbuka, sekolah yang gembira, angkutan nyaman, udara lega, ruang yang tak menyingkirkan siapa-siapa. Tak perlu sekaligus: satu lagi, satu lagi, satu lagi. Terus, setiap hari.

Pada akhirnya, kota adalah sekumpulan janji kecil yang ditepati sehari-hari hingga menjelma jadi reputasi besar. Jakarta berdiri. Bukan tanpa masalah, bukan tanpa luka. Tetapi Jakarta belajar setiap menit. Dan belajar—lebih dari apa pun—adalah syarat paling jujur bagi kota global yang berbudaya, tak lupa diri. Tetap jadi kota ramah, rumah luas bagi semua. Kosmopolit, sepenuhnya.
    `.trim()
  },

  // Contoh entri kosong berikutnya (tinggal duplikasi & ganti isinya setiap minggu)
  // {
  //   slug: "judul-slug-lain",
  //   title: "Judul Opini Lain",
  //   author: "Nama Penulis",
  //   date: "2025-09-16",
  //   body: `Isi opini...`,
  // },
];

// Helper kecil
export function getOpinis() {
  //urutkan terbaru dulu
  return [...OPINIS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function getOpiniBySlug(slug: string) {
  return OPINIS.find((o) => o.slug === slug) || null;
}
export function getExcerpt(text: string, words = 36) {
  const t = text.replace(/\s+/g, " ").trim();
  const arr = t.split(" ");
  return arr.length <= words ? t : arr.slice(0, words).join(" ") + "…";
}
