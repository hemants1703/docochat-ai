"use client";

import { Conversation, ConversationContent, ConversationDownload, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, type PromptInputMessage, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

const ConversationDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 relative size-full">
      {messages.length > 0 && (
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
          <ConversationDownload messages={messages} />
        </div>
      )}
      <div className="flex flex-col h-full mx-auto w-full max-w-4xl pt-4">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState icon={<MessageSquare className="size-8" strokeWidth={1.5} />} title="What can I help you with?" description="Upload your documents and I will answer your questions." />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return <MessageResponse key={message.id}>{part.text}</MessageResponse>;
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4 w-full mx-auto relative mb-6 rounded-2xl shadow-sm focus-within:shadow-md transition-shadow">
          <PromptInputTextarea value={input} placeholder="Ask anything about your documents..." onChange={(e) => setInput(e.currentTarget.value)} className="pr-14 text-base" />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-2.5 right-3 h-8 w-8 rounded-full bg-primary/90 hover:bg-primary transition-colors text-primary-foreground shadow-sm"
          />
        </PromptInput>
      </div>
    </div>
  );
};

export default ConversationDemo;
