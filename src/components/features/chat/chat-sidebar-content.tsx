"use client";

import { UserDetails } from "@/app/train/page";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";

export interface FileDetails {
  file_name: string;
  file_size: number;
  file_type: string;
}

export default function ChatSidebarContent() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);

  const getFileDetails = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("vector_store").select("*").eq("user_id", userId);

    if (error || data.length === 0) {
      console.error("Error while getting file details", error);
      return null;
    }

    return {
      file_name: data[0].file_name,
      file_size: data[0].file_size,
      file_type: data[0].file_type,
    };
  };

  useEffect(() => {
    const localUserDetails: string | null = localStorage.getItem("user-docochat-ai");

    if (localUserDetails && localUserDetails.length > 0) {
      setUserDetails(JSON.parse(localUserDetails));

      const userId = JSON.parse(localUserDetails).id;

      const fetchFileDetails = async () => await getFileDetails(userId);

      fetchFileDetails().then((fileDetails) => {
        if (!fileDetails) {
          redirect("/train");
        }

        setFileDetails(fileDetails);
      });
    } else {
      console.error("No user details found, redirecting to train page");
      redirect("/train");
    }
  }, []);

  return (
    <div>
      <FileDetails fileDetails={fileDetails} />
      {userDetails ? (
        <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mt-4 bg-yellow-50 dark:bg-yellow-900">
          <p className="text-xs">
            You have {userDetails.files_used} files used and {userDetails.files_available} files available for training & chatting for free.
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export function FileDetails({ fileDetails }: { fileDetails: FileDetails | null }) {
  if (!fileDetails)
    return (
      <div className="mt-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-black  dark:text-gray-500 mb-2 select-none">DOCUMENT</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading document details...</p>
      </div>
    );

  return (
    <div className="mt-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xs font-black opacity-50 tracking-tighter mb-2 select-none">DOCUMENT</h3>
      <ul className="space-y-1 text-sm dark:text-gray-300">
        <li>
          <span className="font-medium dark:text-gray-100">Name:</span> {fileDetails.file_name}
        </li>
        <li>
          <span className="font-medium dark:text-gray-100">Size:</span> {fileDetails.file_size} bytes
        </li>
        <li>
          <span className="font-medium dark:text-gray-100">Type:</span> {fileDetails.file_type}
        </li>
      </ul>
    </div>
  );
}
