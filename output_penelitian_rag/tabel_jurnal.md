# Output Hasil Penelitian RAG

File ini dibuat otomatis dari hasil indexing project APP_RAG.

## Tabel 3. Hasil Indexing Dokumen Akademik

| Komponen | Hasil |
| --- | --- |
| Dokumen utama | Dokumen_RAG_Akademik_STTNF.pdf |
| Jumlah halaman PDF | 7 |
| Format dokumen | PDF |
| Library ekstraksi | pdf-parse |
| Ukuran chunk | 1000 karakter |
| Overlap chunk | 200 karakter |
| Jumlah chunk terbentuk | 70 |
| Jumlah embedding | 70 |
| Dimensi embedding | 384 |
| Model embedding | Xenova/all-MiniLM-L6-v2 |
| Vector store | JSON lokal |
| Lokasi vector store | data/vectorstore/chunks.json |

## Tabel 4. Statistik Chunk dan Embedding

| Metrik | Hasil |
| --- | --- |
| Rata-rata karakter per chunk | 955.44 |
| Median karakter per chunk | 995.0 |
| Karakter minimum per chunk | 112 |
| Karakter maksimum per chunk | 1000 |
| Rata-rata kata per chunk | 136.1 |
| Rata-rata norm embedding | 1.0 |

## Tabel 5. Cakupan Informasi pada Dokumen NF

| Kategori Informasi | Jumlah Chunk Terkait | Keyword Dominan | Keterangan |
| --- | --- | --- | --- |
| Aturan akademik | 28 | akademik, ujian, uas, presensi, aturan akademik | Ditemukan |
| Syarat kelulusan | 15 | tugas akhir, kelulusan, sks, syarat kelulusan, masa studi | Ditemukan |
| Panduan tugas akhir | 16 | tugas akhir, skripsi, seminar, sidang | Ditemukan |
| Pedoman MBKM | 9 | mbkm, kampus merdeka, magang, proyek kemanusiaan | Ditemukan |
| Kode etik mahasiswa | 28 | mahasiswa, kode etik, etika, hak, kewajiban | Ditemukan |

## Tabel 6. Tools dan Konfigurasi Sistem

| Komponen | Tools/Konfigurasi | Fungsi |
| --- | --- | --- |
| Framework web | Next.js | Membangun aplikasi web dan API route |
| Ekstraksi dokumen | pdf-parse | Mengambil teks dari PDF |
| Embedding | Xenova/all-MiniLM-L6-v2 | Mengubah chunk menjadi vektor |
| Vector store | JSON lokal | Menyimpan chunk, metadata, dan embedding |
| Similarity search | Cosine similarity | Mengambil chunk paling relevan |
| Top-k retrieval | 4 | Jumlah chunk relevan yang diambil |
| Threshold similarity | 0.35 | Batas minimum relevansi chunk |
| Model generatif | LLaMA melalui Groq API | Menghasilkan jawaban berbasis konteks |
| Deployment | Vercel | Menjalankan prototype berbasis web |

## Tabel 7. Sampel Chunk Hasil Indexing

| No | Sumber | Halaman | Jumlah Karakter | Jumlah Kata | Dimensi Embedding |
| --- | --- | --- | --- | --- | --- |
| 1 | 11.Modern_IDS_IPS_Blueprint.pptx.pdf | 1 | 112 | 14 | 384 |
| 2 | 11_regression_stat2.pdf | 1 | 985 | 117 | 384 |
| 3 | 11_regression_stat2.pdf | 1 | 995 | 134 | 384 |
| 4 | 11_regression_stat2.pdf | 1 | 987 | 116 | 384 |
| 5 | 11_regression_stat2.pdf | 1 | 987 | 110 | 384 |

## Kalimat Siap Pakai untuk Bab Hasil Penelitian

Berdasarkan hasil indexing, dokumen akademik Dokumen_RAG_Akademik_STTNF.pdf berhasil diproses menjadi 70 chunk teks. Setiap chunk diubah menjadi embedding menggunakan model Xenova/all-MiniLM-L6-v2 dengan dimensi embedding sebesar 384. Hasil chunk, metadata, dan embedding disimpan pada vector store lokal berbentuk JSON di direktori data/vectorstore/chunks.json. Rata-rata panjang chunk yang dihasilkan adalah 955.44 karakter, dengan panjang minimum 112 karakter dan maksimum 1000 karakter.

Hasil analisis cakupan informasi menunjukkan bahwa dokumen akademik memuat beberapa kategori informasi yang relevan untuk chatbot, yaitu aturan akademik, syarat kelulusan, panduan tugas akhir, pedoman MBKM, dan kode etik mahasiswa. Informasi tersebut menjadi dasar bagi sistem Retrieval-Augmented Generation dalam mengambil konteks yang relevan sebelum menghasilkan jawaban menggunakan model LLaMA melalui Groq API.
