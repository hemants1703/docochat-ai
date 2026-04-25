"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { CircuitBoardIcon, Loader2Icon, XIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import trainDocument from "@/components/features/train/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PreviewSelectedFile from "./PreviewSelectedFile";

export interface TrainFormState {
  file: File | null;
  error?: Error | undefined;
  success?: boolean | undefined;
  message?: string | undefined;
}

export default function TrainForm() {
  const [formState, formAction, isResponsePending] = useActionState<TrainFormState, FormData>(trainDocument, { file: null });
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File to detect support
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setFileSelected(null);
      toast.error("Please select a file to upload");
      return;
    }

    setFileSelected(selectedFile);

    const formData: FormData = new FormData();
    formData.append("file", selectedFile as File);

    // Confirm file support
    try {
      const confirmFileSupport: Response = await fetch("/api/document/confirm-support", {
        method: "POST",
        body: formData,
      });

      const fileSupportResponse: { message?: string; error?: Error } = await confirmFileSupport.json();

      if (!confirmFileSupport.ok) {
        throw new Error(fileSupportResponse.error?.message || "File not supported");
      }

      toast.success("Success", {
        description: fileSupportResponse.message,
      });
    } catch (error) {
      setFileSelected(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Unsupported File",
      });
    }
  };

  useEffect(() => {
    if (formState.error) {
      toast.error("Error", {
        description: formState.error.message,
      });
    } else if (formState.success) {
      toast.success("Success", {
        description: formState.message,
      });
      setFileSelected(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [formState]);

  return (
    <form action={formAction}>
      {/* File Input */}
      <div className="flex items-center gap-2">
        <Input type="file" name="file" accept=".pdf,.txt,.md,.rtf" className="w-full" ref={fileInputRef} disabled={isResponsePending} onChange={handleFileChange} />
        <Button
          type="button"
          variant="destructive"
          disabled={isResponsePending || !fileSelected}
          title="Clear file"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
              setFileSelected(null);
              formState.error = undefined;
            }
          }}>
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Preview Uploaded File */}
      {fileSelected !== null ? <PreviewSelectedFile file={fileSelected} /> : <p className="text-sm text-gray-500">No file selected</p>}

      {/* Error and Success Messages */}
      {formState.error && <p className="text-destructive text-sm mt-2 font-medium">{formState.error.message}</p>}
      {formState.success && <p className="text-emerald-500 text-sm mt-3 text-center">{formState.message}</p>}

      {/* Submit Button */}
      <div className="flex flex-col gap-3 mt-4">
        <Button type="submit" disabled={isResponsePending || !fileSelected} className="w-full transition-all">
          {isResponsePending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Training AI with your file...
            </>
          ) : (
            <>
              <CircuitBoardIcon className="mr-2 h-4 w-4" />
              Train AI with your file
            </>
          )}
        </Button>

        {formState.success && (
          <Button asChild variant="outline" className="w-full bg-secondary/50 hover:bg-secondary border-border/40">
            <Link href="/chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chatting
            </Link>
          </Button>
        )}
      </div>
    </form>
  );
}
