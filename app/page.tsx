"use client";

import { 
  Moon, 
  ChevronDown,
  Sparkles,
  Search,
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChatContainer from "@/components/chat/ChatContainer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-bold text-lg">Chat</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Moon className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              R
            </div>
            <span className="text-sm font-medium">Raffa Yuda</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-6 lg:p-8 space-y-8">
          
          {/* Hero Section / Info Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Halo, Raffa!</h2>
              <p className="text-muted-foreground">Tanyakan apa saja seputar informasi akademik kampus.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full border shadow-sm">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Llama via Groq</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full border shadow-sm">
                <Search className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">RAG Aktif</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full border shadow-sm">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-wider">Local Embedding</Badge>
              </div>
            </div>
          </div>

          {/* Chat Component */}
          <div className="bg-card rounded-3xl border shadow-xl shadow-primary/5 overflow-hidden">
             <ChatContainer />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground italic">
              Chatbot dapat membuat kesalahan. Jawaban berdasarkan dokumen yang relevan.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
