"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, Menu, User } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/features/auth/context";

export type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border px-4">
      <IconButton aria-label="Open navigation" className="md:hidden" onClick={onMenuClick}>
        <Menu className="size-4" />
      </IconButton>
      <div className="flex-1" />
      <ThemeToggle />
      <Dropdown>
        <DropdownTrigger asChild>
          <IconButton aria-label="Account menu">
            <User className="size-4" />
          </IconButton>
        </DropdownTrigger>
        <DropdownContent align="end">
          {user ? <DropdownLabel>{user.name}</DropdownLabel> : null}
          <DropdownSeparator />
          <DropdownItem asChild>
            <Link href="/settings/change-password" className="flex items-center gap-2">
              <KeyRound className="size-4" />
              Change password
            </Link>
          </DropdownItem>
          <DropdownItem onSelect={handleLogout} className="text-destructive">
            <LogOut className="size-4" />
            Log out
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </header>
  );
}
