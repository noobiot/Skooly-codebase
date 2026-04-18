import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Users, Wallet, AlertCircle, GraduationCap, UserPlus, IndianRupee, ArrowUpRight } from "lucide-react";
import {
  mockSchool,
  feeTrend,
  recentActivity,
  formatINR,
  formatINRCompact,
  studentsSpark,
  collectedSpark,
  pendingSpark,
  teachersSpark,
} from "@/lib/mockData";

type SparkProps = { data: { v: number }[]; color: string };
const Sparkline = ({ data, color }: SparkProps) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg-${color})`} />
    </AreaChart>
  </ResponsiveContainer>
);

type StatProps = {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  spark: { v: number }[];
  sparkColor: string;
};

const StatCard = ({ label, value, delta, positive = true, icon: Icon, iconBg, iconColor, spark, sparkColor }: StatProps) => (
  <Card className="p-5 shadow-card hover:shadow-soft transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-3 -mx-1">
      <Sparkline data={spark} color={sparkColor} />
    </div>
    <div className="mt-1 flex items-center gap-1 text-xs">
      <span className={positive ? "text-success font-medium" : "text-destructive font-medium"}>{delta}</span>
      <span className="text-muted-foreground">vs last month</span>
    </div>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Rajesh 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening at {mockSchool.name} today.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground self-start sm:self-auto">
          <UserPlus className="h-4 w-4" /> Add student
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={mockSchool.totalStudents.toLocaleString("en-IN")}
          delta="+12"
          icon={Users}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          spark={studentsSpark}
          sparkColor="hsl(222 65% 22%)"
        />
        <StatCard
          label="Fees Collected (Apr)"
          value={formatINRCompact(mockSchool.feesCollectedThisMonth)}
          delta="+8.4%"
          icon={Wallet}
          iconBg="bg-success/10"
          iconColor="text-success"
          spark={collectedSpark}
          sparkColor="hsl(142 65% 38%)"
        />
        <StatCard
          label="Pending Fees"
          value={formatINRCompact(mockSchool.pendingFees)}
          delta="-3.8%"
          positive
          icon={AlertCircle}
          iconBg="bg-accent/10"
          iconColor="text-accent"
          spark={pendingSpark}
          sparkColor="hsl(28 95% 55%)"
        />
        <StatCard
          label="Total Teachers"
          value={String(mockSchool.totalTeachers)}
          delta="+2"
          icon={GraduationCap}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          spark={teachersSpark}
          sparkColor="hsl(222 70% 35%)"
        />
      </div>

      {/* Chart + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold">Fee collection</h2>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <ArrowUpRight className="h-3 w-3 text-success" /> +27% YoY
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeTrend} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatINRCompact(v as number)}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [formatINR(v), "Collected"]}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground">Latest payments & enrollments</p>
            </div>
          </div>
          <ul className="space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-2 border-b last:border-0 border-border/60">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    a.type === "payment" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                  }`}
                >
                  {a.type === "payment" ? <IndianRupee className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  {a.amount && <p className="text-sm font-semibold">{formatINR(a.amount)}</p>}
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
