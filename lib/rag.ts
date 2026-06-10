import { ChatResponse } from './types';
import { retrieveRelevantChunks } from './vector-store';
import { buildPrompt } from './prompt';
import { askLlama } from './groq';

export async function answerQuestion(question: string, history?: string): Promise<ChatResponse> {
    if (!question || question.trim() === "") {
        throw new Error("Pertanyaan tidak boleh kosong.");
    }

    const rawChunks = await retrieveRelevantChunks(question, 12);

    // Filter chunk yang cukup relevan
    const relevantChunks = rawChunks.filter(chunk => chunk.score > 0.3);

    // Menggabungkan teks dari chunk yang relevan (jika ada)
    const context = relevantChunks.length > 0 
        ? relevantChunks.map(chunk => chunk.text).join("\n\n---\n\n")
        : "Tidak ada informasi spesifik di dokumen untuk pertanyaan terbaru ini. Gunakan riwayat percakapan jika ini adalah pertanyaan lanjutan.";

    const prompt = buildPrompt(question, context, history);

    const answer = await askLlama(prompt);

    return {
        answer: answer,
        sources: relevantChunks
    };
}
