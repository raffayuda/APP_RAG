# DESAIN.md — Desain UI Chatbot RAG Akademik (Next.js + shadcn/ui)

## 1. Tujuan Desain

Dokumen ini menjadi panduan desain untuk aplikasi:

**Chatbot Informasi Akademik Berbasis RAG**

Aplikasi dibuat menggunakan **Next.js**, **Tailwind CSS**, dan **shadcn/ui** agar tampil modern, clean, profesional, dan cocok untuk kebutuhan screenshot laporan/jurnal.

Fokus desain:
1. Mudah digunakan untuk bertanya ke chatbot.
2. Menampilkan jawaban dengan jelas.
3. Menampilkan sumber dokumen yang digunakan oleh RAG.
4. Menyediakan halaman admin sederhana untuk upload dan indexing dokumen.
5. Tampilan tidak terlalu ramai dan tidak terlihat seperti desain generatif berlebihan.

---

## 2. Gaya Visual Utama

### 2.1 Karakter Desain

Gunakan gaya:

- Modern
- Clean
- Profesional
- Akademik
- Minimal tetapi tidak kosong
- Mudah dibaca
- Fokus pada konten dan hasil jawaban

Hindari:

- Warna terlalu banyak
- Efek neon/cyberpunk
- Animasi berlebihan
- Gradient terlalu kuat
- Layout terlalu kompleks
- Komponen yang tidak penting untuk prototype

---

## 3. Design System

## 3.1 Warna

Gunakan tema netral dari shadcn/ui.

### Warna Utama

```css
background: hsl(var(--background));
foreground: hsl(var(--foreground));
card: hsl(var(--card));
card-foreground: hsl(var(--card-foreground));
primary: hsl(var(--primary));
primary-foreground: hsl(var(--primary-foreground));
muted: hsl(var(--muted));
muted-foreground: hsl(var(--muted-foreground));
border: hsl(var(--border));
```

### Aksen Warna

Gunakan aksen secukupnya:

- Biru/ungu untuk identitas AI.
- Hijau untuk status berhasil.
- Kuning/oranye untuk peringatan.
- Merah untuk error.

Contoh penggunaan:

| Elemen | Warna |
|---|---|
| Tombol utama | `primary` |
| Background halaman | `background` |
| Card chatbot | `card` |
| Informasi sumber | `muted` |
| Status sukses | green tone |
| Warning dokumen kosong | amber/orange tone |
| Error API | destructive |

---

## 3.2 Tipografi

Gunakan font bawaan Next.js atau font modern seperti:

- Geist Sans
- Inter
- System font

Rekomendasi:

```tsx
import { Geist } from "next/font/google";
```

Ukuran teks:

| Elemen | Ukuran |
|---|---|
| Judul halaman | `text-3xl` sampai `text-4xl` |
| Subtitle | `text-base` sampai `text-lg` |
| Body | `text-sm` sampai `text-base` |
| Caption sumber | `text-xs` |
| Label | `text-sm font-medium` |

---

## 3.3 Radius dan Spacing

Gunakan gaya rounded modern:

| Elemen | Radius |
|---|---|
| Card | `rounded-2xl` |
| Chat bubble | `rounded-2xl` |
| Input | `rounded-xl` |
| Button | `rounded-xl` |
| Badge | `rounded-full` |

Spacing:

- Container utama: `max-w-5xl mx-auto px-4 py-8`
- Gap antar section: `gap-6`
- Padding card: `p-5` atau `p-6`
- Padding bubble: `px-4 py-3`

---

## 4. Library UI

Gunakan komponen **shadcn/ui** berikut:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add textarea
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add accordion
npx shadcn@latest add alert
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip
```

Komponen yang paling penting:

| Komponen | Fungsi |
|---|---|
| `Button` | Tombol kirim, upload, indexing |
| `Card` | Pembungkus section |
| `Textarea` | Input pertanyaan |
| `Badge` | Label status, top-k, model |
| `Separator` | Pemisah sidebar/section |
| `ScrollArea` | Area chat |
| `Accordion` | Menampilkan sumber dokumen |
| `Alert` | Pesan error/warning/success |
| `Skeleton` | Loading jawaban |
| `Tabs` | Admin: upload dokumen dan pengaturan |

---

## 5. Struktur Halaman

Aplikasi minimal memiliki 2 halaman:

```text
/
└── Halaman Chatbot

