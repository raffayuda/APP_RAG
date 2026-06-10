# PRD.md — Chatbot Informasi Akademik Berbasis RAG (Next.js)

## 1. Ringkasan Produk

Aplikasi ini adalah prototype **Chatbot Informasi Akademik Berbasis Retrieval-Augmented Generation (RAG)** yang dibuat menggunakan **Next.js**. Sistem memungkinkan user bertanya seputar informasi akademik, kemudian aplikasi mencari potongan dokumen kampus yang relevan dan mengirimkannya sebagai konteks ke model **Llama melalui Groq API**.

Aplikasi ini dibuat untuk mendukung penelitian/jurnal:

**Implementasi Retrieval-Augmented Generation pada Chatbot Informasi Akademik Berbasis Dokumen Kampus**

Fokus utama aplikasi adalah implementasi mekanisme RAG, bukan membuat atau melatih model AI dari awal.

---

## 2. Tujuan Produk

1. Membuat chatbot akademik berbasis web menggunakan Next.js.
2. Mengimplementasikan alur RAG pada dokumen akademik.
3. Menggunakan dokumen PDF sebagai sumber pengetahuan.
4. Menggunakan embedding dan vector database untuk pencarian konteks.
5. Menggunakan model Llama melalui Groq API untuk menghasilkan jawaban.
6. Menampilkan sumber dokumen yang digunakan oleh chatbot.
7. Menyediakan hasil implementasi yang dapat dijadikan bahan BAB III dan BAB IV jurnal.

---

## 3. Masalah yang Diselesaikan

Informasi akademik biasanya tersebar di berbagai dokumen seperti pedoman akademik, kalender akademik, panduan KRS, panduan pembayaran, dan aturan ujian. Mahasiswa sering kesulitan menemukan informasi yang tepat secara cepat.

Chatbot AI umum dapat menjawab pertanyaan, tetapi belum tentu mengetahui isi dokumen akademik kampus. Oleh karena itu, aplikasi ini menggunakan pendekatan RAG agar jawaban chatbot didasarkan pada dokumen yang tersedia.

---

## 4. Target Pengguna

### User
- Mahasiswa yang ingin bertanya tentang informasi akademik.
- Dosen/asisten dosen yang ingin mencoba prototype chatbot.
- Penguji penelitian yang ingin melihat hasil implementasi RAG.

### Admin/Peneliti
- Mengunggah dokumen akademik.
- Melakukan indexing dokumen.
- Menguji pertanyaan dan mencatat hasil evaluasi.

---

## 5. Scope Produk

### Dalam Scope

1. Halaman chatbot berbasis Next.js.
2. Input pertanyaan dari user.
3. API route untuk memproses pertanyaan.
4. Proses retrieval dari vector database.
5. Integrasi dengan model Llama melalui Groq API.
6. Jawaban chatbot berdasarkan dokumen.
7. Tampilan sumber dokumen/konteks yang digunakan.
8. Halaman atau komponen upload dokumen PDF.
9. Proses ekstraksi teks dari PDF.
10. Proses chunking dokumen.
11. Proses embedding dokumen.
12. Penyimpanan vector ke vector database.
13. Fitur evaluasi sederhana atau pencatatan hasil tanya jawab.

### Di Luar Scope

1. Login dan role user.
2. Dashboard admin kompleks.
3. Fine-tuning model Llama.
4. Training model AI dari awal.
5. Integrasi sistem akademik asli.
6. Real-time database akademik.
7. Deployment production skala besar.
8. Multi-tenant kampus.
9. Payment atau fitur non-akademik.

---

## 6. Tech Stack

### Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui opsional
- Lucide React untuk icon

### Backend
- Next.js API Route / Route Handler
- Node.js runtime

### AI dan RAG
- Groq API untuk model Llama
- Embedding: `@xenova/transformers` atau embedding provider lain
- Vector database awal: local JSON vector store
- Alternatif lebih advanced: Supabase pgvector, Qdrant, Pinecone

### PDF Processing
- `pdf-parse` atau library sejenis
- Jika bermasalah di Next.js runtime, gunakan script indexing terpisah dengan Node.js

### Penyimpanan
- Dokumen: `data/documents`
- Vector: `data/vectorstore/chunks.json`
- Evaluasi: `data/evaluation.json` atau `data/evaluation.csv`

