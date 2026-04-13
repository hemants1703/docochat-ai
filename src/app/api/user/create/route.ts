import { UserDetails } from "@/app/train/page";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userDetails: UserDetails | null = await request.json();

  if (!userDetails) {
    return NextResponse.json(
      {
        message: "User details not found",
      },
      {
        status: 400,
        statusText: "Bad Request",
      },
    );
  }

  const supabase = await createClient();

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("id", userDetails.id).single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw new Error(checkError.message);
    }

    // If user already exists, return success without creating duplicate
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        {
          status: 200,
          statusText: "OK",
        },
      );
    }

    // User doesn't exist, create new one
    const { error } = await supabase.from("users").insert({
      id: userDetails.id,
      username: userDetails.username,
      credits_available: userDetails.credits_available,
      credits_used: userDetails.credits_used,
      files_available: userDetails.files_available,
      files_used: userDetails.files_used,
      created_at: userDetails.created_at,
      updated_at: userDetails.updated_at,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "User created successfully" },
      {
        status: 201,
        statusText: "Created",
      },
    );
  } catch (error) {
    console.error("Error while creating user", error);
    const errorMessage = error instanceof Error ? error.message : "Error while creating user";
    return NextResponse.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
        statusText: errorMessage,
      },
    );
  }
}
