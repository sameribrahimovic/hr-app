"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Users, Settings, Home, FileText, Plus, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardNavProps {
  navItems: NavItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Calendar,
  Users,
  Settings,
  FileText,
  Plus,
};

export function DashboardNav({ navItems }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 flex-1 ml-6">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          if (!Icon) return null;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden top-16"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden">
            <nav className="flex flex-col p-2 gap-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon];
                if (!Icon) return null;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

