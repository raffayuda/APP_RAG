# Chatbot Informasi Akademik Berbasis RAG (Next.js)

Aplikasi ini merupakan _prototype_ **Chatbot Informasi Akademik** yang diimplementasikan menggunakan pendekatan **Retrieval-Augmented Generation (RAG)**. Dibangun di atas kerangka kerja **Next.js**, aplikasi ini menelusuri dokumen PDF akademik (seperti pedoman KRS, dsb.), mengekstrak potongan teks yang relevan (_chunking_), menyimpannya ke dalam _vector database_ lokal (JSON), dan memberikan konteks yang tepat kepada **Llama 3.1** via **Groq API** untuk menghasilkan jawaban yang berlandaskan fakta kampus.

## Tech Stack Utama

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui.
*   **Backend:** Node.js (API Routes Next.js), tsx (Scripts).
*   **AI & NLP:** 
    *   `@xenova/transformers` (Local Embedding: `all-MiniLM-L6-v2`)
    *   `groq-sdk` (Llama via Groq API)
*   **Parser & Utilitas:** `pdf-parse`, JSON Vector Store kustom.

## Struktur & Alur RAG

1.  **Ingest (Indexing):** PDF dibaca dari folder `data/documents`, dipecah menjadi chunks, kemudian dikonversi menjadi representasi vektor (embedding) menggunakan model lokal Xenova. Data vektor disimpan pada `data/vectorstore/chunks.json`.
2.  **Retrieval:** Saat user bertanya, pertanyaan tersebut di-embed. Pencarian kesamaan (Cosine Similarity) dilakukan terhadap _vector store_ untuk menarik _top-K chunks_ teks dokumen yang relevan.
3.  **Generation:** Chunks teks yang ditarik dirangkai menjadi 'Konteks' lalu dikirim bersama 'Pertanyaan' ke model Llama (Groq API). Model akan membalas secara ringkas menggunakan Bahasa Indonesia.

## Panduan Instalasi & Eksekusi

### 1. Kloning Repositori & Instalasi
Buka terminal dan instal dependensi menggunakan npm:
```bash
npm install
```

### 2. Setup Environment Variables
Salin contoh konfigurasi _environment_:
```bash
cp .env.example .env.local
```
Lalu buka file `.env.local` dan isi `GROQ_API_KEY` milik Anda. Anda bisa mendaftar di Groq Console untuk mendapatkannya secara gratis.

### 3. Masukkan Dokumen Kampus (PDF)
Letakkan dokumen PDF yang berisi informasi kampus ke dalam direktori:
```text
./data/documents
```
Atau Anda dapat mengunggahnya melalui antarmuka web di halaman Admin (nantinya).

### 4. Menjalankan Proses Ingest (Indexing)
Agar _chatbot_ bisa "memahami" dokumen tersebut, Anda wajib melakukan eksekusi ini **setiap kali** Anda menambah/mengubah file PDF:
```bash
npm run ingest
```
_Catatan:_ Eksekusi pertama akan sedikit lama karena Node.js harus mengunduh model embedding (`Xenova/all-MiniLM-L6-v2`) dari HuggingFace (sekitar 20MB).

### 5. Jalankan Web App Next.js
Mulai _development server_:
```bash
npm run dev
```

Buka _browser_ dan arahkan ke [http://localhost:3000](http://localhost:3000).
- Halaman Utama (Chatbot): `/`
- Halaman Admin Dokumen: `/admin`

## Catatan Evaluasi Jurnal

Aplikasi ini disesuaikan tampilannya secara minimalis (tanpa _noise_ elemen UI berlebih) sehingga amat cocok jika ingin Anda pakai di dalam pengujian BAB IV pada skripsi/jurnal. Setiap jawaban _assistant_ dilengkapi fitur _Accordion_ untuk menyibak referensi (*Source Panel*), menunjukkan persentase *Similarity Score*, nama halaman referensi, dan kutipan spesifik dari PDF, sehingga prinsip _Retrieval-Augmented Generation_ sangat jelas terlihat secara visual.
