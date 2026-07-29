**PRODUCT REQUIREMENTS DOCUMENT**

**MANTAP**

*AI Sparring Partner untuk Pengambilan Keputusan Pribadi*

**Kompetisi Hackathon — IT FEST 6.0 2026**

Versi 1.0 \| Juli 2026 \| Status: Draft untuk Eksekusi Pengembangan

**0. Kontrol Dokumen**

| **Atribut**    | **Detail**                                                             |
|----------------|------------------------------------------------------------------------|
| Nama Produk    | MANTAP (Mitra AI untuk Pengambilan Keputusan Tepat)                    |
| Tipe Dokumen   | Product Requirements Document (PRD)                                    |
| Kompetisi      | Hackathon IT FEST 6.0 2026                                             |
| Versi          | 1.0                                                                    |
| Status         | Draft — siap dieksekusi tim/AI development agent                       |
| Target Pembaca | Tim pengembang, AI coding assistant (mis. Claude Code), juri kompetisi |

**1. Ringkasan Eksekutif**

MANTAP adalah aplikasi web berbasis AI yang berperan sebagai AI Sparring Partner dalam membantu pengguna mengambil keputusan pribadi — mulai dari karier, pendidikan, relasi, hingga finansial. Alih-alih memberikan jawaban instan seperti chatbot generik, MANTAP membantu pengguna mengeksplorasi alternatif, memahami konsekuensi, dan menyusun pertimbangan secara objektif dan terstruktur, sementara keputusan akhir tetap sepenuhnya berada di tangan pengguna (human-in-the-loop).

Dokumen ini menerjemahkan Executive Summary kompetisi menjadi PRD yang dapat langsung dieksekusi oleh tim pengembang maupun AI coding agent untuk membangun MVP MANTAP, lengkap dengan requirement fungsional, arsitektur teknis, struktur data, dan panduan desain antarmuka.

**2. Latar Belakang & Pernyataan Masalah**

**2.1 Masalah**

- Individu dihadapkan pada berbagai keputusan penting setiap hari (karier, pendidikan, relasi, finansial) yang berdampak besar pada masa depan mereka.

- Banyak keputusan diambil terburu-buru, berdasarkan emosi sesaat, atau tanpa mempertimbangkan sudut pandang yang relevan, sehingga berpotensi menimbulkan penyesalan.

- Pendampingan dari mentor, konselor, atau ahli sulit diakses karena keterbatasan waktu, biaya, dan akses.

- Chatbot AI generik umumnya hanya memberi jawaban langsung tanpa membantu pengguna memahami proses berpikir di balik rekomendasi, sehingga berisiko menciptakan ketergantungan tanpa pemahaman.

**2.2 Pendekatan**

MANTAP dibangun mengikuti prinsip Human-Centered AI: AI digunakan untuk memperkuat kemampuan berpikir manusia dalam mengambil keputusan secara bertanggung jawab, bukan menggantikannya. AI diposisikan sebagai thinking aid — bukan pengambil keputusan.

**3. Tujuan Produk & Metrik Keberhasilan**

**3.1 Tujuan**

- Menyediakan mitra diskusi berbasis AI yang membantu pengguna berpikir lebih objektif, terstruktur, dan reflektif sebelum mengambil keputusan.

- Mengurangi ketergantungan pasif pada jawaban instan AI dengan mendorong keterlibatan aktif pengguna dalam proses berpikir (explainability by design).

- Membangun rekam jejak keputusan pribadi (Decision Journal) yang dapat dijadikan bahan refleksi di masa depan.

**3.2 Metrik Keberhasilan (KPI) — Indikatif**

| **Metrik**                 | **Definisi**                                                    | **Target MVP** |
|----------------------------|-----------------------------------------------------------------|----------------|
| Completion Rate Onboarding | % pengguna baru yang menyelesaikan Personal Context Onboarding  | ≥ 70%          |
| Sesi Konsultasi Selesai    | % sesi chat yang berakhir dengan Konfirmasi Keputusan Eksplisit | ≥ 50%          |
| Retensi 7 Hari             | % pengguna yang kembali membuka aplikasi dalam 7 hari           | ≥ 30%          |
| Entri Decision Journal     | Rata-rata entri jurnal per pengguna aktif per bulan             | ≥ 2 entri      |
| Waktu Respons AI           | Latensi rata-rata respons Gemini API                            | \< 3 detik     |

**4. Target Pengguna & Persona**

| **Persona**      | **Deskripsi**                                                                       | **Kebutuhan Utama**                                         |
|------------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------|
| Mahasiswa        | Usia 18–24 tahun, sedang menghadapi keputusan pendidikan lanjutan atau awal karier. | Panduan terstruktur, biaya rendah, akses cepat.             |
| Profesional Muda | Usia 23–30 tahun, mempertimbangkan pindah kerja, promosi, atau keputusan finansial. | Analisis konsekuensi, kerahasiaan, efisiensi waktu.         |
| Masyarakat Umum  | Individu yang menghadapi keputusan relasi, keluarga, atau finansial sehari-hari.    | Ruang aman untuk berpikir tanpa judgement, mudah digunakan. |

