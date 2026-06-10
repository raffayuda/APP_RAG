"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, CheckCircle2, AlertCircle, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type DocFile = {
  name: string;
  size: number;
  createdAt: string;
};

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [documents, setDocuments] = useState<DocFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.files) setDocuments(data.files);
    } catch (err) {
      console.error("Gagal mengambil daftar dokumen:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.csv'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (!allowedExtensions.includes(`.${fileExt}`)) {
        setStatus({ type: "error", message: "Format tidak didukung. Gunakan PDF, Excel, atau CSV." });
        setFile(null);
      } else {
        setFile(selectedFile);
        setStatus(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah file");
      }

      setStatus({ type: "success", message: data.message });
      setFile(null);
      
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh list
      fetchDocuments();

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Hapus dokumen ${name}?`)) return;

    try {
      const res = await fetch(`/api/documents?file=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Form Upload */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <label htmlFor="pdf-upload" className="text-sm font-medium text-foreground">
            Pilih Dokumen Baru (PDF, Excel, CSV)
          </label>
          <div className="flex gap-3 items-center">
            <Input 
              id="pdf-upload"
              type="file" 
              accept=".pdf,.xlsx,.xls,.csv" 
              onChange={handleFileChange}
              className="flex-1 cursor-pointer file:cursor-pointer"
              disabled={isUploading}
            />
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="shrink-0 min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Index
                </>
              )}
            </Button>
          </div>
        </div>

        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"} className={status.type === "success" ? "border-green-200 bg-green-50 text-green-800" : ""}>
            {status.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={status.type === "success" ? "text-green-700" : ""}>
              {status.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />

      {/* Daftar Dokumen Terupload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Daftar Dokumen Ter-index
          </h3>
          <Badge variant="outline">{documents.length} File</Badge>
        </div>

        {isLoadingDocs ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground">Belum ada dokumen yang diunggah.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <Card key={doc.name} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors group shadow-none border-muted">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate pr-4" title={doc.name}>{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatSize(doc.size)} • Diunggah {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(doc.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
