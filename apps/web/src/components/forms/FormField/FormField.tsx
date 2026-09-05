import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

export type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, required, error, description, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {description && !error ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
