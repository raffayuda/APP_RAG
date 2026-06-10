import { loadAllDocuments } from './document-loader';
import { loadFromSQLite } from './sql-loader';
import { chunkText } from './chunker';
import { embedTexts } from './embeddings';
import { saveChunks } from './vector-store';
import { DocumentChunk } from './types';
import fs from 'fs';
import path from 'path';

/**
 * Fungsi inti ingest yang bisa dipanggil dari API Route maupun Script
 */
export async function runIngest() {
    const documentDir = path.resolve(process.cwd(), process.env.DOCUMENT_DIR || './data/documents');
    console.log(`[Ingest] Memulai pemrosesan dari: ${documentDir}`);
    
    // 1. Load File (PDF, Excel, CSV)
    const fileDocs = await loadAllDocuments(documentDir);
    
    // 2. Load Database (Contoh SQLite jika ada file .db di folder data)
    const dbPath = path.resolve(process.cwd(), './data/database.sqlite');
    let dbDocs: any[] = [];
    if (fs.existsSync(dbPath)) {
        console.log(`[Ingest] Menemukan database SQLite, menarik data...`);
        dbDocs = await loadFromSQLite(dbPath);
    }

    const allLoadedDocs = [...fileDocs, ...dbDocs];
    console.log(`[Ingest] Total sumber data termuat: ${allLoadedDocs.length}`);

    if (allLoadedDocs.length === 0) {
        return { success: true, message: "Tidak ada dokumen atau database ditemukan.", chunks: 0 };
    }

    let allChunks: Omit<DocumentChunk, "embedding">[] = [];
    for (const doc of allLoadedDocs) {
        console.log(`[Ingest] Memproses ${doc.source} (${doc.text.length} karakter)...`);
        const chunks = chunkText(doc.text, doc.source, doc.page);
        allChunks = allChunks.concat(chunks);
    }

    console.log(`[Ingest] Total chunks terbentuk: ${allChunks.length}. Memulai embedding...`);

    if (allChunks.length === 0) {
        return { success: true, message: "Gagal memproses teks menjadi chunks.", chunks: 0 };
    }

    const finalChunks: DocumentChunk[] = [];
    const batchSize = 10;

    for (let i = 0; i < allChunks.length; i += batchSize) {
        const batch = allChunks.slice(i, i + batchSize);
        const texts = batch.map(c => c.text);
        const embeddings = await embedTexts(texts);

        for (let j = 0; j < batch.length; j++) {
            finalChunks.push({
                ...batch[j],
                embedding: embeddings[j]
            });
        }
    }

    await saveChunks(finalChunks);
    return { success: true, message: "Ingest multi-sumber berhasil.", chunks: finalChunks.length };
}
