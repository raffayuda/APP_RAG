"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  History, 
  FileText, 
  Settings, 
  Info,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: MessageSquare, label: "Chat", href: "/" },
  { icon: History, label: "Riwayat Chat", href: "#" },
  { icon: FileText, label: "Dokumen", href: "/admin" },
  { icon: LayoutDashboard, label: "Evaluasi", href: "#" },
  { icon: Settings, label: "Pengaturan", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-card w-[260px] flex-col lg:flex h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none tracking-tight">Chatbot Akademik</h2>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
              RAG berbasis Llama (Groq)
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="rounded-2xl bg-secondary/50 p-4 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Aplikasi ini menggunakan <strong>Retrieval-Augmented Generation (RAG)</strong> untuk memberikan jawaban berdasarkan dokumen akademik kampus.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
