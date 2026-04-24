import { type SupportedFileType, supportedFileTypes } from "@/lib/supportedFileTypes";
import { fileTypeFromBuffer } from "file-type";
import { type NextRequest, NextResponse } from "next/server";

/**
 * This API endpoint is used to confirm if the file is supported by the backend.
 * It is used to check if the file is supported by the backend before uploading it to the vector store.
 * Written by: Hemant Sharma (GH: @hemants1703)
 *
 * @param request - The request object containing the form data with the file to be uploaded.
 * @returns A JSON response with the success status and message.
 */

export async function POST(request: NextRequest): Promise<NextResponse<{ message?: string; error?: Error }>> {
	try {
		const formData: FormData = await request.formData();
		const uploadedFile: File | null = formData.get("file") as File | null;

		if (!uploadedFile) {
			throw new Error("No file uploaded");
		}

		if (uploadedFile.size > 1 * 1024 * 1024) {
			throw new Error("File size exceeds 1MB limit");
		}

		const buffer = Buffer.from(await uploadedFile.arrayBuffer());
		const detectedType = await fileTypeFromBuffer(buffer);

		const extFromName = uploadedFile.name.split(".").pop()?.toLowerCase() || "";
		const mimeFromBrowser = (uploadedFile.type || "").toLowerCase();

		const finalExt = (detectedType?.ext || extFromName).toLowerCase();
		const finalMime = (detectedType?.mime || mimeFromBrowser).toLowerCase();

		const supportedForExt: SupportedFileType[] = supportedFileTypes.filter((fileType: SupportedFileType) => fileType.ext === finalExt);

		if (supportedForExt.length === 0) {
			throw new Error("Unsupported file type, please upload any of the supported file types mentioned in the form");
		}

		const mimeMatches = supportedForExt.some((fileType: SupportedFileType) => fileType.mime === finalMime);

		const allowTextFallback = !detectedType && (finalExt === "txt" || finalExt === "md");

		if (!mimeMatches && !allowTextFallback) {
			throw new Error("Unsupported file type, please upload any of the supported file types mentioned in the form");
		}

		return NextResponse.json(
			{ message: "File is supported" },
			{
				status: 200,
				statusText: "OK",
			},
		);
	} catch (error) {
		return NextResponse.json(
			{ error: error as Error },
			{
				status: 500,
				statusText: "Internal Server Error",
			},
		);
	}
}
