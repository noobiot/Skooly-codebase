// Hardcoded mock data for ShikshaHub demo
export const mockSchool = {
  name: "Sunrise Public School",
  city: "Indore",
  totalStudents: 842,
  feesCollectedThisMonth: 1248500,
  pendingFees: 327000,
  totalTeachers: 38,
};

export const feeTrend = [
  { month: "Nov", amount: 980000 },
  { month: "Dec", amount: 1120000 },
  { month: "Jan", amount: 1050000 },
  { month: "Feb", amount: 1180000 },
  { month: "Mar", amount: 1310000 },
  { month: "Apr", amount: 1248500 },
];

export const studentsSpark = [
  { v: 780 }, { v: 795 }, { v: 810 }, { v: 818 }, { v: 830 }, { v: 842 },
];
export const collectedSpark = feeTrend.map((d) => ({ v: d.amount }));
export const pendingSpark = [
  { v: 410000 }, { v: 380000 }, { v: 360000 }, { v: 350000 }, { v: 340000 }, { v: 327000 },
];
export const teachersSpark = [
  { v: 34 }, { v: 35 }, { v: 35 }, { v: 36 }, { v: 37 }, { v: 38 },
];

export type ActivityItem = {
  id: string;
  type: "enrollment" | "payment";
  name: string;
  detail: string;
  time: string;
  amount?: number;
};

export const recentActivity: ActivityItem[] = [
  { id: "1", type: "payment", name: "Aarav Sharma", detail: "Class 8-B • Term 2 Fees", time: "12 min ago", amount: 18500 },
  { id: "2", type: "enrollment", name: "Priya Iyer", detail: "Admitted to Class 5-A", time: "1 hour ago" },
  { id: "3", type: "payment", name: "Rohan Verma", detail: "Class 10-A • Transport Fees", time: "2 hours ago", amount: 4200 },
  { id: "4", type: "payment", name: "Ananya Reddy", detail: "Class 6-C • Term 2 Fees", time: "3 hours ago", amount: 17200 },
  { id: "5", type: "enrollment", name: "Kabir Khan", detail: "Admitted to Class 1-B", time: "5 hours ago" },
  { id: "6", type: "payment", name: "Diya Patel", detail: "Class 9-A • Term 2 Fees", time: "Yesterday", amount: 19800 },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatINRCompact = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};
