import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-8 pr-3 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        {...props}
      />
    </div>
  );
}
