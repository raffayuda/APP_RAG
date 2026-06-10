import { runIngest } from '../lib/ingest-service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function main() {
    console.log("Memulai proses ingest via script...");
    const result = await runIngest();
    console.log(`${result.message} Total ${result.chunks} chunks tersimpan.`);
}

main().catch(console.error);
