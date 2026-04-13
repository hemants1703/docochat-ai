import { SupabaseClient } from "@supabase/supabase-js";
import { chunkText } from "./text-chunking-services";
import { ContentEmbedding, EmbedContentResponse } from "@google/genai";
import { embedChunkedText } from "./text-embedding-services";
import { UserDetails } from "@/app/train/page";
import { SupportedFileType, supportedFileTypes } from "@/lib/supportedFileTypes";

export async function embedExtractedTextAndUpsertToSupabaseDB(extractedText: string, userId: UserDetails["id"], receivedFile: File, supabaseClient: SupabaseClient): Promise<{ success: boolean; message: string } | Error> {
  if (!extractedText || extractedText.length === 0) {
    return new Error("Extracted text cannot be empty or whitespace.");
  }

  if (!userId) {
    return new Error("User ID cannot be null or undefined.");
  }

  if (!receivedFile) {
    return new Error("Received file cannot be null or undefined.");
  }

  if (!receivedFile.name) {
    return new Error("File name cannot be empty or whitespace.");
  }

  if (!supabaseClient) {
    return new Error("Supabase client cannot be null or undefined.");
  }

  const fileType: SupportedFileType | undefined = supportedFileTypes.find((fileType: SupportedFileType) => {
    return fileType.mime === receivedFile.type;
  });

  const textChunks: string[] = await chunkText(extractedText, 1000, 200); // Chunk the extracted text into smaller chunks
  const textEmbeddings: EmbedContentResponse | Error = await embedChunkedText(textChunks); // Embed the text chunks using Gemini's gemini-embedding-001 model

  if (textEmbeddings instanceof Error) {
    return new Error(textEmbeddings.message);
  }

  // Insert one row per text chunk with its corresponding vector
  const insertPromises =
    textEmbeddings.embeddings?.map((embedding: ContentEmbedding, index: number) => {
      return supabaseClient.from("vector_store").insert({
        user_id: userId,
        file_name: receivedFile.name,
        file_type: fileType?.ext,
        file_size: receivedFile.size,
        file_content: extractedText,
        content: textChunks[index],
        vectors: embedding.values,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }) || [];

  const results = await Promise.all(insertPromises);

  // Check for any errors in the insertions
  for (const result of results) {
    if (result.error) {
      return new Error(result.error.message);
    }
  }

  const { error } = await supabaseClient
    .from("users")
    .update({
      files_used: 1,
      files_available: 0,
    })
    .eq("id", userId);

  if (error) {
    return new Error(error.message);
  }

  console.log("text chunking and embedding done, upserting to Supabase DB is successful", {
    user_id: "test",
    content: extractedText,
    textChunks,
    textEmbeddings,
    vectors: textEmbeddings.embeddings?.values().map((embedding: ContentEmbedding) => embedding),
    data: results,
  });

  return {
    success: true,
    message: "Text trained and upserted to Supabase DB successfully",
  };
}
