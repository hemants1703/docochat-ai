"use client";

import { ChatMessageFormState } from "./chat-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import ChatMessagesWelcomeScreen from "@/components/features/chat/chat-messages-welcome";
import ReactMarkdown from "react-markdown";

interface ChatMessagesProps {
  messages?: ChatMessageFormState[];
  isLoading?: boolean;
  chats?: ChatMessageFormState[];
}

export default function ChatMessages(props: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.chats]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!props.chats || props.chats?.length === 0) {
    return <ChatMessagesWelcomeScreen />;
  }

  return (
    <div className="flex flex-col flex-1 space-y-6 p-4 overflow-y-auto">
      <div className="space-y-6">
        {props.chats?.map((message, index) => (
          <div key={index} className={cn("flex items-start space-x-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <Avatar className="w-8 h-8 border-2 border-blue-200 dark:border-blue-700">
                <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn("flex flex-col space-y-1 max-w-[80%] lg:max-w-[70%]", message.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "rounded-2xl shadow-sm border",
                  message.role === "user" ? "px-3 py-1 bg-gradient-to-br from-blue-400 to-blue-700 text-white" : "p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700",
                )}>
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    {message.role === "assistant" ? (
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatTime(message.created_at || "")}</span>
                {message.role === "assistant" && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Assistant</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {message.role === "user" && (
              <Avatar className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700">
                <AvatarImage src="/user-avatar.png" alt="You" />
                <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {props.isLoading && (
          <div className="flex items-start space-x-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <Avatar className="w-8 h-8 border-2 border-blue-200 dark:border-blue-700">
              <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-1 max-w-[80%] lg:max-w-[70%]">
              <div className="px-4 py-3 rounded-2xl shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>Just now</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Assistant</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
