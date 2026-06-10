import { ChatResponse } from './types';
import { retrieveRelevantChunks } from './vector-store';
import { buildPrompt } from './prompt';
import { askLlama } from './groq';

export async function answerQuestion(question: string, history?: string): Promise<ChatResponse> {
    if (!question || question.trim() === "") {
        throw new Error("Pertanyaan tidak boleh kosong.");
    }

    const rawChunks = await retrieveRelevantChunks(question, 5);

    // Filter chunk yang cukup relevan
    const relevantChunks = rawChunks.filter(chunk => chunk.score > 0.3);

    // Menggabungkan teks dari chunk yang relevan (jika ada)
    let context = relevantChunks.length > 0 
        ? relevantChunks.map(chunk => chunk.text).join("\n\n---\n\n")
        : "";

    if (!context && (!history || history === "")) {
        context = "Tidak ada informasi spesifik di dokumen untuk pertanyaan terbaru ini.";
    } else if (!context) {
        context = "Gunakan riwayat percakapan untuk menjawab jika relevan, karena tidak ada informasi baru dari dokumen.";
    }

    // Batasi riwayat percakapan jika terlalu panjang (ambil 2000 karakter terakhir)
    const trimmedHistory = history && history.length > 2000 
        ? "..." + history.substring(history.length - 2000) 
        : history;

    const prompt = buildPrompt(question, context, trimmedHistory);

    const answer = await askLlama(prompt);

    return {
        answer: answer,
        sources: relevantChunks
    };
}
