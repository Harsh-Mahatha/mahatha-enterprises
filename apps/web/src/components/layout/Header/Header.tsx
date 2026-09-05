"use client";

import { Menu } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4">
      <IconButton aria-label="Open navigation" className="md:hidden" onClick={onMenuClick}>
        <Menu className="size-4" />
      </IconButton>
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}
