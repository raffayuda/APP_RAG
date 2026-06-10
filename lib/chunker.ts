import { DocumentChunk } from './types';

export function chunkText(text: string, source: string, page?: number): Omit<DocumentChunk, "embedding">[] {
    const chunks: Omit<DocumentChunk, "embedding">[] = [];
    const chunkSize = 1000;
    const overlap = 200;

    // Menghapus spasi dan newline berlebih
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (!cleanText) return chunks;

    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < cleanText.length) {
        let actualEndIndex = Math.min(startIndex + chunkSize, cleanText.length);

        // Jangan memotong di tengah kata jika memungkinkan
        if (actualEndIndex < cleanText.length && cleanText[actualEndIndex] !== ' ') {
            const lastSpaceIndex = cleanText.lastIndexOf(' ', actualEndIndex);
            if (lastSpaceIndex > startIndex + (chunkSize / 2)) {
                actualEndIndex = lastSpaceIndex;
            }
        }

        const chunkStr = cleanText.substring(startIndex, actualEndIndex).trim();

        if (chunkStr && chunkStr.length > 10) { // Minimal 10 karakter untuk dianggap chunk valid
            chunks.push({
                id: `${source}_p${page || 1}_c${chunkIndex}`,
                text: chunkStr,
                source: source,
                page: page || 1
            });
            chunkIndex++;
        }

        // Geser startIndex sejauh (ukuran chunk yang baru saja diambil - overlap)
        // Ini memastikan kita tidak terjebak dalam loop pada teks pendek
        const processedLength = actualEndIndex - startIndex;
        let nextStartIndex = actualEndIndex - overlap;
        
        // Jika overlap lebih besar atau sama dengan sisa teks, atau kita tidak maju, 
        // maka hentikan atau paksa maju
        if (nextStartIndex <= startIndex || actualEndIndex >= cleanText.length) {
            break; 
        }
        
        startIndex = nextStartIndex;
    }

    return chunks;
}
