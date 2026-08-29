const API_KEY = process.env.OPENAI_API_KEY ?? "";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

const SYSTEM_PROMPT = `You are a vocabulary assistant. Your role is to help users understand words, phrases, and sentences. When a user asks about a word or phrase, provide:
- A clear, concise definition
- Example usage in a sentence
- Any relevant synonyms or antonyms

Keep responses brief and focused on vocabulary/meaning. If a question is not related to vocabulary or language understanding, politely redirect the user to ask about words or phrases.`;

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function getCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
