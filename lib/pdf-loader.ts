import fs from 'fs';
import path from 'path';

export type LoadedDocument = {
    text: string;
    source: string;
    page?: number;
};

export async function loadPDFs(directoryPath: string): Promise<LoadedDocument[]> {
    const loadedDocs: LoadedDocument[] = [];
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');

    if (!fs.existsSync(directoryPath)) {
        console.warn(`[PDF-Loader] Folder tidak ditemukan: ${directoryPath}`);
        return loadedDocs;
    }
    // ... sisa kode tetap sama

    const files = fs.readdirSync(directoryPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    console.log(`[PDF-Loader] Menemukan ${pdfFiles.length} file PDF di ${directoryPath}`);

    for (const file of pdfFiles) {
        const filePath = path.join(directoryPath, file);
        const dataBuffer = fs.readFileSync(filePath);
        console.log(`[PDF-Loader] Membaca file: ${file} (${dataBuffer.length} bytes)`);
        
        try {
            // pdf-parse v1 menerima buffer langsung sebagai argumen pertama
            const data = await pdfParse(dataBuffer);

            if (!data.text || data.text.trim().length === 0) {
                console.warn(`[PDF-Loader] Peringatan: File ${file} menghasilkan teks kosong.`);
            } else {
                console.log(`[PDF-Loader] Berhasil mengekstrak ${data.text.length} karakter dari ${file}`);
            }

            loadedDocs.push({
                text: data.text || "",
                source: file,
                page: 1
            });
        } catch (error) {
            console.error(`[PDF-Loader] Gagal mengekstrak PDF ${file}:`, error);
        }
    }

    return loadedDocs;
}
