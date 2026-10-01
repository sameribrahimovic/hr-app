import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="min-h-dvh"><header className="site-container flex h-20 items-center justify-between"><Brand /><ThemeToggle /></header><main className="mx-auto w-full max-w-lg px-4 pb-12 pt-8 sm:pt-14"><div className="mb-7 text-center"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></div>{children}</main></div>;
}
