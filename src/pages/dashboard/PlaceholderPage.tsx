import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlaceholderProps {
  title: string;
  description: string;
  ctaLabel?: string;
}

export default function PlaceholderPage({ title, description, ctaLabel = "Coming soon" }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="p-12 text-center shadow-2xl">
        <Badge variant="secondary" className="mb-4">In progress</Badge>
        <h3 className="text-lg font-semibold">This page is being built</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          The {title.toLowerCase()} module will live here. For now, head back to the dashboard to explore the demo.
        </p>
        <Button variant="outline" className="mt-6" disabled>
          {ctaLabel}
        </Button>
      </Card>
    </div>
  );
}
