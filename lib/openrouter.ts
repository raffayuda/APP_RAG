import OpenAI from "openai";

let openRouterClient: OpenAI | null = null;

function getOpenRouterClient() {
  if (!openRouterClient) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
    }
    openRouterClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Ganti dengan domain Anda saat deploy
        "X-Title": "Chatbot RAG Akademik",
      },
    });
  }
  return openRouterClient;
}

/**
 * Fungsi untuk mendeskripsikan gambar PDF (OCR via AI)
 */
export async function describeImage(base64Image: string): Promise<string> {
  const client = getOpenRouterClient();
  const model = process.env.VISION_MODEL || "meta-llama/llama-3.2-11b-vision-instruct";

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ekstrak dan ketik ulang seluruh teks yang ada di gambar dokumen ini secara akurat. Jika ada tabel, buat dalam format teks yang mudah dibaca. Hanya kembalikan teks hasil ekstraksi.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenRouter Vision Error:", error);
    return "";
  }
}

/**
 * Fungsi alternatif askLlama menggunakan OpenRouter jika diinginkan
 */
export async function askOpenRouter(prompt: string, modelOverride?: string): Promise<string> {
  const client = getOpenRouterClient();
  const model = modelOverride || process.env.GROQ_MODEL || "meta-llama/llama-3.1-8b-instruct";

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || "Maaf, saya tidak bisa memberikan jawaban.";
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Gagal menghubungi OpenRouter API.");
  }
}