**5. Ruang Lingkup Produk (Scope)**

**5.1 Termasuk dalam MVP (In-Scope)**

- Personal Context Onboarding

- Chat Konsultasi Interaktif dengan AI (Gemini API)

- Decision Framework untuk 4 domain awal: karier, pendidikan, relasi, finansial

- Explainability by Design (AI menjelaskan alasan di balik setiap saran)

- Konfirmasi Keputusan Eksplisit

- Decision Journal (riwayat & refleksi keputusan)

- Autentikasi pengguna (Firebase Authentication)

**5.2 Di Luar Cakupan MVP (Out-of-Scope)**

- Domain keputusan di luar 4 kategori awal (akan ditambahkan pasca-MVP)

- Aplikasi mobile native (MVP berfokus pada web app)

- Integrasi dengan mentor/konselor manusia secara langsung

- Monetisasi/berlangganan berbayar

**6. Fitur & Functional Requirements**

Berikut rincian setiap fitur utama beserta user story acuan untuk pengembangan.

| **Fitur**                      | **Deskripsi Fungsional**                                                                                                  | **User Story**                                                                                                           |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Personal Context Onboarding    | Mengumpulkan konteks awal pengguna (usia, situasi, tujuan, preferensi) untuk mempersonalisasi diskusi selanjutnya.        | Sebagai pengguna baru, saya ingin mengisi profil singkat agar AI memahami konteks saya sebelum berdiskusi.               |
| Chat Konsultasi Interaktif     | Ruang percakapan real-time dengan AI yang mengajukan pertanyaan reflektif, bukan hanya memberi jawaban langsung.          | Sebagai pengguna, saya ingin berdiskusi secara natural dengan AI layaknya sparring partner, bukan mesin pencari jawaban. |
| Decision Framework             | Kerangka terstruktur (mis. pro-kontra, analisis konsekuensi jangka pendek/panjang) yang disesuaikan per domain keputusan. | Sebagai pengguna, saya ingin dipandu kerangka berpikir yang relevan dengan jenis keputusan yang saya hadapi.             |
| Explainability by Design       | Setiap saran atau insight dari AI disertai penjelasan alasan/logika di baliknya, bukan kesimpulan mentah.                 | Sebagai pengguna, saya ingin memahami mengapa AI memberi suatu insight, bukan hanya menerimanya begitu saja.             |
| Konfirmasi Keputusan Eksplisit | Tahap akhir sesi di mana pengguna secara sadar menegaskan keputusan yang diambil (human-in-the-loop).                     | Sebagai pengguna, saya ingin momen eksplisit untuk menegaskan bahwa keputusan ini benar-benar pilihan saya.              |
| Decision Journal               | Riwayat seluruh sesi dan keputusan yang telah dikonfirmasi, dapat ditinjau kembali untuk refleksi.                        | Sebagai pengguna, saya ingin melihat kembali keputusan-keputusan saya sebelumnya sebagai bahan pembelajaran.             |

**7. Alur Pengguna Utama (User Flow)**

1.  Pengguna mendaftar/masuk melalui Firebase Authentication.

2.  Pengguna baru menyelesaikan Personal Context Onboarding (data diri, situasi, tujuan).

3.  Pengguna memilih domain keputusan (karier, pendidikan, relasi, atau finansial).

4.  Sistem memuat Decision Framework yang sesuai dan memulai Chat Konsultasi Interaktif.

5.  AI mengajukan pertanyaan reflektif dan memberikan insight dengan penjelasan (Explainability by Design).

6.  Pengguna mengeksplorasi alternatif hingga merasa cukup yakin untuk memutuskan.

7.  Pengguna melakukan Konfirmasi Keputusan Eksplisit untuk menutup sesi.

8.  Sesi tersimpan otomatis ke Decision Journal untuk ditinjau kembali di kemudian hari.

**8. Arsitektur & Skalabilitas Teknologi**

**8.1 Tumpukan Teknologi (Tech Stack)**

| **Lapisan**    | **Teknologi**                       | **Keterangan**                                |
|----------------|-------------------------------------|-----------------------------------------------|
| Frontend       | React + TypeScript + Tailwind CSS   | SPA responsif, komponen reusable              |
| Backend / Auth | Firebase Authentication & Firestore | Autentikasi & penyimpanan data NoSQL          |
| AI Engine      | Google Gemini API                   | Percakapan, reasoning, dan explainability     |
| Visualisasi    | Recharts                            | Perbandingan alternatif & ringkasan keputusan |
| Hosting        | Vercel                              | Deployment serverless, CI/CD otomatis         |

**8.2 Alur Data**

Data konteks pengguna disimpan di Firestore, kemudian dikirim sebagai konteks percakapan ke Gemini API. Hasil analisis dari AI divisualisasikan kembali ke pengguna dalam tiga bentuk: (1) chat interaktif, (2) perbandingan alternatif, dan (3) ringkasan keputusan. Arsitektur serverless ini memungkinkan sistem berkembang ke berbagai domain keputusan tanpa perubahan infrastruktur besar.

