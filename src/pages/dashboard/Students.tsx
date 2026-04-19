import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Users } from "lucide-react";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { BulkImportDialog } from "@/components/students/BulkImportDialog";
import type { Student, StudentInput } from "@/lib/studentSchema";

const seed: Student[] = [
  {
    id: "s1", name: "Aarav Sharma", rollNo: "2024-001", className: "8", section: "B",
    gender: "Male", dateOfBirth: "2011-05-14", parentName: "Rajesh Sharma",
    phone: "+91 9876543210", email: "rajesh@example.com", address: "12 MG Road, Indore",
    admissionDate: "2023-04-10", bloodGroup: "O+", emergencyContact: "+91 9123456780",
  },
  {
    id: "s2", name: "Priya Iyer", rollNo: "2024-002", className: "5", section: "A",
    gender: "Female", dateOfBirth: "2014-08-22", parentName: "Lakshmi Iyer",
    phone: "+91 9988776655", email: "lakshmi@example.com", address: "44 Park Street, Indore",
    admissionDate: "2024-04-08", bloodGroup: "A+", emergencyContact: "+91 9000011111",
  },
];

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default function Students() {
  const [students, setStudents] = useState<Student[]>(seed);
  const [query, setQuery] = useState("");

  const addOne = (s: StudentInput) => setStudents((prev) => [{ ...s, id: newId() }, ...prev]);
  const addMany = (rows: StudentInput[]) =>
    setStudents((prev) => [...rows.map((r) => ({ ...r, id: newId() })), ...prev]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.rollNo, s.className, s.section, s.parentName, s.email, s.phone]
        .join(" ").toLowerCase().includes(q),
    );
  }, [students, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add students individually or import in bulk via CSV/Excel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BulkImportDialog onImport={addMany} />
          <AddStudentDialog onAdd={addOne} />
        </div>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll, class, parent…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3.5 w-3.5" />
            {filtered.length} {filtered.length === 1 ? "student" : "students"}
          </Badge>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Blood</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    No students yet. Add one or import a file to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.rollNo}</TableCell>
                    <TableCell>{s.className}-{s.section}</TableCell>
                    <TableCell>{s.gender}</TableCell>
                    <TableCell>{s.parentName}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell><Badge variant="outline">{s.bloodGroup}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
