"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  Users,
  Settings,
  Plus,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
const icons = { Home, CalendarDays, Users, Settings, Plus, FileText };
export type NavItem = { href: string; label: string; icon: keyof typeof icons };
export function DashboardNav({
  navItems,
  mobile = false,
}: {
  navItems: NavItem[];
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const activeHref = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.href === "/admin/employees" &&
          pathname === "/admin/invitation-codes"),
    )?.href;
  return (
    <nav
      aria-label={mobile ? "Mobilna navigacija" : "Glavna navigacija"}
      className={
        mobile
          ? "bottom-nav fixed inset-x-0 bottom-0 z-40 flex border-t bg-card px-2 pt-2 lg:hidden"
          : "space-y-1"
      }
    >
      {navItems.map((item) => {
        const Icon = icons[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activeHref === item.href ? "page" : undefined}
            className={cn(
              mobile
                ? "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium"
                : "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium",
              "transition-colors",
              activeHref === item.href
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
