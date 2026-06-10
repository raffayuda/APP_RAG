"use client";

import { 
  ArrowLeft, 
  FileText, 
  Moon,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UploadDocument from "@/components/upload/UploadDocument";

export default function AdminPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* Top Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-bold text-lg">Kelola Dokumen</h1>
          </div>
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
        <div className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Manajemen Sumber Informasi</h2>
              <p className="text-muted-foreground">Unggah dan kelola dokumen untuk basis pengetahuan AI.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-card rounded-3xl border shadow-xl shadow-primary/5 p-6 lg:p-8">
              <UploadDocument />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
