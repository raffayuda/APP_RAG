#!/usr/bin/env python3
"""
generate_rag_research_outputs.py

Script untuk membuat output angka/tabel hasil penelitian dari proyek APP_RAG.

Cara pakai:
1. Simpan file ini di root project APP_RAG.
2. Pastikan sudah menjalankan:
   npm run ingest
3. Jalankan:
   python generate_rag_research_outputs.py

Output:
- output_penelitian_rag/hasil_indexing.csv
- output_penelitian_rag/ringkasan_chunk.csv
- output_penelitian_rag/kategori_informasi.csv
- output_penelitian_rag/statistik_embedding.csv
- output_penelitian_rag/tabel_jurnal.md

Catatan:
Script ini membaca hasil indexing dari data/vectorstore/chunks.json.
Jadi angka yang muncul mengikuti hasil nyata dari project kamu.
"""

from __future__ import annotations

import csv
import json
import math
import re
from collections import Counter
from pathlib import Path
from statistics import mean, median
from typing import Any, Dict, Iterable, List, Optional, Tuple


# =========================
# KONFIGURASI SESUAI PROJECT
# =========================

DOCUMENTS_DIR = Path("data/documents")
VECTORSTORE_PATH = Path("data/vectorstore/chunks.json")
OUTPUT_DIR = Path("output_penelitian_rag")

CHUNK_SIZE_KARAKTER = 1000
CHUNK_OVERLAP_KARAKTER = 200
EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"
VECTOR_STORE = "JSON lokal"
SIMILARITY_METHOD = "Cosine similarity"
DEFAULT_TOP_K = 4
SIMILARITY_THRESHOLD = 0.35

CATEGORY_KEYWORDS = {
    "Aturan akademik": [
        "aturan akademik", "perkuliahan", "akademik", "ujian", "uas", "uts",
        "krs", "kehadiran", "presensi"
    ],
    "Syarat kelulusan": [
        "syarat kelulusan", "kelulusan", "sks", "ipk", "tugas akhir",
        "sertifikat", "masa studi"
    ],
    "Panduan tugas akhir": [
        "tugas akhir", "skripsi", "bimbingan", "seminar", "sidang",
        "proposal", "laporan tugas akhir"
    ],
    "Pedoman MBKM": [
        "mbkm", "kampus merdeka", "magang", "studi independen",
        "pertukaran mahasiswa", "proyek kemanusiaan"
    ],
    "Kode etik mahasiswa": [
        "kode etik", "etika", "mahasiswa", "hak", "kewajiban",
        "pelanggaran", "sanksi"
    ],
}


def normalize_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def safe_float(value: Any) -> Optional[float]:
    try:
        return float(value)
    except Exception:
        return None


def vector_norm(vector: Iterable[Any]) -> Optional[float]:
    values = [safe_float(x) for x in vector]
    values = [x for x in values if x is not None]
    if not values:
        return None
    return math.sqrt(sum(x * x for x in values))


def read_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(
            f"File tidak ditemukan: {path}\n"
            "Pastikan kamu sudah menjalankan `npm run ingest` terlebih dahulu."
        )

    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def extract_chunks(raw: Any) -> List[Dict[str, Any]]:
    if isinstance(raw, list):
        return raw

    if isinstance(raw, dict):
        for key in ("chunks", "data", "documents", "items"):
            if key in raw and isinstance(raw[key], list):
                return raw[key]

    raise ValueError(
        "Format chunks.json tidak dikenali. "
        "Pastikan file berisi list chunk atau object dengan key `chunks`."
    )


def get_chunk_text(chunk: Dict[str, Any]) -> str:
    for key in ("text", "content", "pageContent", "chunk", "document"):
        value = chunk.get(key)
        if isinstance(value, str):
            return normalize_text(value)

    metadata = chunk.get("metadata")
    if isinstance(metadata, dict):
        for key in ("text", "content"):
            value = metadata.get(key)
            if isinstance(value, str):
                return normalize_text(value)

    return ""


