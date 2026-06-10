import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

let extractor: FeatureExtractionPipeline | null = null;

async function getExtractor() {
    if (!extractor) {
        // Menggunakan model embedding lokal kecil dari Xenova (all-MiniLM-L6-v2)
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
}

export async function embedText(text: string): Promise<number[]> {
    try {
        const extract = await getExtractor();
        // Parameter pooling 'mean' dan normalize true biasa digunakan untuk cosine similarity
        const output = await extract(text, { pooling: 'mean', normalize: true });
        
        // Output.data adalah Float32Array, kita ubah ke array angka biasa
        return Array.from(output.data);
    } catch (error) {
        console.error("Error embedding text:", error);
        throw new Error("Gagal menghasilkan embedding untuk teks.");
    }
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
        embeddings.push(await embedText(text));
    }
    return embeddings;
}
