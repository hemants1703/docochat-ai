import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// This service chunks the texts into smaller chunks for better processing by the LLM while embedding
export const chunkText = async (text: string, chunkSize: number = 1000, chunkOverlap: number = 20): Promise<string[]> => {
  if (!text || text.trim() === "") {
    throw new Error("Text cannot be empty or whitespace.");
  }
  if (chunkSize <= 0) {
    throw new Error("Chunk size must be a positive integer.");
  }

  // Create a text splitter with the specified chunk size and overlap
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", " ", ""], // Use newlines and spaces as separators
  });

  return await textSplitter.splitText(text);
};
