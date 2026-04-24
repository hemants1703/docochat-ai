import { createOllama } from "ai-sdk-ollama";

export default class EmbeddingService {
  /**
   * Generates an embedding for a single text string using the Gemini API.
   *
   * @param text - The text string to embed.
   * @returns A Promise resolving to the embedding response or an Error.
   * @throws Error if input is empty or embedding generation fails.
   */
  async embedText(text: string): Promise<number[] | Error> {
    if (!text || text.length === 0) {
      return new Error("Text cannot be empty or whitespace.");
    }

    const embeddingModel = createOllama({ baseURL: process.env.OLLAMA_HOST }).embeddingModel("nomic-embed-text");
    const result = await embeddingModel.doEmbed({ values: [text] });

    return result.embeddings[0];
  }
}
