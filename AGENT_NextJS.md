# AGENT.md — Instruksi AI Coding Agent untuk Next.js RAG Chatbot

## 1. Peran Agent

Kamu adalah AI coding assistant yang bertugas membantu membangun aplikasi:

**Chatbot Informasi Akademik Berbasis Retrieval-Augmented Generation (RAG) menggunakan Next.js**

Aplikasi ini digunakan untuk penelitian/jurnal mahasiswa dengan judul:

**Implementasi Retrieval-Augmented Generation pada Chatbot Informasi Akademik Berbasis Dokumen Kampus**

Fokus utama:
- Next.js sebagai web app.
- RAG sebagai mekanisme pencarian konteks dari dokumen.
- Llama via Groq API sebagai generator jawaban.
- Dokumen PDF sebagai sumber pengetahuan.
- Prototype harus mudah dijalankan dan mudah dijelaskan dalam laporan penelitian.

---

## 2. Prinsip Pengerjaan

1. Prioritaskan aplikasi berjalan, bukan fitur terlalu kompleks.
2. Gunakan TypeScript.
3. Gunakan Next.js App Router.
4. Gunakan Tailwind CSS untuk styling.
5. Gunakan Groq API untuk model Llama.
6. Jangan membuat atau melatih model AI.
7. Jangan melakukan fine-tuning.
8. Jangan hardcode API key.
9. Semua jawaban chatbot harus berbasis konteks dokumen.
10. Tampilkan sumber dokumen untuk setiap jawaban.
11. Buat kode yang mudah dipahami mahasiswa dan mudah dijelaskan pada BAB III.

---

## 3. Tech Stack Wajib

Gunakan:

```txt
Next.js
React
TypeScript
Tailwind CSS
Groq SDK
pdf-parse atau alternatif PDF parser
@xenova/transformers atau embedding provider lain
Local JSON vector store untuk prototype
```

Jika library PDF atau embedding mengalami masalah di runtime Next.js, gunakan script Node.js terpisah di folder `scripts/`.

---

## 4. Struktur Folder yang Harus Dibuat

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

## 5. Package yang Disarankan

```bash
npm install groq-sdk pdf-parse
```

Jika menggunakan embedding lokal:

```bash
npm install @xenova/transformers
```

Opsional UI:

```bash
npm install lucide-react clsx tailwind-merge
```

Jika memakai script TypeScript:

```bash
npm install -D tsx
```

---

## 6. Environment Variable

Buat `.env.example`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
TOP_K=4
DOCUMENT_DIR=./data/documents
VECTOR_STORE_PATH=./data/vectorstore/chunks.json
```

Instruksikan user membuat `.env.local` dari file tersebut.

Jangan pernah menaruh API key langsung di kode.

---

## 7. Tipe Data Utama

```ts
export type DocumentChunk = {
  id: string;
  text: string;
  source: string;
  page?: number;
  embedding: number[];
};

export type RetrievedChunk = {
  id: string;
  text: string;
  source: string;
  page?: number;
  score: number;
};

