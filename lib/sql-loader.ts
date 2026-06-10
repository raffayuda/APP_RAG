import sqlite3 from 'sqlite3';
import { LoadedDocument } from './document-loader';

/**
 * Fungsi untuk menarik data dari database SQLite lokal
 * Sebagai contoh prototype, kita akan menarik semua baris dari semua tabel
 */
export async function loadFromSQLite(dbPath: string): Promise<LoadedDocument[]> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error("[SQL-Loader] Gagal membuka database:", err.message);
                return resolve([]);
            }
        });

        // Ambil daftar tabel
        db.all("SELECT name FROM sqlite_master WHERE type='table'", async (err, tables: any[]) => {
            if (err) return resolve([]);

            const allDataDocs: LoadedDocument[] = [];

            for (const table of tables) {
                if (table.name === 'sqlite_sequence') continue;

                // Ambil semua data dari tabel
                const rows = await new Promise<any[]>((res) => {
                    db.all(`SELECT * FROM ${table.name} LIMIT 100`, (err, rows) => {
                        res(rows || []);
                    });
                });

                if (rows.length > 0) {
                    const textContent = rows.map(r => JSON.stringify(r)).join("\n");
                    allDataDocs.push({
                        text: `Tabel Database: ${table.name}\n---\n${textContent}`,
                        source: `Database: ${table.name}`,
                        type: 'sql'
                    });
                }
            }

            db.close();
            resolve(allDataDocs);
        });
    });
}
