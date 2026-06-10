import fs from 'fs';
import path from 'path';
import { DocumentChunk, RetrievedChunk } from './types';
import { embedText } from './embeddings';

const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './data/vectorstore/chunks.json';

export async function saveChunks(chunks: DocumentChunk[]): Promise<void> {
    const dir = path.dirname(VECTOR_STORE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(chunks, null, 2));
}

export async function loadChunks(): Promise<DocumentChunk[]> {
    if (!fs.existsSync(VECTOR_STORE_PATH)) {
        return [];
    }
    const data = fs.readFileSync(VECTOR_STORE_PATH, 'utf-8');
    try {
        return JSON.parse(data) as DocumentChunk[];
    } catch (e) {
        console.error("Gagal mem-parsing file vector store:", e);
        return [];
    }
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error("Dimensi vektor tidak sama.");
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks(query: string, topK?: number): Promise<RetrievedChunk[]> {
    const k = topK || Number(process.env.TOP_K) || 4;
    const chunks = await loadChunks();
    
    if (chunks.length === 0) {
        return [];
    }

    const queryEmbedding = await embedText(query);

    const scoredChunks = chunks.map(chunk => {
        const score = cosineSimilarity(queryEmbedding, chunk.embedding);
        return {
            id: chunk.id,
            text: chunk.text,
            source: chunk.source,
            page: chunk.page,
            score: score
        };
    });

    // Urutkan dari skor tertinggi
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, k);
}
