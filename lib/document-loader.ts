import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

/**
 * Interface dasar untuk dokumen yang dimuat
 */
export type LoadedDocument = {
    text: string;
    source: string;
    page?: number;
    type: 'pdf' | 'excel' | 'sql';
};

/**
 * Fungsi untuk memuat file PDF (v1.1.1)
 */
async function loadSinglePDF(filePath: string, fileName: string): Promise<LoadedDocument | null> {
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdfParse(dataBuffer);
        return {
            text: data.text || "",
            source: fileName,
            page: 1,
            type: 'pdf'
        };
    } catch (error) {
        console.error(`[Loader] Gagal ekstrak PDF ${fileName}:`, error);
        return null;
    }
}

/**
 * Fungsi untuk memuat file Excel (.xlsx, .xls, .csv)
 */
function loadSingleExcel(filePath: string, fileName: string): LoadedDocument[] {
    const workbook = xlsx.readFile(filePath);
    const docs: LoadedDocument[] = [];

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // Ubah worksheet menjadi format JSON/Teks
        const data = xlsx.utils.sheet_to_txt(worksheet);
        if (data.trim().length > 0) {
            docs.push({
                text: `Sheet: ${sheetName}\n---\n${data}`,
                source: `${fileName} (${sheetName})`,
                page: 1,
                type: 'excel'
            });
        }
    });

    return docs;
}

/**
 * Loader utama untuk folder data/documents
 */
export async function loadAllDocuments(directoryPath: string): Promise<LoadedDocument[]> {
    const allDocs: LoadedDocument[] = [];
    
    if (!fs.existsSync(directoryPath)) {
        return allDocs;
    }

    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const ext = path.extname(file).toLowerCase();

        if (ext === '.pdf') {
            const doc = await loadSinglePDF(filePath, file);
            if (doc) allDocs.push(doc);
        } 
        else if (['.xlsx', '.xls', '.csv'].includes(ext)) {
            const excelDocs = loadSingleExcel(filePath, file);
            allDocs.push(...excelDocs);
        }
    }

    return allDocs;
}
