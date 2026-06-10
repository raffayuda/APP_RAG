import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient() {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export async function askLlama(prompt: string): Promise<string> {
  const client = getGroqClient();
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      temperature: 0.2, // Rendah untuk jawaban eksak (factual)
    });

    return chatCompletion.choices[0]?.message?.content || "Informasi tidak ditemukan dalam dokumen.";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Gagal menghubungi layanan Groq API.");
  }
}
