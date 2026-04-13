import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import { SupportedFileType, supportedFileTypes } from "@/lib/supportedFileTypes";
import { extractTextFromCSV, extractTextFromDOCX, extractTextFromPDF, extractTextFromRTF, extractTextFromTXTOrMD } from "@/lib/api-services/train/text-extraction-services";
import { UserDetails } from "@/app/train/page";
import { SupabaseClient } from "@supabase/supabase-js";
import { embedExtractedTextAndUpsertToSupabaseDB } from "@/lib/api-services/train/text-upsert-to-db";

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

  const fileType: SupportedFileType | undefined = supportedFileTypes.find((fileType: SupportedFileType) => {
    return fileType.mime === receivedFile.type;
  });

  if (!fileType) {
    return NextResponse.json(
      {
        message: "Unsupported file type",
      },
      {
        status: 400,
        statusText: "Bad Request",
      },
    );
  }
  const userDetails: UserDetails = JSON.parse(formData.get("userDetails") as string) as UserDetails;

  const supabase: SupabaseClient = await createClient();

  // Check if the user has reached the maximum number of files available
  const { data, error } = await supabase.from("users").select("*").eq("id", userDetails.id);

  if (error) {
    throw new Error(error.message);
  }

  if (data && data[0].files_available === 0) {
    return NextResponse.json(
      {
        message: "You have reached the maximum number of files available",
      },
      {
        status: 400,
        statusText: "Bad Request",
      },
    );
  }

  switch (fileType.ext) {
    case "txt":
    case "md":
      try {
        const extractedText: string | Error = await extractTextFromTXTOrMD(receivedFile); // Extract text from TXT/MD file(s)

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        // Upsert the extracted text by chunking and embedding it to the Supabase DB
        const result = await embedExtractedTextAndUpsertToSupabaseDB(extractedText, userDetails.id, receivedFile, supabase);

        if (result instanceof Error) {
          throw new Error(result.message);
        }

        return NextResponse.json(
          {
            message: "File trained successfully",
          },
          {
            status: 200,
            statusText: "OK",
          },
        );
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
        const extractedText: string | Error = await extractTextFromRTF(receivedFile); // Extract text from RTF file

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        // Upsert the extracted text by chunking and embedding it to the Supabase DB
        const result = await embedExtractedTextAndUpsertToSupabaseDB(extractedText, userDetails.id, receivedFile, supabase);

        if (result instanceof Error) {
          throw new Error(result.message);
        }

        return NextResponse.json(
          {
            message: "File trained successfully",
          },
          {
            status: 200,
            statusText: "OK",
          },
        );
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
        const extractedText: string | Error = await extractTextFromPDF(receivedFile); // Extract text from PDF file

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        // Upsert the extracted text by chunking and embedding it to the Supabase DB
        const result = await embedExtractedTextAndUpsertToSupabaseDB(extractedText, userDetails.id, receivedFile, supabase);

        if (result instanceof Error) {
          throw new Error(result.message);
        }

        return NextResponse.json(
          {
            message: "File trained successfully",
          },
          {
            status: 200,
            statusText: "OK",
          },
        );
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
        const extractedText: string | Error = await extractTextFromDOCX(receivedFile);

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        const result = await embedExtractedTextAndUpsertToSupabaseDB(extractedText, userDetails.id, receivedFile, supabase);

        if (result instanceof Error) {
          throw new Error(result.message);
        }

        return NextResponse.json({ message: "File trained successfully" }, { status: 200, statusText: "OK" });
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
        const extractedText: string | Error = await extractTextFromCSV(receivedFile);

        if (extractedText instanceof Error) {
          throw new Error(extractedText.message);
        }

        const result = await embedExtractedTextAndUpsertToSupabaseDB(extractedText, userDetails.id, receivedFile, supabase);

        if (result instanceof Error) {
          throw new Error(result.message);
        }

        return NextResponse.json({ message: "File trained successfully" }, { status: 200, statusText: "OK" });
      } catch (error) {
        console.error("Error while training CSV file", error);
        return NextResponse.json(
          {
            message: error instanceof Error ? error.message : "Error while training CSV file",
          },
          { status: 500, statusText: "Internal Server Error: CSV file" },
        );
      }
    default:
      break;
  }

  return NextResponse.json(
    {
      message: "File trained successfully",
    },
    { status: 200 },
  );
}
