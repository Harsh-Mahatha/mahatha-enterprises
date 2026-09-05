"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="text-sm font-semibold">Mahatha Enterprises</span>
      </div>
      <SidebarNav />
    </aside>
  );
}

export type MobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 md:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card md:hidden">
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-semibold">Mahatha Enterprises</span>
            <DialogPrimitive.Close className="rounded-sm p-1 hover:bg-accent">
              <X className="size-4" />
              <span className="sr-only">Close navigation</span>
            </DialogPrimitive.Close>
          </div>
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
