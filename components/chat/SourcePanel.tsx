import { RetrievedChunk } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

type SourcePanelProps = {
  sources: RetrievedChunk[];
};

export default function SourcePanel({ sources }: SourcePanelProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
      <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2">
        <FileText className="h-3 w-3 text-primary" />
        SUMBER DOKUMEN
      </h4>
      
      <div className="grid gap-3">
        {sources.map((source, index) => (
          <div key={index} className="flex items-start justify-between gap-4 group">
            <div className="flex items-start gap-3 overflow-hidden">
               <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
               <div className="overflow-hidden">
                 <p className="text-sm font-semibold text-foreground truncate leading-none mb-1">
                   {source.source}
                 </p>
                 <p className="text-[11px] text-muted-foreground">Halaman {source.page || 1}</p>
               </div>
            </div>
            <Badge variant="secondary" className="bg-card text-[10px] font-bold shadow-sm shrink-0">
               {source.score.toFixed(2)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
