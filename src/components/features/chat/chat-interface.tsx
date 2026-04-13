"use client";

import { UserDetails } from "@/app/train/page";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";
import { ChatMessageFormState } from "./chat-input";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [chats, setChats] = useState<ChatMessageFormState[]>([]);

  async function fetchChats(userDetails: UserDetails) {
    const supabase = createClient();

    const { data: chats, error } = await supabase.from("chats_store").select("*").eq("user_id", userDetails?.id);

    if (error) {
      console.log("No chats found", error);
      setChats([]);
    } else {
      setChats(chats);
    }
  }

  function handleMessageSent() {
    if (userDetails) {
      fetchChats(userDetails);
    }
  }

  useEffect(() => {
    const userDetailsLS = localStorage.getItem("user-docochat-ai");

    // If user details are not found, redirect to train page
    if (!userDetailsLS) {
      toast.error("Redirect", {
        description: "Redirecting to train page since you haven't trained any documents yet to chat with them, first train your documents to chat with them.",
      });
      redirect("/train");
    } else if (userDetailsLS) {
      setUserDetails(JSON.parse(userDetailsLS));
      fetchChats(JSON.parse(userDetailsLS));
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto p-4 space-y-4 h-screen overflow-y-auto">
      <ChatMessages chats={chats} />
      {userDetails && <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} userDetails={userDetails} handleMessageSent={handleMessageSent} />}
    </div>
  );
}
