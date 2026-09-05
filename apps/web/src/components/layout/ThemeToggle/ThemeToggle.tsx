"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/IconButton";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton
      aria-label="Toggle theme"
      className="relative"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </IconButton>
  );
}
