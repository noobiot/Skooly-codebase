import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
  city: string;
  studentCount: string;
};

const steps = [
  { title: "About you", desc: "Let's start with your name and email." },
  { title: "Create password", desc: "Pick a strong password." },
  { title: "Your school", desc: "Tell us about your school." },
  { title: "School size", desc: "Almost done!" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
    city: "",
    studentCount: "",
  });

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canProceed = () => {
    if (step === 0) return form.fullName.trim() && /\S+@\S+\.\S+/.test(form.email);
    if (step === 1) return form.password.length >= 6 && form.password === form.confirmPassword;
    if (step === 2) return form.schoolName.trim() && form.city.trim();
    if (step === 3) return Number(form.studentCount) > 0;
    return false;
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      const { data: signUp, error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: form.fullName },
        },
      });
      if (signUpErr) throw signUpErr;

      let userId = signUp.user?.id;
      // If session wasn't returned (rare), sign in to obtain one for the insert
      if (!signUp.session) {
        const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInErr) throw signInErr;
        userId = signIn.user?.id;
      }
      if (!userId) throw new Error("Could not establish a session.");

      const { error: schoolErr } = await supabase.from("schools").insert({
        owner_id: userId,
        name: form.schoolName.trim(),
        city: form.city.trim(),
        student_count_estimate: form.studentCount,
      });
      if (schoolErr) throw schoolErr;

      toast({ title: "Welcome to ShikshaHub!", description: `${form.schoolName} is ready to go.` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Could not finish setup",
        description: err.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed() || submitting) return;
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      void finish();
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">S</div>
            <span className="font-bold">ShikshaHub</span>
          </Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Already a user? Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start md:items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-4 flex items-center gap-2">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className={`flex-1 flex items-center gap-1.5 text-xs ${
                    i <= step ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <span className={`h-3.5 w-3.5 rounded-full border ${i === step ? "border-primary bg-primary" : "border-muted-foreground/30"}`} />
                  )}
                  <span className="hidden sm:inline truncate">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-card">
            <h1 className="text-2xl font-bold tracking-tight">{steps[step].title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{steps[step].desc}</p>

            <form onSubmit={next} className="mt-6 space-y-4">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Your full name</Label>
                    <Input id="fullName" placeholder="e.g. Rajesh Kumar" value={form.fullName} onChange={update("fullName")} autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="you@school.in" value={form.email} onChange={update("email")} />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Create password</Label>
                    <Input id="password" type="password" placeholder="At least 6 characters" value={form.password} onChange={update("password")} autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={update("confirmPassword")} />
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="text-xs text-destructive">Passwords don't match</p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School name</Label>
                    <Input id="schoolName" placeholder="e.g. Sunrise Public School" value={form.schoolName} onChange={update("schoolName")} autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="e.g. Indore" value={form.city} onChange={update("city")} />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Approximate number of students</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    min="1"
                    placeholder="e.g. 800"
                    value={form.studentCount}
                    onChange={update("studentCount")}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">Don't worry, you can change this later.</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || submitting}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={!canProceed() || submitting} className="bg-primary hover:bg-primary/90">
                  {submitting
                    ? "Setting up…"
                    : step === steps.length - 1
                      ? "Finish setup"
                      : "Continue"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
