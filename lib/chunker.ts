import { DocumentChunk } from './types';

export function chunkText(text: string, source: string, page?: number): Omit<DocumentChunk, "embedding">[] {
    const chunks: Omit<DocumentChunk, "embedding">[] = [];
    const chunkSize = 1500;
    const overlap = 400;

    // Menghapus spasi horizontal berlebih tapi tetap mempertahankan newline
    const cleanText = text.replace(/[ \t]+/g, ' ').replace(/\r\n/g, '\n').trim();
    
    if (!cleanText) return chunks;

    // Pisahkan berdasarkan newline untuk mencoba menjaga integritas baris
    const lines = cleanText.split('\n');
    let currentChunkText = "";
    let chunkIndex = 0;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Jika menambahkan baris ini melebihi chunkSize, simpan chunk saat ini
        if (currentChunkText.length + trimmedLine.length > chunkSize && currentChunkText.length > 0) {
            chunks.push({
                id: `${source}_p${page || 1}_c${chunkIndex}`,
                text: currentChunkText.trim(),
                source: source,
                page: page || 1
            });
            chunkIndex++;

            // Implementasi overlap sederhana: ambil 200 karakter terakhir dari chunk sebelumnya
            const overlapText = currentChunkText.substring(Math.max(0, currentChunkText.length - overlap));
            currentChunkText = overlapText + "\n" + trimmedLine + "\n";
        } else {
            currentChunkText += trimmedLine + "\n";
        }
    }

    // Tambahkan sisa teks sebagai chunk terakhir
    if (currentChunkText.trim().length > 10) {
        chunks.push({
            id: `${source}_p${page || 1}_c${chunkIndex}`,
            text: currentChunkText.trim(),
            source: source,
            page: page || 1
        });
    }

    return chunks;
}
