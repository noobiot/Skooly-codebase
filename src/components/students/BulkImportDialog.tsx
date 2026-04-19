import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileSpreadsheet, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { downloadCsvTemplate, downloadXlsxTemplate, parseFile, type RowError } from "@/lib/studentImport";
import type { StudentInput } from "@/lib/studentSchema";

interface Props {
  onImport: (students: StudentInput[]) => void;
}

export function BulkImportDialog({ onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    setErrors([]);
    setFileName(file.name);
    const result = await parseFile(file);
    setBusy(false);
    if (!result.ok) {
      setErrors(result.errors);
      toast.error(`Import rejected — ${result.errors.length} error(s) found`);
      return;
    }
    onImport(result.students);
    toast.success(`Imported ${result.students.length} student(s)`);
    reset();
    setOpen(false);
  };

  const reset = () => {
    setErrors([]);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk import students</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file. All rows must be valid — if any row has errors, the entire file is rejected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={downloadCsvTemplate}>
              <FileText />
              CSV template
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadXlsxTemplate}>
              <FileSpreadsheet />
              Excel template
            </Button>
          </div>

          <label className="block">
            <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm font-medium">
                {fileName || "Click to choose a CSV or Excel file"}
              </div>
              <div className="text-xs text-muted-foreground">.csv, .xlsx, .xls</div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import rejected — fix these issues and re-upload</AlertTitle>
              <AlertDescription>
                <ScrollArea className="h-48 mt-2">
                  <ul className="space-y-1 text-sm">
                    {errors.map((e, i) => (
                      <li key={i}>
                        <span className="font-medium">Row {e.row}</span>
                        {e.field && <span className="text-muted-foreground"> · {e.field}</span>}
                        {": "}{e.message}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
