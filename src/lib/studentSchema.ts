import { z } from "zod";

export const GENDERS = ["Male", "Female", "Other"] as const;
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  rollNo: z.string().trim().min(1, "Roll No is required").max(20),
  className: z.string().trim().min(1, "Class is required").max(20),
  section: z.string().trim().min(1, "Section is required").max(10),
  gender: z.enum(GENDERS, { errorMap: () => ({ message: "Gender must be Male, Female, or Other" }) }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be YYYY-MM-DD"),
  parentName: z.string().trim().min(1, "Parent name is required").max(100),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,15}$/, "Invalid phone number"),
  email: z.string().trim().email("Invalid email").max(255),
  address: z.string().trim().min(1, "Address is required").max(255),
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Admission Date must be YYYY-MM-DD"),
  bloodGroup: z.enum(BLOOD_GROUPS, { errorMap: () => ({ message: "Invalid blood group" }) }),
  emergencyContact: z.string().trim().regex(/^[+\d][\d\s-]{6,15}$/, "Invalid emergency contact"),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type Student = StudentInput & { id: string };

export const STUDENT_COLUMNS: { key: keyof StudentInput; label: string; sample: string }[] = [
  { key: "name", label: "Name", sample: "Aarav Sharma" },
  { key: "rollNo", label: "Roll No", sample: "2024-001" },
  { key: "className", label: "Class", sample: "8" },
  { key: "section", label: "Section", sample: "B" },
  { key: "gender", label: "Gender", sample: "Male" },
  { key: "dateOfBirth", label: "Date of Birth", sample: "2011-05-14" },
  { key: "parentName", label: "Parent Name", sample: "Rajesh Sharma" },
  { key: "phone", label: "Phone", sample: "+91 9876543210" },
  { key: "email", label: "Email", sample: "rajesh@example.com" },
  { key: "address", label: "Address", sample: "12 MG Road, Indore" },
  { key: "admissionDate", label: "Admission Date", sample: "2023-04-10" },
  { key: "bloodGroup", label: "Blood Group", sample: "O+" },
  { key: "emergencyContact", label: "Emergency Contact", sample: "+91 9123456780" },
];
