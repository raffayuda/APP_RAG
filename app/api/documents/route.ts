import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const documentDir = process.env.DOCUMENT_DIR || './data/documents';
        
        if (!fs.existsSync(documentDir)) {
            return NextResponse.json({ files: [] });
        }

        const files = fs.readdirSync(documentDir);
        const supportedExtensions = ['.pdf', '.xlsx', '.xls', '.csv'];
        const pdfFiles = files
            .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => {
                const stats = fs.statSync(path.join(documentDir, file));
                return {
                    name: file,
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            });

        return NextResponse.json({ files: pdfFiles });

    } catch (error) {
        console.error("API List Documents Error:", error);
        return NextResponse.json({ error: "Gagal mengambil daftar dokumen" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get('file');

        if (!fileName) {
            return NextResponse.json({ error: "Nama file diperlukan" }, { status: 400 });
        }

        const documentDir = process.env.DOCUMENT_DIR || './data/documents';
        const filePath = path.join(documentDir, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ success: true, message: "File berhasil dihapus." });
        } else {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
        }
    } catch (error) {
        console.error("API Delete Document Error:", error);
        return NextResponse.json({ error: "Gagal menghapus dokumen" }, { status: 500 });
    }
}