---

## 7. Arsitektur Sistem

```text
Dokumen PDF Akademik
        ↓
Upload / Simpan ke Folder
        ↓
Ekstraksi Teks PDF
        ↓
Chunking Teks
        ↓
Embedding Chunk
        ↓
Simpan ke Vector Store
        ↓
User Bertanya
        ↓
Embedding Pertanyaan
        ↓
Similarity Search
        ↓
Ambil Chunk Relevan
        ↓
Prompt ke Llama via Groq API
        ↓
Jawaban Chatbot
        ↓
Tampilkan Jawaban + Sumber Dokumen
```

---

## 8. Struktur Folder Rekomendasi

```text
rag-chatbot-nextjs/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── ingest/route.ts
│   │   └── upload/route.ts
│   └── admin/page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   └── SourcePanel.tsx
│   └── upload/UploadDocument.tsx
├── lib/
│   ├── groq.ts
│   ├── rag.ts
│   ├── embeddings.ts
│   ├── vector-store.ts
│   ├── pdf-loader.ts
│   ├── chunker.ts
│   ├── prompt.ts
│   └── evaluation.ts
├── data/
│   ├── documents/
│   ├── vectorstore/chunks.json
│   └── evaluation.json
├── scripts/ingest.ts
├── public/
├── .env.example
├── package.json
├── README.md
├── PRD.md
└── AGENT.md
```

---

## 9. Environment Variable

Buat file `.env.local` berdasarkan `.env.example`.

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
TOP_K=4
DOCUMENT_DIR=./data/documents
VECTOR_STORE_PATH=./data/vectorstore/chunks.json
```

Jangan commit `.env.local` ke GitHub.

---

## 10. Fitur Detail

### 10.1 Halaman Chatbot

Halaman utama untuk user bertanya ke chatbot.

Acceptance criteria:
- User dapat mengetik pertanyaan.
- User dapat mengirim pertanyaan.
- Sistem menampilkan loading state.
- Sistem menampilkan jawaban chatbot.
- Sistem menampilkan sumber dokumen.
- Jika informasi tidak ditemukan, chatbot menyampaikan bahwa informasi tidak ditemukan dalam dokumen.

### 10.2 API Chat

Endpoint: `POST /api/chat`

Request:
```json
{
  "question": "Apa syarat mengikuti UAS?"
}
```

Response:
```json
{
  "answer": "Berdasarkan dokumen, ...",
  "sources": [
    {
      "text": "...",
      "source": "pedoman-akademik.pdf",
      "page": 4,
      "score": 0.82
    }
  ]
}
```

Alur:
1. Validasi pertanyaan.
2. Ambil chunk relevan dari vector store.
3. Gabungkan chunk menjadi konteks.
4. Kirim prompt ke Groq API.
5. Return jawaban dan sumber.

### 10.3 Upload Dokumen

Endpoint: `POST /api/upload`

Acceptance criteria:
- Hanya menerima PDF.
- Simpan PDF ke `data/documents`.
- Beri pesan sukses jika upload berhasil.
- Beri pesan error jika file tidak valid.

### 10.4 Ingest Dokumen

Endpoint: `POST /api/ingest` atau script:

```bash
npm run ingest
```

Proses ingest membaca PDF, mengekstrak teks, chunking, embedding, dan menyimpan ke vector store.

Acceptance criteria:
- Sistem membaca semua PDF dari folder `data/documents`.
- Sistem menghasilkan chunk.
- Sistem membuat embedding.
- Sistem menyimpan hasil ke `data/vectorstore/chunks.json`.
- Sistem menampilkan jumlah dokumen dan chunk yang berhasil diproses.

### 10.5 Chunking

Rekomendasi:
- Chunk size: 800–1200 karakter.
- Chunk overlap: 150–200 karakter.

Format chunk:
```ts
type DocumentChunk = {
  id: string;
  text: string;
  source: string;
  page?: number;
  embedding: number[];
};
```

### 10.6 Embedding

Embedding digunakan untuk mengubah chunk dan pertanyaan menjadi vector.

Rekomendasi prototype:
1. `@xenova/transformers` untuk embedding lokal.
2. Embedding API eksternal jika ingin lebih stabil.

Acceptance criteria:
- Sistem menghasilkan vector untuk chunk.
- Sistem menghasilkan vector untuk pertanyaan.
- Dimensi vector konsisten.
- Jika embedding gagal, tampilkan error yang jelas.

### 10.7 Vector Store Lokal

Untuk versi awal, vector store menggunakan JSON.

Format:
```json
[
  {
    "id": "pedoman-akademik_page_1_chunk_0",
    "text": "isi chunk",
    "source": "pedoman-akademik.pdf",
    "page": 1,
    "embedding": [0.1, 0.2, 0.3]
  }
]
```

Similarity search menggunakan cosine similarity.

### 10.8 Integrasi Groq API

File: `lib/groq.ts`

Acceptance criteria:
- API key dibaca dari `.env.local`.
- Model dibaca dari `GROQ_MODEL`.
- Temperature rendah, misalnya 0.2.
- Prompt membatasi model agar menjawab berdasarkan dokumen.
- Error dari Groq API ditangani dengan pesan yang jelas.

### 10.9 Prompt Template

```text
Kamu adalah chatbot informasi akademik.
Jawablah pertanyaan user hanya berdasarkan konteks dokumen yang diberikan.
Jika jawaban tidak tersedia dalam konteks, katakan: "Informasi tidak ditemukan dalam dokumen."
Jangan mengarang informasi di luar konteks.