export type ChatResponse = {
  answer: string;
  sources: RetrievedChunk[];
};
```

---

## 8. File dan Tanggung Jawab

### 8.1 `lib/prompt.ts`

Berisi prompt template.

```ts
export function buildPrompt(question: string, context: string) {
  return `
Kamu adalah chatbot informasi akademik.
Jawablah pertanyaan user hanya berdasarkan konteks dokumen yang diberikan.
Jika jawaban tidak tersedia dalam konteks, katakan: "Informasi tidak ditemukan dalam dokumen."
Jangan mengarang informasi di luar konteks.

Konteks:
${context}

Pertanyaan:
${question}

Jawaban:
`;
}
```

Aturan:
- Jawaban harus bahasa Indonesia.
- Model tidak boleh mengarang di luar konteks.
- Jika konteks kosong, jawab informasi tidak ditemukan.

### 8.2 `lib/groq.ts`

Tugas:
- Membuat client Groq.
- Memanggil model Llama.
- Mengembalikan jawaban teks.

Gunakan:
```ts
import Groq from "groq-sdk";
```

Fungsi minimal:
```ts
export async function askLlama(prompt: string): Promise<string> {}
```

Ketentuan:
- Gunakan `process.env.GROQ_API_KEY`.
- Gunakan `process.env.GROQ_MODEL`.
- Temperature 0.2.
- Tangani error dengan pesan yang jelas.
- Jangan expose API key ke client component.

### 8.3 `lib/pdf-loader.ts`

Tugas:
- Membaca file PDF dari folder `data/documents`.
- Mengekstrak teks.
- Menghasilkan array teks dengan metadata source dan page jika memungkinkan.

Output minimal:
```ts
{
  text: string;
  source: string;
  page?: number;
}
```

### 8.4 `lib/chunker.ts`

Tugas:
- Memecah teks menjadi chunk.
- Gunakan chunk size 800–1200 karakter.
- Gunakan overlap 150–200 karakter.

Fungsi minimal:
```ts
export function chunkText(text: string, source: string, page?: number): Omit<DocumentChunk, "embedding">[] {}
```

Ketentuan:
- Jangan menghasilkan chunk kosong.
- Metadata source wajib ada.
- ID chunk harus unik.

### 8.5 `lib/embeddings.ts`

Tugas:
- Menghasilkan embedding untuk teks.
- Embedding digunakan untuk chunk dan query.

Fungsi minimal:
```ts
export async function embedText(text: string): Promise<number[]> {}
export async function embedTexts(texts: string[]): Promise<number[][]> {}
```

Rekomendasi:
- Gunakan `@xenova/transformers` jika memungkinkan.
- Jika terlalu berat, buat abstraction agar nanti bisa diganti embedding API lain.
- Pastikan dimensi embedding konsisten.

Catatan penting:
- Jangan memakai embedding dummy/random untuk hasil penelitian final.
- Untuk testing UI boleh mock sementara, tetapi harus diberi komentar jelas.

### 8.6 `lib/vector-store.ts`

Tugas:
- Menyimpan chunk ke file JSON.
- Membaca chunk dari file JSON.
- Melakukan cosine similarity.
- Mengambil top-k chunk relevan.

Fungsi minimal:
```ts
export async function saveChunks(chunks: DocumentChunk[]): Promise<void> {}
export async function loadChunks(): Promise<DocumentChunk[]> {}
export function cosineSimilarity(a: number[], b: number[]): number {}
export async function retrieveRelevantChunks(query: string, topK?: number): Promise<RetrievedChunk[]> {}
```

Ketentuan:
- Jika `chunks.json` belum ada, return array kosong.
- Jangan crash jika vectorstore kosong.
- Urutkan hasil berdasarkan score tertinggi.
- Ambil `TOP_K` dari env atau default 4.

### 8.7 `lib/rag.ts`

Tugas:
- Menggabungkan proses retrieval dan generation.

Fungsi minimal:
```ts
export async function answerQuestion(question: string): Promise<ChatResponse> {}
```

Alur:
1. Validasi pertanyaan.
2. Retrieve chunk relevan.
3. Jika tidak ada chunk, return jawaban "Informasi tidak ditemukan dalam dokumen."
4. Gabungkan chunk menjadi context.
5. Build prompt.
6. Kirim ke Llama via Groq.
7. Return answer dan sources.

### 8.8 `app/api/chat/route.ts`

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
  "answer": "...",
  "sources": []
}
```

Ketentuan:
- Gunakan server route.
- Jangan jalankan Groq dari client.
- Validasi body request.
- Jika question kosong, return status 400.
- Jika error server, return status 500 dengan pesan ramah.

### 8.9 `scripts/ingest.ts`

Tugas:
- Script indexing dokumen.

Alur:
1. Baca semua PDF dari `data/documents`.
2. Ekstrak teks PDF.
3. Chunking.
4. Embedding.
5. Simpan ke `data/vectorstore/chunks.json`.

Tambahkan script di `package.json`:
```json
{
  "scripts": {
    "ingest": "tsx scripts/ingest.ts"
  }
}
```

Ketentuan:
- Tampilkan jumlah dokumen yang diproses.
- Tampilkan jumlah chunk.
- Tampilkan pesan berhasil.
- Jika tidak ada PDF, tampilkan pesan agar user memasukkan PDF dahulu.

### 8.10 `app/api/ingest/route.ts`

Opsional.

Jika dibuat, endpoint ini menjalankan proses ingest dari UI admin. Untuk prototype lokal boleh dibuat, tetapi prioritas tetap `npm run ingest`.

### 8.11 `app/api/upload/route.ts`

Opsional tapi direkomendasikan.

Tugas:
- Menerima upload PDF.
- Simpan ke `data/documents`.

Ketentuan:
- Validasi tipe file PDF.
- Jangan menerima file terlalu besar.
- Return nama file yang berhasil diupload.
- Setelah upload, user tetap perlu menjalankan ingest atau klik proses ingest.

### 8.12 `app/page.tsx`

Halaman utama chatbot.

Ketentuan:
- Boleh berupa client component.
- Gunakan komponen `ChatContainer`.
- Tampilan harus bersih dan modern.
- Jangan menaruh API key di client.
- Panggil `/api/chat` menggunakan `fetch`.

### 8.13 `components/chat/ChatContainer.tsx`

Tugas:
- Mengelola state chat.
- Mengirim pertanyaan ke `/api/chat`.
- Menampilkan pesan user dan assistant.
- Menampilkan loading state.
- Menampilkan sumber dokumen.

State minimal:
```ts
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: RetrievedChunk[];
};
```

### 8.14 `components/chat/SourcePanel.tsx`

Tugas:
- Menampilkan sumber dokumen.
- Gunakan accordion/expandable.

