import * as XLSX from "xlsx";
import { STUDENT_COLUMNS, studentSchema, type StudentInput } from "./studentSchema";

export type ParsedRow = { row: number; data: Record<string, string> };
export type RowError = { row: number; field?: string; message: string };
export type ParseResult =
  | { ok: true; students: StudentInput[] }
  | { ok: false; errors: RowError[] };

const labelToKey = new Map(STUDENT_COLUMNS.map((c) => [c.label.toLowerCase(), c.key]));

function normalizeRow(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = labelToKey.get(String(k).trim().toLowerCase());
    if (!key) continue;
    if (v instanceof Date) {
      out[key] = v.toISOString().slice(0, 10);
    } else {
      out[key] = v == null ? "" : String(v).trim();
    }
  }
  return out;
}

export async function parseFile(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return { ok: false, errors: [{ row: 0, message: "No sheet found in file" }] };
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  if (rows.length === 0) return { ok: false, errors: [{ row: 0, message: "File is empty" }] };

  const errors: RowError[] = [];
  const students: StudentInput[] = [];

  rows.forEach((raw, i) => {
    const rowNum = i + 2; // header is row 1
    const data = normalizeRow(raw);
    const parsed = studentSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: rowNum,
          field: issue.path.join("."),
          message: issue.message,
        });
      }
    } else {
      students.push(parsed.data);
    }
  });

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, students };
}

function buildTemplateRows(): Record<string, string>[] {
  const sample: Record<string, string> = {};
  for (const c of STUDENT_COLUMNS) sample[c.label] = c.sample;
  return [sample];
}

export function downloadCsvTemplate() {
  const headers = STUDENT_COLUMNS.map((c) => c.label);
  const sample = STUDENT_COLUMNS.map((c) => c.sample);
  const csv = [headers.join(","), sample.map((s) => `"${s}"`).join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, "students-template.csv");
}

export function downloadXlsxTemplate() {
  const ws = XLSX.utils.json_to_sheet(buildTemplateRows(), {
    header: STUDENT_COLUMNS.map((c) => c.label),
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  triggerDownload(blob, "students-template.xlsx");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
