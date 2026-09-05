import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-medium leading-none", className)} {...props}>
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </label>
  );
}
