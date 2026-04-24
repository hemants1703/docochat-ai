"use server";

import type { TrainFormState } from "@/components/features/train/TrainForm";

export default async function trainDocument(initialState: TrainFormState, formData: FormData): Promise<TrainFormState> {
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
    const trainFile = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/ingest`, {
      method: "POST",
      body: formData,
    });

    if (!trainFile.ok) {
      throw new Error((await trainFile.json()).message);
    }

    const fileTrainingResponse = await trainFile.json();

    return {
      ...initialState,
      success: true,
      message: fileTrainingResponse.message,
    };
  } catch (error) {
    console.error("Error while training file", error);
    return {
      ...initialState,
      success: false,
      error: new Error(error instanceof Error ? error.message : "Error while training file"),
    };
  }
}
