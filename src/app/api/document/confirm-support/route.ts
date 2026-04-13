import { SupportedFileType, supportedFileTypes } from "@/lib/supportedFileTypes";
import { fileTypeFromBuffer } from "file-type";
import { NextRequest, NextResponse } from "next/server";

/**
 * This API endpoint is used to confirm if the file is supported by the backend.
 * It is used to check if the file is supported by the backend before uploading it to the vector store.
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param request - The request object containing the form data with the file to be uploaded.
 * @returns A JSON response with the success status and message.
 */

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean; message?: string; error?: Error }>> {
  try {
    const formData: FormData = await request.formData();

    const uploadedFile: File | null = formData.get("file") as File | null;

    if (!uploadedFile) {
      throw new Error("No file uploaded");
    }

    const type: SupportedFileType | undefined = await fileTypeFromBuffer(Buffer.from(await uploadedFile.arrayBuffer()));

    if (!type) {
      throw new Error("Error while parsing file type");
    }

    const isFileTypeSupported: boolean = supportedFileTypes.some(
      (fileType: SupportedFileType) => fileType.ext === type.ext && fileType.mime === type.mime && uploadedFile.size <= 1 * 1024 * 1024, // 1MB
    );

    if (!isFileTypeSupported) {
      throw new Error("Unsupported file type, please upload any of the supported file types mentioned in the form");
    }

    // If the file is supported, the backend sends a status: 200 response which indicates response.ok === true
    return NextResponse.json(
      {
        success: true,
        message: "File is supported",
      },
      {
        status: 200,
        statusText: "OK",
      },
    );
  } catch (error) {
    // If the file is not supported, the backend sends a status: 500 error as response which indicates response.ok === false
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "File is not supported",
        error: error as Error,
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
}
