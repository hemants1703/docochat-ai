import { EmbedContentResponse, GoogleGenAI } from "@google/genai";

/**
 * Generates embeddings for an array of text chunks using the Gemini API.
 *
 * @param text - Array of text strings to embed.
 * @returns A Promise resolving to the embedding response or an Error.
 * @throws Error if input is empty or embedding generation fails.
 */
export async function embedChunkedText(text: string[]): Promise<EmbedContentResponse | Error> {
  if (!text || text.length === 0) {
    return new Error("Text cannot be empty or whitespace.");
  }

  const embeddingAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const embeddingResponse: EmbedContentResponse = await embeddingAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 1536,
    },
  });

  const embeddingLength = embeddingResponse.embeddings?.length;

  if (!embeddingResponse || !embeddingResponse.embeddings || embeddingLength === 0) {
    throw new Error("Failed to generate embeddings");
  }

  return embeddingResponse;
}

/**
 * Generates an embedding for a single text string using the Gemini API.
 *
 * @param text - The text string to embed.
 * @returns A Promise resolving to the embedding response or an Error.
 * @throws Error if input is empty or embedding generation fails.
 */
export async function embedText(text: string): Promise<EmbedContentResponse | Error> {
  if (!text || text.length === 0) {
    return new Error("Text cannot be empty or whitespace.");
  }

  const embeddingAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const embeddingResponse: EmbedContentResponse = await embeddingAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
    config: {
      outputDimensionality: 1536,
    },
  });

  return embeddingResponse;
}