def get_embedding(chunk: Dict[str, Any]) -> List[float]:
    for key in ("embedding", "vector", "values"):
        value = chunk.get(key)
        if isinstance(value, list):
            return [float(x) for x in value if safe_float(x) is not None]

    return []


def get_metadata(chunk: Dict[str, Any]) -> Dict[str, Any]:
    metadata = chunk.get("metadata")
    if isinstance(metadata, dict):
        return metadata
    return {}


def get_source_name(chunk: Dict[str, Any]) -> str:
    metadata = get_metadata(chunk)

    for obj in (chunk, metadata):
        for key in ("source", "file", "filename", "fileName", "doc", "document", "path"):
            value = obj.get(key) if isinstance(obj, dict) else None
            if isinstance(value, str) and value.strip():
                return Path(value).name

    return "Tidak diketahui"


def get_page_number(chunk: Dict[str, Any]) -> str:
    metadata = get_metadata(chunk)

    for obj in (chunk, metadata):
        for key in ("page", "pageNumber", "page_number", "loc"):
            value = obj.get(key) if isinstance(obj, dict) else None
            if value is not None:
                if isinstance(value, dict):
                    for subkey in ("pageNumber", "page", "line"):
                        if subkey in value:
                            return str(value[subkey])
                return str(value)

    return "-"


def count_pdf_pages(pdf_path: Path) -> Optional[int]:
    try:
        from pypdf import PdfReader  # type: ignore
        reader = PdfReader(str(pdf_path))
        return len(reader.pages)
    except Exception:
        pass

    try:
        from PyPDF2 import PdfReader  # type: ignore
        reader = PdfReader(str(pdf_path))
        return len(reader.pages)
    except Exception:
        return None


