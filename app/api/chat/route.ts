import { NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/rag';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { question, history } = body;

        if (!question) {
            return NextResponse.json(
                { error: "Pertanyaan tidak boleh kosong" },
                { status: 400 }
            );
        }

        const response = await answerQuestion(question, history);
        return NextResponse.json(response);

    } catch (error: unknown) {
        console.error("API Chat Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