Konteks:
{context}

Pertanyaan:
{question}

Jawaban:
```

### 10.10 Panel Sumber Dokumen

Tampilkan:
- Nama file.
- Halaman jika tersedia.
- Skor kemiripan.
- Potongan teks sumber.

---

## 11. Desain UI

Gaya visual:
- Modern, clean, profesional.
- Tidak terlalu ramai.
- Warna netral dengan aksen biru/ungu/oranye secukupnya.
- Layout mirip chatbot modern.
- Responsif untuk desktop dan mobile.

Struktur halaman utama:

```text
Header:
- Logo/Icon akademik
- Judul: Chatbot Informasi Akademik
- Deskripsi prototype RAG

Main:
- Area chat
- Bubble user
- Bubble assistant
- Source panel

Footer/Input:
- Textarea pertanyaan
- Button kirim
```

---

## 12. Flow User

### Flow Chat
1. User membuka halaman utama.
2. User mengetik pertanyaan.
3. User menekan tombol kirim.
4. Sistem mencari konteks dari vector store.
5. Sistem mengirim konteks ke Llama melalui Groq API.
6. Sistem menampilkan jawaban.
7. Sistem menampilkan sumber dokumen.

### Flow Admin/Ingest
1. Admin membuka halaman admin.
2. Admin upload PDF.
3. Admin klik proses ingest atau menjalankan `npm run ingest`.
4. Sistem membuat vector store.
5. Admin kembali ke halaman chatbot.
6. Chatbot dapat menjawab berdasarkan dokumen.

---

## 13. Kriteria Keberhasilan

Aplikasi berhasil jika:
1. Next.js app berjalan tanpa error.
2. User dapat mengirim pertanyaan.
3. Dokumen PDF dapat diproses.
4. Vector store berhasil dibuat.
5. Retrieval mengambil chunk relevan.
6. Groq API menghasilkan jawaban.
7. Jawaban mengikuti konteks dokumen.
8. Sumber dokumen ditampilkan.
9. Sistem dapat digunakan untuk screenshot dan pengujian jurnal.

---

## 14. Batasan Penelitian

1. Dokumen hanya berasal dari file yang diunggah atau disimpan di folder lokal.
2. Sistem tidak melakukan fine-tuning Llama.
3. Jawaban tergantung kualitas dokumen dan retrieval.
4. Evaluasi dilakukan secara manual menggunakan daftar pertanyaan uji.
5. Prototype belum ditujukan untuk production.

---

## 15. Output Akhir

1. Aplikasi web Next.js.
2. Halaman chatbot.
3. Halaman upload/index dokumen.
4. API route chat.
5. Alur RAG berjalan.
6. Integrasi Llama via Groq API.
7. Tampilan sumber dokumen.
8. Data evaluasi untuk BAB IV.
9. Screenshot aplikasi untuk laporan/jurnal.