def write_csv(path: Path, rows: List[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    if not rows:
        path.write_text("", encoding="utf-8")
        return

    fieldnames = list(rows[0].keys())

    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def markdown_table(headers: List[str], rows: List[List[Any]]) -> str:
    def fmt(value: Any) -> str:
        return str(value).replace("\n", " ")

    output = []
    output.append("| " + " | ".join(headers) + " |")
    output.append("| " + " | ".join(["---"] * len(headers)) + " |")
    for row in rows:
        output.append("| " + " | ".join(fmt(value) for value in row) + " |")
    return "\n".join(output)


def detect_main_pdf() -> Optional[Path]:
    if not DOCUMENTS_DIR.exists():
        return None

    pdfs = sorted(DOCUMENTS_DIR.glob("*.pdf"))
    if not pdfs:
        return None

    priority_keywords = ["rag", "akademik", "sttnf", "nf", "dokumen"]
    for pdf in pdfs:
        name = pdf.name.lower()
        if any(k in name for k in priority_keywords):
            return pdf

    return pdfs[0]


def analyze_vectorstore() -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    raw = read_json(VECTORSTORE_PATH)
    chunks = extract_chunks(raw)

    cleaned_chunks = []
    for idx, chunk in enumerate(chunks, start=1):
        if not isinstance(chunk, dict):
            continue

        text = get_chunk_text(chunk)
        embedding = get_embedding(chunk)
        source = get_source_name(chunk)
        page = get_page_number(chunk)

        cleaned_chunks.append({
            "no": idx,
            "source": source,
            "page": page,
            "text": text,
            "char_count": len(text),
            "word_count": word_count(text),
            "embedding_dim": len(embedding),
            "embedding_norm": vector_norm(embedding),
        })

    if not cleaned_chunks:
        raise ValueError("Tidak ada chunk valid yang ditemukan di chunks.json.")

    char_counts = [c["char_count"] for c in cleaned_chunks]
    word_counts = [c["word_count"] for c in cleaned_chunks]
    dims = [c["embedding_dim"] for c in cleaned_chunks if c["embedding_dim"] > 0]
    norms = [c["embedding_norm"] for c in cleaned_chunks if c["embedding_norm"] is not None]
    sources = Counter(c["source"] for c in cleaned_chunks)

    main_pdf = detect_main_pdf()
    pages = count_pdf_pages(main_pdf) if main_pdf else None

    summary = {
        "main_document": main_pdf.name if main_pdf else "Tidak ditemukan",
        "pdf_pages": pages if pages is not None else "Tidak terbaca",
        "total_chunks": len(cleaned_chunks),
        "total_embeddings": len(dims),
        "embedding_dim": dims[0] if dims else "Tidak ditemukan",
        "avg_chars_per_chunk": round(mean(char_counts), 2),
        "median_chars_per_chunk": round(median(char_counts), 2),
        "min_chars_per_chunk": min(char_counts),
        "max_chars_per_chunk": max(char_counts),
        "avg_words_per_chunk": round(mean(word_counts), 2),
        "source_count": len(sources),
        "sources": dict(sources),
        "avg_embedding_norm": round(mean(norms), 4) if norms else "Tidak ditemukan",
    }

    return cleaned_chunks, summary


def category_coverage(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = []

    for category, keywords in CATEGORY_KEYWORDS.items():
        matched_chunks = set()
        matched_keywords = Counter()

        for chunk in chunks:
            text = chunk["text"].lower()
            for keyword in keywords:
                if keyword.lower() in text:
                    matched_chunks.add(chunk["no"])
                    matched_keywords[keyword] += 1

        top_keywords = ", ".join([kw for kw, _ in matched_keywords.most_common(5)])
        rows.append({
            "Kategori Informasi": category,
            "Jumlah Chunk Terkait": len(matched_chunks),
            "Keyword Dominan": top_keywords if top_keywords else "-",
            "Keterangan": "Ditemukan" if matched_chunks else "Tidak ditemukan",
        })

    return rows


def chunk_rows_for_csv(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows = []

    for c in chunks:
        rows.append({
            "No": c["no"],
            "Sumber": c["source"],
            "Halaman": c["page"],
            "Jumlah Karakter": c["char_count"],
            "Jumlah Kata": c["word_count"],
            "Dimensi Embedding": c["embedding_dim"],
            "Norm Embedding": round(c["embedding_norm"], 6) if c["embedding_norm"] is not None else "",
            "Preview Teks": c["text"][:180] + ("..." if len(c["text"]) > 180 else ""),
        })

    return rows


def build_markdown_report(
    chunks: List[Dict[str, Any]],
    summary: Dict[str, Any],
    categories: List[Dict[str, Any]]
) -> str:
    vectorstore_str = str(VECTORSTORE_PATH).replace("\\", "/").replace("\\", "/")

    indexing_rows = [
        ["Dokumen utama", summary["main_document"]],
        ["Jumlah halaman PDF", summary["pdf_pages"]],
        ["Format dokumen", "PDF"],
        ["Library ekstraksi", "pdf-parse"],
        ["Ukuran chunk", f"{CHUNK_SIZE_KARAKTER} karakter"],
        ["Overlap chunk", f"{CHUNK_OVERLAP_KARAKTER} karakter"],
        ["Jumlah chunk terbentuk", summary["total_chunks"]],
        ["Jumlah embedding", summary["total_embeddings"]],
        ["Dimensi embedding", summary["embedding_dim"]],
        ["Model embedding", EMBEDDING_MODEL],
        ["Vector store", VECTOR_STORE],
        ["Lokasi vector store", vectorstore_str],
    ]

    chunk_stat_rows = [
        ["Rata-rata karakter per chunk", summary["avg_chars_per_chunk"]],
        ["Median karakter per chunk", summary["median_chars_per_chunk"]],
        ["Karakter minimum per chunk", summary["min_chars_per_chunk"]],
        ["Karakter maksimum per chunk", summary["max_chars_per_chunk"]],
        ["Rata-rata kata per chunk", summary["avg_words_per_chunk"]],
        ["Rata-rata norm embedding", summary["avg_embedding_norm"]],
    ]

    category_rows = [
        [
            row["Kategori Informasi"],
            row["Jumlah Chunk Terkait"],
            row["Keyword Dominan"],
            row["Keterangan"],
        ]
        for row in categories
    ]

    tools_rows = [
        ["Framework web", "Next.js", "Membangun aplikasi web dan API route"],
        ["Ekstraksi dokumen", "pdf-parse", "Mengambil teks dari PDF"],
        ["Embedding", EMBEDDING_MODEL, "Mengubah chunk menjadi vektor"],
        ["Vector store", VECTOR_STORE, "Menyimpan chunk, metadata, dan embedding"],
        ["Similarity search", SIMILARITY_METHOD, "Mengambil chunk paling relevan"],
        ["Top-k retrieval", DEFAULT_TOP_K, "Jumlah chunk relevan yang diambil"],
        ["Threshold similarity", SIMILARITY_THRESHOLD, "Batas minimum relevansi chunk"],
        ["Model generatif", "LLaMA melalui Groq API", "Menghasilkan jawaban berbasis konteks"],
        ["Deployment", "Vercel", "Menjalankan prototype berbasis web"],
    ]

    sample_chunk_rows = []
    for c in chunks[:5]:
        sample_chunk_rows.append([
            c["no"],
            c["source"],
            c["page"],
            c["char_count"],
            c["word_count"],
            c["embedding_dim"],
        ])

    report = f"""# Output Hasil Penelitian RAG

File ini dibuat otomatis dari hasil indexing project APP_RAG.

## Tabel 3. Hasil Indexing Dokumen Akademik

{markdown_table(["Komponen", "Hasil"], indexing_rows)}

## Tabel 4. Statistik Chunk dan Embedding

{markdown_table(["Metrik", "Hasil"], chunk_stat_rows)}

## Tabel 5. Cakupan Informasi pada Dokumen NF

{markdown_table(["Kategori Informasi", "Jumlah Chunk Terkait", "Keyword Dominan", "Keterangan"], category_rows)}

## Tabel 6. Tools dan Konfigurasi Sistem

{markdown_table(["Komponen", "Tools/Konfigurasi", "Fungsi"], tools_rows)}

## Tabel 7. Sampel Chunk Hasil Indexing

{markdown_table(["No", "Sumber", "Halaman", "Jumlah Karakter", "Jumlah Kata", "Dimensi Embedding"], sample_chunk_rows)}

## Kalimat Siap Pakai untuk Bab Hasil Penelitian

Berdasarkan hasil indexing, dokumen akademik {summary["main_document"]} berhasil diproses menjadi {summary["total_chunks"]} chunk teks. Setiap chunk diubah menjadi embedding menggunakan model {EMBEDDING_MODEL} dengan dimensi embedding sebesar {summary["embedding_dim"]}. Hasil chunk, metadata, dan embedding disimpan pada vector store lokal berbentuk JSON di direktori {vectorstore_str}. Rata-rata panjang chunk yang dihasilkan adalah {summary["avg_chars_per_chunk"]} karakter, dengan panjang minimum {summary["min_chars_per_chunk"]} karakter dan maksimum {summary["max_chars_per_chunk"]} karakter.

Hasil analisis cakupan informasi menunjukkan bahwa dokumen akademik memuat beberapa kategori informasi yang relevan untuk chatbot, yaitu aturan akademik, syarat kelulusan, panduan tugas akhir, pedoman MBKM, dan kode etik mahasiswa. Informasi tersebut menjadi dasar bagi sistem Retrieval-Augmented Generation dalam mengambil konteks yang relevan sebelum menghasilkan jawaban menggunakan model LLaMA melalui Groq API.
"""

    return report


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    chunks, summary = analyze_vectorstore()
    categories = category_coverage(chunks)

    hasil_indexing_rows = [
        {"Komponen": "Dokumen utama", "Hasil": summary["main_document"]},
        {"Komponen": "Jumlah halaman PDF", "Hasil": summary["pdf_pages"]},
        {"Komponen": "Format dokumen", "Hasil": "PDF"},
        {"Komponen": "Library ekstraksi", "Hasil": "pdf-parse"},
        {"Komponen": "Ukuran chunk", "Hasil": f"{CHUNK_SIZE_KARAKTER} karakter"},
        {"Komponen": "Overlap chunk", "Hasil": f"{CHUNK_OVERLAP_KARAKTER} karakter"},
        {"Komponen": "Jumlah chunk terbentuk", "Hasil": summary["total_chunks"]},
        {"Komponen": "Jumlah embedding", "Hasil": summary["total_embeddings"]},
        {"Komponen": "Dimensi embedding", "Hasil": summary["embedding_dim"]},
        {"Komponen": "Model embedding", "Hasil": EMBEDDING_MODEL},
        {"Komponen": "Vector store", "Hasil": VECTOR_STORE},
        {"Komponen": "Lokasi vector store", "Hasil": str(VECTORSTORE_PATH).replace("\\", "/").replace("\\", "/")},
    ]

    ringkasan_chunk_rows = [
        {"Metrik": "Rata-rata karakter per chunk", "Hasil": summary["avg_chars_per_chunk"]},
        {"Metrik": "Median karakter per chunk", "Hasil": summary["median_chars_per_chunk"]},
        {"Metrik": "Karakter minimum per chunk", "Hasil": summary["min_chars_per_chunk"]},
        {"Metrik": "Karakter maksimum per chunk", "Hasil": summary["max_chars_per_chunk"]},
        {"Metrik": "Rata-rata kata per chunk", "Hasil": summary["avg_words_per_chunk"]},
        {"Metrik": "Rata-rata norm embedding", "Hasil": summary["avg_embedding_norm"]},
    ]

    statistik_embedding_rows = [
        {
            "No": c["no"],
            "Sumber": c["source"],
            "Halaman": c["page"],
            "Dimensi Embedding": c["embedding_dim"],
            "Norm Embedding": round(c["embedding_norm"], 6) if c["embedding_norm"] is not None else "",
        }
        for c in chunks
    ]

    write_csv(OUTPUT_DIR / "hasil_indexing.csv", hasil_indexing_rows)
    write_csv(OUTPUT_DIR / "ringkasan_chunk.csv", ringkasan_chunk_rows)
    write_csv(OUTPUT_DIR / "kategori_informasi.csv", categories)
    write_csv(OUTPUT_DIR / "statistik_embedding.csv", statistik_embedding_rows)
    write_csv(OUTPUT_DIR / "detail_chunk.csv", chunk_rows_for_csv(chunks))

    report = build_markdown_report(chunks, summary, categories)
    (OUTPUT_DIR / "tabel_jurnal.md").write_text(report, encoding="utf-8")

    print("\n=== HASIL ANALISIS DATA PREPARATION RAG ===\n")
    print(f"Dokumen utama            : {summary['main_document']}")
    print(f"Jumlah halaman PDF       : {summary['pdf_pages']}")
    print(f"Jumlah chunk terbentuk   : {summary['total_chunks']}")
    print(f"Jumlah embedding         : {summary['total_embeddings']}")
    print(f"Dimensi embedding        : {summary['embedding_dim']}")
    print(f"Rata-rata karakter/chunk : {summary['avg_chars_per_chunk']}")
    print(f"Min - Max karakter/chunk : {summary['min_chars_per_chunk']} - {summary['max_chars_per_chunk']}")
    print(f"Model embedding          : {EMBEDDING_MODEL}")
    print(f"Vector store             : {VECTOR_STORE}")
    print(f"Lokasi vector store      : {VECTORSTORE_PATH}")
    print(f"Similarity search        : {SIMILARITY_METHOD}")
    print(f"Top-K default            : {DEFAULT_TOP_K}")
    print(f"Threshold similarity     : {SIMILARITY_THRESHOLD}")

    print("\n=== CAKUPAN INFORMASI DOKUMEN NF ===\n")
    for row in categories:
        print(
            f"- {row['Kategori Informasi']}: "
            f"{row['Jumlah Chunk Terkait']} chunk terkait "
            f"({row['Keterangan']})"
        )

    print("\nFile output berhasil dibuat di folder:")
    print(f"  {OUTPUT_DIR.resolve()}")
    print("\nFile utama untuk dicopy ke jurnal:")
    print(f"  {(OUTPUT_DIR / 'tabel_jurnal.md').resolve()}\n")


if __name__ == "__main__":
    main()
