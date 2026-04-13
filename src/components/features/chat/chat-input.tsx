"use client";

import { UserDetails } from "@/app/train/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/chat/chat-actions";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface ChatMessageFormState {
  role: "user" | "assistant";
  message: string;
  completions?: string;
  userDetails: UserDetails;
  created_at?: string;
  error?: string;
}

export default function ChatInput(props: { inputMessage: string; setInputMessage: (message: string) => void; userDetails: UserDetails; handleMessageSent: () => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formState, formAction, isFormPending] = useActionState<ChatMessageFormState, FormData>(sendMessage, {
    role: "user",
    message: "",
    userDetails: props.userDetails,
  });

  useEffect(() => {
    if (formState.role === "assistant" && formState.completions && textareaRef.current) {
      textareaRef.current.value = "";
      props.handleMessageSent();
    }
  }, [formState]);

  useEffect(() => {
    if (formState.error) {
      toast.error("Error Sending Message", {
        description: formState.error,
      });
    }
  }, [formState.error]);

  return (
    <form action={formAction} className="flex items-end justify-evenly gap-2">
      <Textarea ref={textareaRef} name="userTypedMessage" placeholder="Type your message here..." className="resize-none" rows={1} onChange={(e) => props.setInputMessage(e.target.value)} disabled={!props.userDetails} />
      <Input type="hidden" name="userDetails" value={JSON.stringify(props.userDetails)} />
      <Button type="submit" disabled={isFormPending || !props.inputMessage} className="group">
        {isFormPending ? (
          <>
            <span>Generating Response...</span>
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </>
        ) : (
          <>
            <span>Send</span>
            <span className="group-hover:scale-110 group-hover:-rotate-450 transition-all duration-150">
              <ArrowRightIcon className="size-4" />
            </span>
          </>
        )}
      </Button>
    </form>
  );
}