/admin
└── Halaman Upload dan Index Dokumen
```

Opsional:

```text
/evaluation
└── Halaman hasil evaluasi pertanyaan
```

---

## 6. Layout Utama

## 6.1 Desktop Layout

Gunakan layout dua kolom:

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├───────────────────────┬──────────────────────────────────────┤
│ Sidebar               │ Main Chat Area                        │
│ - Status dokumen      │ - Hero title                          │
│ - Model aktif         │ - Chat history                        │
│ - Tombol clear chat   │ - Source panel                        │
│ - Link admin          │ - Chat input                          │
└───────────────────────┴──────────────────────────────────────┘
```

Rekomendasi ukuran:

```tsx
<div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
```

Sidebar:

```tsx
<aside className="hidden border-r bg-muted/30 p-5 lg:block">
```

Main:

```tsx
<main className="flex min-h-screen flex-col">
```

---

## 6.2 Mobile Layout

Pada mobile:

- Sidebar disembunyikan.
- Status dokumen ditampilkan sebagai card kecil di atas chat.
- Input tetap berada di bawah.
- Chat area full width.

```tsx
<div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
```

---

## 7. Halaman Chatbot

## 7.1 Tujuan Halaman

Halaman utama digunakan oleh user untuk bertanya seputar informasi akademik berdasarkan dokumen kampus.

---

## 7.2 Komponen Halaman

### A. Header / Hero

Gunakan `Card` ringan atau section biasa.

Isi:

- Icon akademik/AI
- Judul: **Chatbot Informasi Akademik**
- Subtitle: **Prototype chatbot berbasis Retrieval-Augmented Generation (RAG) untuk pencarian informasi dokumen kampus.**
- Badge model: `Llama via Groq API`
- Badge retrieval: `RAG Aktif`

Contoh struktur:

```tsx
<section className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
      <GraduationCap className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Chatbot Informasi Akademik</h1>
      <p className="text-muted-foreground">
        Prototype chatbot berbasis RAG untuk pencarian informasi dokumen kampus.
      </p>
    </div>
  </div>

  <div className="flex flex-wrap gap-2">
    <Badge variant="secondary">Llama via Groq API</Badge>
    <Badge variant="outline">RAG Aktif</Badge>
    <Badge variant="outline">Dokumen Akademik</Badge>
  </div>
</section>
```

---

### B. Chat Area

Gunakan `Card` dan `ScrollArea`.

```tsx
<Card className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-2xl">
  <ScrollArea className="flex-1 p-4">
    {/* Messages */}
  </ScrollArea>
  <Separator />
  {/* Chat Input */}
</Card>
```

Chat area harus menampilkan:

1. Pesan user.
2. Jawaban assistant.
3. Loading skeleton saat proses.
4. Pesan error jika gagal.

---

### C. Chat Bubble User

User bubble berada di kanan.

```tsx
<div className="flex justify-end">
  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">
    {message.content}
  </div>
</div>
```

---

### D. Chat Bubble Assistant

Assistant bubble berada di kiri.

```tsx
<div className="flex justify-start">
  <div className="max-w-[85%] rounded-2xl rounded-bl-md border bg-card px-4 py-3">
    {message.content}
  </div>
</div>
```

Tambahkan icon assistant:

```tsx
<Bot className="h-4 w-4" />
```

---

### E. Source Panel

Setiap jawaban assistant harus memiliki panel sumber dokumen menggunakan `Accordion`.

