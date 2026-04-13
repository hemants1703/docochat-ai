"use server";

import type { TrainFormState } from "@/components/features/train/train-form";

export async function trainDocument(initialState: TrainFormState, formData: FormData): Promise<TrainFormState> {
  const file = formData.get("file") as File;

  if (!file) {
    return {
      ...initialState,
      error: new Error("Please upload a file to continue"),
      success: false,
    };
  }

  if (file.size === 0) {
    return {
      ...initialState,
      error: new Error("Please upload a file to continue"),
      success: false,
    };
  }

  try {
    const userDetails: string = formData.get("userDetails") as string;

    if (!userDetails) {
      throw new Error("User details not found");
    }

    formData.append("userDetails", userDetails);

    const trainFile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/train`, {
      method: "POST",
      body: formData,
    });

    if (!trainFile.ok) {
      throw new Error((await trainFile.json()).message);
    }

    const fileTrainingResponse = await trainFile.json();
    console.log("fileTrainingResponse", fileTrainingResponse);

    return {
      ...initialState,
      success: true,
      message: fileTrainingResponse.message,
    };
  } catch (error) {
    // console.error("Error while training file", error);
    return {
      ...initialState,
      success: false,
      error: new Error(error instanceof Error ? error.message : "Error while training file"),
    };
  }

  // // If no file is uploaded, return an error
  // const uploadedFile: File | null = formData.get("file") as File;

  // if (!uploadedFile || uploadedFile.size === 0) {
  //   return {
  //     ...initialState,
  //     error: new Error("Please upload a file to continue"),
  //     success: false,
  //     message: "Please upload a file to continue",
  //   };
  // }

  // const confirmFileSupport = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/document/confirm-support`,
  //   {
  //     method: "POST",
  //     body: formData,
  //   }
  // );

  // // If the file is not supported, the backend sends a status: 500 error as response
  // if (!confirmFileSupport.ok) {
  //   console.error(
  //     "Error while confirming support for file",
  //     confirmFileSupport
  //   );
  //   return {
  //     file: formData.get("file") as File,
  //     error: new Error("File is not supported"),
  //     success: false,
  //     message: "File is not supported",
  //   };
  // }

  // const fileSupportResponse = await confirmFileSupport.json();

  // console.log("File supported", fileSupportResponse);

  // redirect("/training");

  // return {
  //   file: formData.get("file") as File,
  //   success: true,
  //   message: "File is supported",
  // };
}
