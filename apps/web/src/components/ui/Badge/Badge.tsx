import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        warning: "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        error: "border-transparent bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        info: "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