**9. Struktur Data (Firestore — Usulan)**

| **Koleksi** | **Field Utama**                                       | **Deskripsi**                                     |
|-------------|-------------------------------------------------------|---------------------------------------------------|
| users       | uid, nama, usia, tujuan, createdAt                    | Data profil & hasil onboarding pengguna.          |
| sessions    | sessionId, uid, domain, status, createdAt             | Sesi konsultasi per domain keputusan.             |
| messages    | messageId, sessionId, role, content, timestamp        | Riwayat percakapan dalam satu sesi.               |
| decisions   | decisionId, sessionId, ringkasan, alasan, confirmedAt | Keputusan final yang telah dikonfirmasi pengguna. |
| journal     | entryId, uid, decisionId, refleksi, createdAt         | Entri Decision Journal untuk ditinjau ulang.      |

**10. Kebutuhan Non-Fungsional**

- Privasi & Keamanan: data pengguna dienkripsi in-transit, akses diatur melalui Firestore Security Rules berbasis uid.

- Performa: waktu respons AI ditargetkan di bawah 3 detik untuk pengalaman percakapan yang natural.

- Skalabilitas: arsitektur serverless (Firebase + Vercel) mendukung pertumbuhan pengguna tanpa provisioning manual.

- Aksesibilitas: antarmuka mengikuti standar kontras warna WCAG AA agar nyaman dibaca.

- Etika AI: seluruh output AI bersifat suggestive, bukan directive — keputusan akhir selalu di tangan pengguna.

**11. Panduan Gaya Desain Antarmuka (UI Style Guide)**

**11.1 Palet Warna**

| **Peran**       | **Warna**                             | **Kode Hex**        |
|-----------------|---------------------------------------|---------------------|
| Primer (Navy)   | Header, judul utama, elemen penekanan | \#1F3864            |
| Sekunder (Blue) | Aksen, tautan, tombol utama           | \#2E74B5            |
| Aksen (Teal)    | Highlight, ikon fitur, status positif | \#1CA9A0            |
| Netral          | Teks isi & latar belakang             | \#262626 / \#FFFFFF |

**11.2 Tipografi**

- Judul: Calibri/Inter Bold, ukuran besar dengan warna Navy.

- Subjudul: Calibri Semibold, warna Blue.

- Isi teks: Calibri Regular, warna abu gelap (#262626) untuk keterbacaan optimal.

**11.3 Prinsip Desain UI**

- Minimalis & bersih — fokus pada percakapan, hindari elemen dekoratif berlebihan.

- Chat bubble dengan pembeda jelas antara pesan pengguna dan AI.

- Visualisasi perbandingan alternatif menggunakan chart sederhana (bar/radar) dari Recharts.

- Setiap insight AI menampilkan label 'Kenapa saran ini?' yang dapat di-expand (explainability).

**12. Roadmap & Rencana Rilis**

| **Fase**                 | **Fokus**                                                                                       | **Output**                         |
|--------------------------|-------------------------------------------------------------------------------------------------|------------------------------------|
| Fase 1 — MVP (Hackathon) | Onboarding, Chat Konsultasi, Decision Framework (4 domain), Explainability, Konfirmasi, Journal | Aplikasi web fungsional untuk demo |
| Fase 2 — Pasca-Hackathon | Perluasan domain keputusan baru, peningkatan personalisasi AI                                   | Versi beta terbuka                 |
| Fase 3 — Pertumbuhan     | Insight analitik jangka panjang dari Decision Journal, kemungkinan integrasi mentor manusia     | Platform skala penuh               |

**13. Risiko & Mitigasi**

| **Risiko**                      | **Dampak**                            | **Mitigasi**                                                           |
|---------------------------------|---------------------------------------|------------------------------------------------------------------------|
| Ketergantungan pengguna pada AI | Mengurangi kemampuan berpikir mandiri | Explainability by Design + Konfirmasi Keputusan Eksplisit              |
| Latensi API Gemini tinggi       | Pengalaman chat terasa lambat         | Streaming response & caching konteks pengguna                          |
| Data sensitif pengguna          | Risiko privasi                        | Firestore Security Rules & enkripsi in-transit                         |
| Saran AI keliru/bias            | Keputusan pengguna terdampak negatif  | Disclaimer eksplisit + framing AI sebagai thinking aid, bukan otoritas |

**14. Potensi Dampak & Penutup**

MANTAP berpotensi menjadi platform pendamping pengambilan keputusan bagi mahasiswa, profesional muda, dan masyarakat umum untuk berbagai keputusan karier, pendidikan, relasi, maupun finansial. Rilis awal menghadirkan empat use case utama sebagai contoh implementasi Decision Framework, dan platform dapat diperluas ke domain lain tanpa mengubah prinsip utama: AI sebagai mitra berpikir yang transparan, bertanggung jawab, dan berpusat pada manusia.

Dokumen PRD ini disusun agar dapat langsung dijadikan acuan eksekusi pengembangan — baik oleh tim manusia maupun AI coding agent — dengan requirement, struktur data, dan panduan desain yang sudah terdefinisi secara eksplisit.
