const SYSTEM_PROMPT = `You are a vocabulary assistant. Your role is to help users understand words, phrases, and sentences. When a user asks about a word or phrase, provide:
- A clear, concise definition
- Example usage in a sentence
- Any relevant synonyms or antonyms

Keep responses brief and focused on vocabulary/meaning. If a question is not related to vocabulary or language understanding, politely redirect the user to ask about words or phrases.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openai.gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return Response.json(
      { error: `OpenAI API error: ${response.status} ${error}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return Response.json({ content: data.choices[0].message.content });
}
