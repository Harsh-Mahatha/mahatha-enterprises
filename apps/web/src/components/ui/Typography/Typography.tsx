import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
};

const headingStyles: Record<NonNullable<HeadingProps["as"]>, string> = {
  h1: "text-2xl font-semibold tracking-tight",
  h2: "text-xl font-semibold tracking-tight",
  h3: "text-lg font-semibold",
  h4: "text-base font-semibold",
};

export function Heading({ as = "h1", className, children }: HeadingProps) {
  const Component: ElementType = as;
  return <Component className={cn(headingStyles[as], className)}>{children}</Component>;
}

export type TextProps = {
  as?: "p" | "span";
  variant?: "default" | "muted" | "small";
  className?: string;
  children: ReactNode;
};

const textStyles: Record<NonNullable<TextProps["variant"]>, string> = {
  default: "text-sm",
  muted: "text-sm text-muted-foreground",
  small: "text-xs text-muted-foreground",
};

export function Text({ as = "p", variant = "default", className, children }: TextProps) {
  const Component: ElementType = as;
  return <Component className={cn(textStyles[variant], className)}>{children}</Component>;
}
