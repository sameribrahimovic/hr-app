import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { DashboardNav, type NavItem } from "@/components/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brand } from "@/components/Brand";
import prisma from "@/lib/prisma";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { company: true } });
  if (!user) redirect("/onboarding");
  const isAdmin = user.role === "ADMIN";
  const navItems: NavItem[] = isAdmin ? [
    { href: "/admin", label: "Pregled", icon: "Home" },
    { href: "/admin/time-off-requests", label: "Zahtevi", icon: "CalendarDays" },
    { href: "/admin/employees", label: "Tim", icon: "Users" },
    { href: "/admin/company-settings", label: "Podešavanja", icon: "Settings" },
  ] : [
    { href: "/employee", label: "Pregled", icon: "Home" },
    { href: "/employee/new-request", label: "Novi zahtev", icon: "Plus" },
    { href: "/employee/my-requests", label: "Moji zahtevi", icon: "FileText" },
  ];
  return <div className="min-h-dvh">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-4">Pređi na sadržaj</a>
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card p-5 lg:flex">
      <Brand href={isAdmin ? "/admin" : "/employee"} className="mb-10 px-2" />
      <DashboardNav navItems={navItems} />
      <div className="mt-auto rounded-xl bg-background p-4"><Building2 className="mb-2 size-5 text-muted-foreground" aria-hidden="true" /><p className="break-words text-sm font-medium">{user.company.name}</p><p className="mt-1 text-xs text-muted-foreground">{isAdmin ? "Prostor za vaš tim" : "Vaš tim, na jednom mestu"}</p></div>
    </aside>
    <div className="lg:pl-60">
      <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b bg-card px-4 sm:px-8">
        <div className="lg:hidden"><Brand href={isAdmin ? "/admin" : "/employee"} /></div>
        <p className="hidden truncate text-sm text-muted-foreground lg:block">{user.company.name}</p>
        <div className="ml-auto flex items-center gap-2 sm:gap-4"><span className="hidden text-sm sm:block">{user.firstName} {user.lastName}</span><ThemeToggle /><UserButton /></div>
      </header>
      <main id="main-content" className="app-content mx-auto max-w-7xl px-4 pt-6 sm:px-8 sm:pt-8 lg:px-10">{children}</main>
      <DashboardNav navItems={navItems} mobile />
    </div>
  </div>;
}
