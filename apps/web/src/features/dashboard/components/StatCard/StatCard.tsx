import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: ReactNode;
  href?: string;
  emphasis?: "default" | "warning";
};

export function StatCard({ label, value, href, emphasis = "default" }: StatCardProps) {
  const card = (
    <Card className={cn(href && "transition-colors hover:bg-accent/50")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className={cn("text-2xl font-semibold", emphasis === "warning" && "text-destructive")}>
        {value}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
