"use client";

import { useState, useRef, useEffect } from "react";
import { RetrievedChunk } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RetrievedChunk[];
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      // Mencari viewport baik dari data-slot (shadcn v4) maupun data-radix (radix default)
      const scrollContainer = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]') || 
                              scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (question: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    setError(null);

    // Siapkan riwayat singkat (3 pesan terakhir) untuk konteks AI
    const history = messages
      .slice(-3)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }

      const newAssistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, newAssistantMsg]);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Gagal menghubungi API chat";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[70vh] w-full overflow-hidden rounded-2xl shadow-sm border-muted">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full p-4" ref={scrollRef}>
          <div className="flex flex-col gap-6 pb-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 pt-20 text-center text-muted-foreground">
                <div className="rounded-full bg-muted p-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p>Mulai dengan bertanya, misalnya: &quot;Apa syarat mengikuti UAS?&quot;</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                />
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] flex-col gap-2 items-start">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground">Mengetik...</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border bg-card px-5 py-4 w-64 shadow-sm">
                    <div className="space-y-3">
                      <Skeleton className="h-2 w-[90%]" />
                      <Skeleton className="h-2 w-[60%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Terjadi Kesalahan</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>
      </div>
      <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </Card>
  );
}