Tampilan:

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="sources">
    <AccordionTrigger>
      Sumber dokumen yang digunakan
    </AccordionTrigger>
    <AccordionContent>
      {/* source list */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

Informasi sumber:

- Nama file
- Halaman jika tersedia
- Score similarity
- Potongan teks

Contoh card sumber:

```tsx
<Card className="rounded-xl bg-muted/40 p-3">
  <div className="mb-2 flex items-center justify-between gap-2">
    <p className="text-sm font-medium">pedoman-akademik.pdf</p>
    <Badge variant="outline">Score 0.82</Badge>
  </div>
  <p className="line-clamp-4 text-sm text-muted-foreground">
    Potongan teks sumber dokumen...
  </p>
</Card>
```

---

### F. Chat Input

Gunakan `Textarea` dan `Button`.

Input berada di bawah chat card.

```tsx
<form className="flex gap-3 p-4">
  <Textarea
    placeholder="Tanyakan informasi akademik..."
    className="min-h-[52px] resize-none rounded-xl"
  />
  <Button type="submit" className="h-[52px] rounded-xl px-5">
    <Send className="h-4 w-4" />
  </Button>
</form>
```

Perilaku:

- Enter untuk kirim jika memungkinkan.
- Shift + Enter untuk baris baru.
- Button disabled saat loading.
- Tampilkan spinner saat loading.

---

## 8. Sidebar

## 8.1 Tujuan Sidebar

Sidebar digunakan untuk menampilkan status sistem dan pengaturan ringan.

Isi sidebar:

1. Nama aplikasi.
2. Status dokumen.
3. Model aktif.
4. Jumlah chunk.
5. Tombol hapus riwayat chat.
6. Link ke halaman admin.
7. Catatan bahwa aplikasi menggunakan RAG.

---

## 8.2 Komponen Sidebar

Gunakan:

- `Card`
- `Badge`
- `Button`
- `Separator`
- `Alert`

Contoh isi:

```tsx
<aside className="hidden border-r bg-muted/30 p-5 lg:block">
  <div className="space-y-5">
    <div>
      <h2 className="font-semibold">Evaluasi & Pengaturan</h2>
      <p className="text-sm text-muted-foreground">
        Prototype RAG untuk penelitian.
      </p>
    </div>

    <Separator />

    <Card className="p-4">
      <p className="text-sm font-medium">Status Dokumen</p>
      <Badge className="mt-2" variant="secondary">Ter-index</Badge>
    </Card>

    <Button variant="outline" className="w-full">
      Hapus History Chat
    </Button>

    <Button variant="secondary" className="w-full">
      Buka Admin
    </Button>
  </div>
</aside>
```

---

## 9. Halaman Admin

## 9.1 Tujuan Halaman

Halaman admin digunakan oleh peneliti untuk mengelola dokumen.

Fitur minimal:

1. Upload PDF.
2. Melihat daftar dokumen.
3. Menjalankan proses indexing.
4. Melihat status vector store.

---

## 9.2 Layout Halaman Admin

```text
Header:
- Admin Dokumen RAG
- Deskripsi singkat

Tabs:
1. Upload Dokumen
2. Indexing
3. Status Vector Store
```

Gunakan `Tabs` shadcn/ui.

---

## 9.3 Upload Dokumen

Gunakan `Card`, `Input`, dan `Button`.

```tsx
<Card className="rounded-2xl p-6">
  <h3 className="text-lg font-semibold">Upload Dokumen PDF</h3>
  <p className="text-sm text-muted-foreground">
    Dokumen ini akan digunakan sebagai sumber pengetahuan chatbot.
  </p>

  <Input type="file" accept="application/pdf" />

  <Button>
    Upload Dokumen
  </Button>
</Card>
```

Acceptance UI:

- Jika file bukan PDF, tampilkan `Alert` destructive.
- Jika upload berhasil, tampilkan `Alert` success.
- Setelah upload, arahkan user untuk indexing.

---

## 9.4 Indexing Dokumen

Gunakan card instruksi:

```tsx
<Card className="rounded-2xl p-6">
  <h3 className="text-lg font-semibold">Index Dokumen</h3>
  <p className="text-sm text-muted-foreground">
    Proses ini akan membaca PDF, membuat chunk, embedding, dan menyimpan vector.
  </p>

  <Button>
    Jalankan Indexing
  </Button>
</Card>
```

Jika indexing hanya lewat terminal, tampilkan perintah:

```bash
npm run ingest
```

Dalam UI, gunakan `code` block:

```tsx
<pre className="rounded-xl bg-muted p-4 text-sm">
  npm run ingest
</pre>
```

---

## 10. Halaman Evaluasi Opsional

Halaman evaluasi digunakan untuk membantu BAB IV.

Isi:

- Tabel pertanyaan.
- Jawaban chatbot.
- Sumber dokumen.
- Skor manual.
- Catatan.

Gunakan komponen:

- `Table` dari shadcn/ui jika diinstall.
- Alternatif: gunakan card list sederhana.

Kolom evaluasi:

| No | Pertanyaan | Jawaban | Sumber | Skor | Catatan |
|---|---|---|---|---|---|

Skor:

| Skor | Arti |
|---|---|
| 1 | Tidak sesuai |
| 2 | Cukup sesuai |
| 3 | Sesuai |

---

## 11. Empty State

Aplikasi harus punya empty state yang jelas.

### Kondisi: Belum Ada Dokumen

Tampilkan `Alert`:

```tsx
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Dokumen belum tersedia</AlertTitle>
  <AlertDescription>
    Upload dokumen PDF dan jalankan proses indexing sebelum menggunakan chatbot.
  </AlertDescription>
</Alert>
```

### Kondisi: Vector Store Kosong

Pesan:

```text
Dokumen belum di-index. Silakan jalankan proses indexing terlebih dahulu.
```

### Kondisi: Pertanyaan Belum Ada

Tampilkan placeholder:

```text
Mulai dengan bertanya, misalnya: "Apa syarat mengikuti UAS?"
```

---

## 12. Loading State

Gunakan `Skeleton`.

Saat menunggu jawaban:

```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-[80%]" />
  <Skeleton className="h-4 w-[60%]" />
  <Skeleton className="h-4 w-[70%]" />
</div>
```

Saat indexing:

- Tampilkan spinner.
- Tampilkan teks: `Sedang memproses dokumen...`

---

## 13. Error State

Gunakan `Alert variant="destructive"`.

Contoh error:

1. API key belum diisi.
2. Groq API gagal.
3. Dokumen belum di-index.
4. File PDF tidak valid.
5. Pertanyaan kosong.
6. Server error.

Contoh:

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Terjadi Kesalahan</AlertTitle>
  <AlertDescription>
    Groq API key belum ditemukan. Silakan isi file .env.local.
  </AlertDescription>
</Alert>
```

---

## 14. Component List

## 14.1 ChatContainer

Lokasi:

```text
components/chat/ChatContainer.tsx
```

Tanggung jawab:

- Menyimpan state chat.
- Mengirim pertanyaan ke `/api/chat`.
- Menampilkan message list.
- Menampilkan input.
- Menangani loading dan error.

---

## 14.2 ChatMessage

Lokasi:

```text
components/chat/ChatMessage.tsx
```

Props:

```ts
type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  sources?: RetrievedChunk[];
};
```

Tanggung jawab:

- Render bubble user/assistant.
- Menampilkan source panel jika assistant punya sources.

---

## 14.3 ChatInput

Lokasi:

```text
components/chat/ChatInput.tsx
```

Props:

```ts
type ChatInputProps = {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
};
```

Tanggung jawab:

- Textarea input.
- Button kirim.
- Validasi input kosong.
- Disabled saat loading.

---

## 14.4 SourcePanel

Lokasi:

```text
components/chat/SourcePanel.tsx
```

Props:

```ts
type SourcePanelProps = {
  sources: RetrievedChunk[];
};
```

Tanggung jawab:

- Menampilkan daftar sumber dengan `Accordion`.
- Menampilkan source, page, score, dan text chunk.

---

## 14.5 UploadDocument

Lokasi:

```text
components/upload/UploadDocument.tsx
```

Tanggung jawab:

- Input file PDF.
- Tombol upload.
- Tampilkan status upload.
- Panggil `/api/upload`.

---

## 15. Icon

Gunakan `lucide-react`.

Rekomendasi icon:

| Icon | Penggunaan |
|---|---|
| `GraduationCap` | Logo aplikasi |
| `Bot` | Assistant |
| `User` | User |
| `Send` | Tombol kirim |
| `FileText` | Dokumen |
| `Database` | Vector store |
| `Upload` | Upload dokumen |
| `Search` | Retrieval |
| `Sparkles` | AI generation |
| `AlertCircle` | Error |
| `Info` | Informasi |
| `CheckCircle2` | Berhasil |
| `Trash2` | Hapus chat |

---

## 16. Copywriting UI

Gunakan bahasa Indonesia yang jelas.

### Judul
```text
Chatbot Informasi Akademik
```

### Subtitle
```text
Prototype chatbot berbasis Retrieval-Augmented Generation (RAG) untuk pencarian informasi dokumen kampus.
```

### Placeholder Input
```text
Tanyakan informasi akademik...
```

### Empty Chat
```text
Mulai dengan bertanya berdasarkan dokumen akademik yang sudah di-index.
```

### Empty Document
```text
Dokumen belum tersedia. Upload PDF dan jalankan indexing terlebih dahulu.
```

### No Answer
```text
Informasi tidak ditemukan dalam dokumen.
```

### Source Label
```text
Sumber dokumen yang digunakan
```

---

## 17. Responsive Design

Breakpoint:

| Ukuran | Perilaku |
|---|---|
| Mobile | Sidebar hidden, chat full width |
| Tablet | Content max width |
| Desktop | Sidebar + main chat |
| Large desktop | Main content tetap max width agar mudah dibaca |

Gunakan class:

```tsx
className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
```

---

## 18. Dark Mode

Boleh aktifkan dark mode dari shadcn/ui.

Jika menggunakan `next-themes`, tambahkan toggle opsional.

Untuk versi awal:
- Tidak wajib membuat toggle.
- Boleh default mengikuti system theme.
- Pastikan warna tetap terbaca di dark mode.

---

## 19. Aksesibilitas

Pastikan:

1. Button punya label jelas.
2. Input punya placeholder.
3. Warna teks kontras.
4. Loading state terlihat.
5. Error message mudah dipahami.
6. Komponen interactive dapat difokuskan dengan keyboard.
7. Jangan hanya mengandalkan warna untuk status.

---

## 20. Screenshot untuk Jurnal

Siapkan tampilan yang cocok untuk screenshot BAB IV:

1. Halaman utama chatbot.
2. Contoh user bertanya.
3. Jawaban chatbot.
4. Panel sumber dokumen terbuka.
5. Halaman admin upload dokumen.
6. Status indexing berhasil.
7. Tabel/halaman evaluasi jika dibuat.

Agar screenshot rapi:
- Gunakan ukuran browser 1366x768 atau 1440x900.
- Pastikan chat tidak terlalu penuh.
- Gunakan pertanyaan yang sesuai dokumen.
- Buka source panel saat screenshot hasil RAG.

---

## 21. Contoh Wireframe Halaman Utama

```text
┌──────────────────────────────────────────────────────────────┐
│ Sidebar                   │ Main                             │
│                           │                                  │
│ Evaluasi & Pengaturan     │ 🎓 Chatbot Informasi Akademik     │
│ ─────────────────────     │ Prototype RAG dokumen kampus     │
│ Status Dokumen            │ [Llama via Groq] [RAG Aktif]     │
│ [Ter-index]               │                                  │
│                           │ ┌──────────────────────────────┐ │
│ Model                     │ │ User: Apa syarat mengikuti... │ │
│ Llama via Groq            │ │                              │ │
│                           │ │ Bot: Berdasarkan dokumen...   │ │
│ [Hapus History Chat]      │ │ Sumber dokumen yang digunakan │ │
│ [Buka Admin]              │ └──────────────────────────────┘ │
│                           │ [Tanyakan informasi akademik...] │
└──────────────────────────────────────────────────────────────┘
```

---

## 22. Prioritas Implementasi Desain

Urutan pengerjaan desain:

1. Setup shadcn/ui.
2. Buat layout utama.
3. Buat header/hero.
4. Buat chat card.
5. Buat chat bubble.
6. Buat chat input.
7. Buat source panel.
8. Buat sidebar.
9. Buat halaman admin.
10. Tambahkan loading dan error state.
11. Rapikan responsive.
12. Ambil screenshot untuk jurnal.

---

## 23. Catatan untuk AI Coding Agent

Ketika membuat UI:

1. Gunakan komponen shadcn/ui, bukan membuat semua dari nol.
2. Prioritaskan readability.
3. Jangan membuat desain terlalu ramai.
4. Jangan menambahkan fitur yang tidak diminta.
5. Pastikan semua komponen tetap cocok dengan alur RAG.
6. Setiap jawaban assistant harus bisa menampilkan source.
7. Halaman admin cukup sederhana.
8. Jangan menaruh logic Groq di client component.
9. Client component hanya memanggil API route.
10. UI harus cocok untuk laporan/jurnal mahasiswa.

---

## 24. Contoh Struktur Komponen Final

```text
components/
├── chat/
│   ├── ChatContainer.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── SourcePanel.tsx
│   └── EmptyChat.tsx
├── layout/
│   ├── AppSidebar.tsx
│   └── PageHeader.tsx
├── upload/
│   └── UploadDocument.tsx
└── status/
    ├── DocumentStatusCard.tsx
    └── ErrorAlert.tsx
```

---

## 25. Ringkasan Desain

Desain aplikasi harus menghasilkan prototype yang:

- Terlihat modern dan profesional.
- Mudah digunakan oleh user.
- Menonjolkan fitur RAG dan sumber dokumen.
- Cocok untuk penelitian/jurnal.
- Dibangun dengan Next.js, Tailwind CSS, dan shadcn/ui.
- Tidak terlalu kompleks sehingga tetap realistis untuk mahasiswa.
