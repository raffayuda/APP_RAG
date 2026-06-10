import { Bot, User, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { RetrievedChunk } from "@/lib/types";
import { cn } from "@/lib/utils";
import SourcePanel from "./SourcePanel";
import { Button } from "@/components/ui/button";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  sources?: RetrievedChunk[];
};

export default function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full mb-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[85%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-card border text-primary"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <div className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
          <div
            className={cn(
              "rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-card border text-card-foreground rounded-tl-none"
            )}
          >
            {content}
          </div>

          {!isUser && (
            <div className="flex flex-col w-full gap-3">
              {/* Feedback Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary">
                  <ThumbsUp className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary">
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              {sources && sources.length > 0 && (
                <div className="w-full">
                  <SourcePanel sources={sources} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
