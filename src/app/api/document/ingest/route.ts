import EmbeddingService from "@/lib/services/train/EmbeddingService";
import TextChunkingService from "@/lib/services/train/TextChunkingService";
import TextExtractionService from "@/lib/services/train/TextExtractionService";
import { type SupportedFileType, supportedFileTypes } from "@/lib/supportedFileTypes";
import { type NextRequest, NextResponse } from "next/server";

/**
 * This API endpoint is used to train the file on the vector store.
 * It is used to extract the text from the file and embed it into the vector store.
 *
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param request - The request object containing the form data with the file to be trained.
 * @returns A JSON response with the success status and message.
 */
export async function POST(request: NextRequest): Promise<NextResponse<{ message: string; error?: Error }>> {
  const formData: FormData = await request.formData();
  const receivedFile: File = formData.get("file") as File;

  const fileType: SupportedFileType | undefined = supportedFileTypes.find((fileType: SupportedFileType) => fileType.mime === receivedFile.type);

  if (!fileType) {
    return NextResponse.json(
      { message: "Unsupported file type" },
      {
        status: 400,
        statusText: "Bad Request",
      },
    );
  }

  const textExtractionService = new TextExtractionService();
  const textChunkingService = new TextChunkingService();
  const embeddingService = new EmbeddingService();

  let points: Array<{
    id: number;
    vector: number[];
    payload: {
      textChunk: string;
    };
  }> = [];

  const chunkAndEmbedText = async (extractedText: string, label: string) => {
    const textChunks: string[] = await textChunkingService.chunkText(extractedText);

    // Parrallelize embedding generation for faster processing
    await Promise.all(
      textChunks.map(async (chunk, index) => {
        const embedding = await embeddingService.embedText(chunk);

        if (embedding instanceof Error) {
          throw new Error(`Failed embedding ${label} chunk ${index}: ${embedding.message}`);
        }

        points.push({
          id: index,
          vector: embedding,
          payload: {
            textChunk: chunk,
          },
        });
      }),
    );

    // Sequential embedding generation (fallback if parallelization causes issues)
    // for (const [index, chunk] of textChunks.entries()) {
    //   const embedding: number[] | Error = await embeddingService.embedText(chunk);

    //   if (embedding instanceof Error) {
    //     throw new Error(`Failed embedding ${label} chunk ${index}: ${embedding.message}`);
    //   }

    //   points.push({
    //     id: index,
    //     vector: embedding,
    //     payload: {
    //       textChunk: chunk,
    //     },
    //   });
    // }
  };

  switch (fileType.ext) {
    case "txt":
    case "md":
      try {
        const extractedText: string | Error = await textExtractionService.extractTextFromTXTOrMD(receivedFile); // Extract text from TXT/MD file(s)

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        await chunkAndEmbedText(extractedText, "TXT/MD");
      } catch (error) {
        console.error("Error while training TXT/MD file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training TXT/MD file",
          },
          {
            status: 500,
            statusText: "Internal Server Error: TXT/MD file",
          },
        );
      }
      break;
    case "rtf":
      try {
        console.log("extracting text from RTF file");
        const extractedText: string | Error = await textExtractionService.extractTextFromRTF(receivedFile); // Extract text from RTF file

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        await chunkAndEmbedText(extractedText, "RTF");
      } catch (error) {
        console.error("Error while training RTF file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training RTF file",
          },
          {
            status: 500,
            statusText: "Internal Server Error: RTF file",
          },
        );
      }
      break;
    case "pdf":
      try {
        const extractedText: string | Error = await textExtractionService.extractTextFromPDF(receivedFile); // Extract text from PDF file

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        await chunkAndEmbedText(extractedText, "PDF");
      } catch (error) {
        console.error("Error while training PDF file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training PDF file",
          },
          { status: 500, statusText: "Internal Server Error: PDF file" },
        );
      }
      break;
    case "docx":
      try {
        const extractedText: string | Error = await textExtractionService.extractTextFromDOCX(receivedFile);

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        await chunkAndEmbedText(extractedText, "DOCX");
      } catch (error) {
        console.error("Error while training DOCX file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training DOCX file",
          },
          { status: 500, statusText: "Internal Server Error: DOCX file" },
        );
      }
      break;
    case "csv":
      try {
        const extractedText: string | Error = await textExtractionService.extractTextFromCSV(receivedFile);

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        await chunkAndEmbedText(extractedText, "CSV");
      } catch (error) {
        console.error("Error while training CSV file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training CSV file",
          },
          { status: 500, statusText: "Internal Server Error: CSV file" },
        );
      }
      break;
    default:
      break;
  }

  if (points && points.length === 0) {
    return NextResponse.json(
      {
        message: "No embeddings generated from the file",
      },
      {
        status: 500,
        statusText: "Internal Server Error: No embeddings generated",
      },
    );
  }

  //   Push embeddings to vector store
  try {
    const pushToVectorStore = await fetch(`${process.env.QDRANT_REST_API}/collections/docochat-collection/points?wait=true`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });

    const pushToVectorStoreResponse = await pushToVectorStore.json();

    console.log("pushToVectorStoreResponse", pushToVectorStoreResponse);

    if (!pushToVectorStore.ok) {
      throw new Error(`Failed to push embeddings to vector store: ${pushToVectorStoreResponse.error || pushToVectorStore.statusText}`);
    }

    console.log("Successfully pushed embeddings to vector store: ", pushToVectorStoreResponse);
  } catch (error) {
    console.error("Error while pushing embeddings to vector store: ", error);
    return NextResponse.json({ message: "Error while pushing embeddings to vector store" }, { status: 500, statusText: "Internal Server Error: Vector Store" });
  }

  return NextResponse.json({ message: "File trained successfully" }, { status: 200, statusText: "OK" });
}
