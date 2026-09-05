import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DescriptionItemProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function DescriptionItem({ label, children, className }: DescriptionItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}
