import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runIngest } from '@/lib/ingest-service';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan dalam request." }, { status: 400 });
        }

        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Hanya menerima file PDF, Excel, atau CSV." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const documentDir = process.env.DOCUMENT_DIR || './data/documents';
        
        if (!fs.existsSync(documentDir)) {
            fs.mkdirSync(documentDir, { recursive: true });
        }

        const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = path.join(documentDir, fileName);

        fs.writeFileSync(filePath, buffer);

        // Tambahkan delay kecil (500ms) untuk memastikan OS sudah selesai 
        // mengunci file sebelum dibaca ulang oleh pdf-parse/ingest-service
        await new Promise(resolve => setTimeout(resolve, 500));

        // OTOMATIS JALANKAN INGEST SETELAH UPLOAD
        const ingestResult = await runIngest();

        return NextResponse.json({ 
            success: true, 
            message: `File ${fileName} berhasil diunggah dan di-indeks otomatis (${ingestResult.chunks} chunks).`,
            chunks: ingestResult.chunks
        });

    } catch (error: unknown) {
        console.error("API Upload & Ingest Error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat mengunggah atau memproses dokumen." },
            { status: 500 }
        );
    }
}
