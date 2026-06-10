"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
};

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadStatus({ type: 'error', message: 'Hanya file PDF yang diizinkan' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal mengunggah");

      setUploadStatus({ type: 'success', message: 'Dokumen berhasil di-indeks!' });
      
      // Auto hide success status after 3s
      setTimeout(() => setUploadStatus(null), 3000);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setUploadStatus({ type: 'error', message: msg });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-card border-t">
      {/* Upload Status Mini Notification */}
      {uploadStatus && (
        <div className={`px-4 py-2 text-[11px] flex items-center justify-center gap-2 transition-all ${
          uploadStatus.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
        }`}>
          {uploadStatus.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          <span className="font-semibold uppercase tracking-wider">{uploadStatus.message}</span>
          <button onClick={() => setUploadStatus(null)} className="ml-2 hover:underline">Tutup</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto bg-secondary/30 rounded-2xl p-2 border border-border/50 focus-within:border-primary/30 focus-within:bg-card transition-all">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
          />
          
          <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleFileClick}
              disabled={isUploading}
              className="rounded-xl h-10 w-10 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </Button>
          
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isUploading ? "Sedang memproses dokumen..." : "Tanyakan informasi akademik..."}
            className="min-h-[44px] max-h-32 resize-none rounded-xl bg-transparent border-none shadow-none focus-visible:ring-0 px-1 py-3 text-sm"
            disabled={isLoading || isUploading}
          />
          
          <Button 
            type="submit" 
            className="h-10 w-10 rounded-xl shrink-0 shadow-lg shadow-primary/20" 
            disabled={isLoading || !value.trim() || isUploading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
