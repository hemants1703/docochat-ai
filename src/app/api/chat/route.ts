import EmbeddingService from "@/lib/services/train/EmbeddingService";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOllama } from "ai-sdk-ollama";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const OLLAMA_MODELS = ["llama3.2:1b", "gemma4:e2b", "gemma3n:e2b", "gemma3n:e4b"];

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const latestUserMessage = messages.at(-1)?.role === "user" ? messages.at(-1) : [...messages].reverse().find((m) => m.role === "user");

  if (!latestUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const userText =
    latestUserMessage?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") ?? "";

  // 1. Embed query
  const embeddingService = new EmbeddingService();
  const embeddedQuery = await embeddingService.embedText(userText);

  // 2. Search Qdrant
  const searchResponse = await fetch(`${process.env.QDRANT_REST_API}/collections/docochat-collection/points/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vector: embeddedQuery,
      limit: 5,
      with_payload: true,
    }),
  });

  const searchData = await searchResponse.json();

  const context = searchData.result
    .map((r: any) => r.payload?.textChunk)
    .filter(Boolean)
    .join("\n\n---\n\n");

  const result = streamText({
    model: createOllama({ baseURL: process.env.OLLAMA_HOST }).languageModel(OLLAMA_MODELS[0]),
    providerOptions: { ollama: { think: false } },
    messages: await convertToModelMessages(messages),
    system: `You are a retrieval-augmented assistant.

            Use the provided context to answer the user.
            If the answer is not in the context, say "I don't know".
            Do not guess or invent details.
            If the user asks a follow-up, use the conversation context to understand who or what they mean.
            Always try to stricly prioritize the context details rather than anything else.

			      Context: ${context}`,
  });

  messages.forEach((message) => {
    message.parts.forEach((part) => {
      console.log(part);
    });
  });

  return result.toUIMessageStreamResponse();
}