Tampilkan:
- Nama file.
- Halaman jika ada.
- Score similarity.
- Potongan teks sumber.

### 8.15 `app/admin/page.tsx`

Halaman admin sederhana.

Fitur:
1. Upload PDF.
2. Informasi cara menjalankan ingest.
3. Status jumlah dokumen/vector jika memungkinkan.

Jika upload belum dibuat, halaman admin minimal menampilkan instruksi:
- Letakkan PDF di `data/documents`.
- Jalankan `npm run ingest`.

---

## 9. UI/UX Requirement

Desain harus:
- Modern.
- Clean.
- Profesional.
- Tidak terlalu banyak warna.
- Responsif.
- Cocok untuk screenshot jurnal.

Layout halaman utama:

```text
Header: Chatbot Informasi Akademik
Deskripsi: Prototype RAG untuk pencarian dokumen kampus
Area Chat: user bubble, assistant bubble, source accordion
Input: textarea pertanyaan + tombol kirim
```

---

## 10. Perilaku Chatbot

Chatbot wajib:
1. Menjawab dalam bahasa Indonesia.
2. Menjawab berdasarkan dokumen.
3. Menolak menjawab jika konteks tidak tersedia.
4. Tidak mengarang informasi akademik.
5. Memberikan jawaban singkat dan jelas.
6. Menampilkan sumber dokumen.

Contoh jawaban jika tidak ada informasi:
```text
Informasi tidak ditemukan dalam dokumen.
```

---

## 11. Error Handling

Tangani kondisi berikut:
1. Pertanyaan kosong.
2. Vector store belum dibuat.
3. File `chunks.json` tidak ditemukan.
4. Groq API key belum diisi.
5. Groq API error.
6. PDF tidak terbaca.
7. Embedding gagal.
8. Tidak ada dokumen di folder `data/documents`.

Pesan error harus ramah dan jelas.

---

## 12. Mode Evaluasi

Jika waktu cukup, buat fitur simpan evaluasi.

Endpoint opsional: `POST /api/evaluation`

Data:
```json
{
  "question": "...",
  "answer": "...",
  "sources": ["..."],
  "manualScore": 3,
  "notes": "Sesuai dokumen"
}
```

Simpan ke `data/evaluation.json`.

---

## 13. README yang Harus Dibuat

Buat README berisi:
1. Deskripsi aplikasi.
2. Tech stack.
3. Cara install dependency.
4. Cara membuat `.env.local`.
5. Cara menaruh dokumen PDF.
6. Cara menjalankan ingest.
7. Cara menjalankan Next.js.
8. Cara menggunakan chatbot.
9. Alur RAG singkat.

Contoh command:
```bash
npm install
cp .env.example .env.local
npm run ingest
npm run dev
```

---

## 14. Package Script

Pastikan `package.json` punya scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "ingest": "tsx scripts/ingest.ts"
  }
}
```

---

## 15. Prioritas Pengerjaan

1. Setup Next.js + Tailwind + TypeScript.
2. Buat UI chatbot statis.
3. Buat `/api/chat` dengan response dummy.
4. Buat Groq integration.
5. Buat prompt template.
6. Buat PDF loader.
7. Buat chunker.
8. Buat embedding.
9. Buat vector store lokal.
10. Buat script ingest.
11. Hubungkan retrieval ke `/api/chat`.
12. Tampilkan source panel.
13. Tambahkan upload/admin jika waktu cukup.
14. Tambahkan evaluasi jika waktu cukup.

---

## 16. Larangan

Jangan:
1. Hardcode API key.
2. Menaruh Groq call di client component.
3. Menggunakan embedding random untuk final.
4. Mengarang isi dokumen.
5. Menghapus metadata source.
6. Membuat fitur login dulu.
7. Membuat dashboard terlalu kompleks.
8. Mengabaikan error vector store kosong.
9. Menyimpan file besar ke GitHub.
10. Mengklaim model dilatih sendiri.

---

## 17. Catatan untuk Jurnal

Kode harus mendukung penjelasan pada jurnal.

### BAB III
- Alur sistem RAG.
- Proses dokumen → chunk → embedding → retrieval → generation.
- Penggunaan Llama via Groq API.
- Tools dan library.

### BAB IV
- Screenshot halaman chatbot.
- Screenshot sumber dokumen.
- Tabel pertanyaan dan jawaban.
- Analisis jawaban sesuai/tidak sesuai dokumen.
- Perbandingan dengan dan tanpa RAG jika dibuat.

---

## 18. Output Akhir

Aplikasi akhir harus bisa:
1. Menampilkan halaman chatbot.
2. Menerima pertanyaan user.
3. Membaca vector store.
4. Mengambil chunk relevan.
5. Mengirim prompt ke Llama via Groq API.
6. Menampilkan jawaban.
7. Menampilkan sumber dokumen.
8. Memproses dokumen melalui script ingest.
9. Digunakan untuk pengujian jurnal.
