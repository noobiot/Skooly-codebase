import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Users, GraduationCap, UserRound, CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Track fee payments",
    desc: "See who has paid, who hasn't, and send gentle reminders — all in one place.",
  },
  {
    icon: Users,
    title: "Manage students",
    desc: "Keep records of every student across classes and sections, neatly organized.",
  },
  {
    icon: GraduationCap,
    title: "Separate teacher portal",
    desc: "Teachers get their own simple view to mark attendance and update marks.",
  },
  {
    icon: UserRound,
    title: "Parents stay in the loop",
    desc: "Parents see fees, attendance, and notices on their phone — no app to install.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              S
            </div>
            <span className="font-bold text-lg">ShikshaHub</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-foreground hover:text-primary px-3 py-2"
            >
              Login
            </Link>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/onboarding">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-1 text-xs font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Built for schools across India
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              The simple way to run your school
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 leading-relaxed">
              ShikshaHub helps principals and school owners manage students, track fees, and stay connected
              with teachers and parents — all from one dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant w-full sm:w-auto"
              >
                <Link to="/onboarding">
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground w-full sm:w-auto"
              >
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Free to start</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Manage multiple schools</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Works on any phone</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything your school needs</h2>
          <p className="mt-3 text-muted-foreground">
            No more registers, WhatsApp groups, or scattered Excel sheets. One place for everything.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <Card key={b.title} className="p-6 shadow-card hover:shadow-soft transition-shadow border-border/60">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent mb-4">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center shadow-elegant">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to simplify your school?</h3>
          <p className="mt-3 text-primary-foreground/80">Set up your school in under 2 minutes. No credit card needed.</p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link to="/onboarding">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} ShikshaHub. Made in India.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
