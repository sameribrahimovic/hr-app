import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role as string | undefined;
  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: "Home" },
    { href: "/admin/time-off-requests", label: "Requests", icon: "Calendar" },
    { href: "/admin/employees", label: "Employees", icon: "Users" },
    { href: "/admin/company-settings", label: "Settings", icon: "Settings" },
  ];

  const employeeNavItems = [
    { href: "/employee", label: "Dashboard", icon: "Home" },
    { href: "/employee/new-request", label: "New Request", icon: "Plus" },
    { href: "/employee/my-requests", label: "My Requests", icon: "FileText" },
  ];

  const navItems = isAdmin ? adminNavItems : isEmployee ? employeeNavItems : [];

  return (
    <div className="min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 relative">
        <Link 
          href={isAdmin ? "/admin" : isEmployee ? "/employee" : "/"} 
          className="flex items-center gap-2 font-semibold shrink-0"
        >
          <span className="text-lg font-bold">TimeOffer</span>
        </Link>
        {navItems.length > 0 && <DashboardNav navItems={navItems} />}
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </nav>
      </header>
      <div className="flex flex-1 overflow-x-hidden">
        <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
