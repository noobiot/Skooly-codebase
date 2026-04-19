import { useEffect, useMemo, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useSchool } from "@/hooks/useSchool";
import { toast } from "sonner";

type DbRow = {
  id: string;
  name: string;
  roll_no: string;
  class_name: string;
  section: string;
  gender: string;
  date_of_birth: string;
  parent_name: string;
  phone: string;
  email: string | null;
  address: string;
  admission_date: string;
  blood_group: string;
  emergency_contact: string;
};

const fromDb = (r: DbRow): Student => ({
  id: r.id,
  name: r.name,
  rollNo: r.roll_no,
  className: r.class_name,
  section: r.section,
  gender: r.gender as Student["gender"],
  dateOfBirth: r.date_of_birth,
  parentName: r.parent_name,
  phone: r.phone,
  email: r.email ?? "",
  address: r.address,
  admissionDate: r.admission_date,
  bloodGroup: r.blood_group as Student["bloodGroup"],
  emergencyContact: r.emergency_contact,
});

const toDb = (s: StudentInput, schoolId: string) => ({
  school_id: schoolId,
  name: s.name,
  roll_no: s.rollNo,
  class_name: s.className,
  section: s.section,
  gender: s.gender,
  date_of_birth: s.dateOfBirth,
  parent_name: s.parentName,
  phone: s.phone,
  email: s.email || null,
  address: s.address,
  admission_date: s.admissionDate,
  blood_group: s.bloodGroup,
  emergency_contact: s.emergencyContact,
});

export default function Students() {
  const { school, loading: schoolLoading } = useSchool();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (schoolLoading) return;
    if (!school) {
      setStudents([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("students")
      .select("*")
      .eq("school_id", school.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          toast.error("Failed to load students", { description: error.message });
          setStudents([]);
        } else {
          setStudents((data as DbRow[]).map(fromDb));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [school, schoolLoading]);

  const addOne = async (s: StudentInput) => {
    if (!school) return;
    const { data, error } = await supabase
      .from("students")
      .insert(toDb(s, school.id))
      .select()
      .single();
    if (error) {
      toast.error("Could not add student", { description: error.message });
      return;
    }
    setStudents((prev) => [fromDb(data as DbRow), ...prev]);
  };

  const addMany = async (rows: StudentInput[]) => {
    if (!school || rows.length === 0) return;
    const { data, error } = await supabase
      .from("students")
      .insert(rows.map((r) => toDb(r, school.id)))
      .select();
    if (error) {
      toast.error("Bulk import failed", { description: error.message });
      return;
    }
    setStudents((prev) => [...(data as DbRow[]).map(fromDb), ...prev]);
  };

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

      {!schoolLoading && !school && (
        <Card className="p-6 text-sm text-muted-foreground">
          Your school profile isn't set up yet. Please complete onboarding.
        </Card>
      )}

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Loading students…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
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
