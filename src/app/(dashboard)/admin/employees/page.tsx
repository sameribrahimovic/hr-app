import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { EmployeeSearch } from "@/components/EmployeeSearch";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import AllowanceForm from "@/components/AllowanceForm";
import { pageNumber, type FilterParams } from "@/lib/filters";
import { roleLabels, daysLabel } from "@/lib/labels";
export default async function EmployeesPage({ searchParams }: { searchParams: Promise<FilterParams> }) {
  const params = await searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== "ADMIN") redirect("/");
  const search = params.search?.trim();
  const where = { companyId: admin.companyId, ...(search ? { OR: ["firstName", "lastName", "email", "department"].map(field => ({ [field]: { contains: search, mode: "insensitive" as const } })) } : {}) };
  const total = await prisma.user.count({ where });
  const page = pageNumber(params.page, total);
  const users = await prisma.user.findMany({ where, orderBy: [{ lastName: "asc" }, { firstName: "asc" }], take: 10, skip: (page - 1) * 10 });
  return <div className="page-stack">
    <PageHeader title="Vaš tim" description="Članovi firme i njihovi raspoloživi dani, u jednom pregledu." action={<Button asChild><Link href="/admin/invitation-codes"><UserPlus className="size-4" />Pozovi zaposlenog</Link></Button>} />
    <EmployeeSearch search={params.search} />
    <section className="surface"><div className="flex items-center gap-2 border-b px-5 py-4"><Users className="size-5 text-muted-foreground" /><h2 className="section-title">Članovi tima</h2><span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs">{total}</span></div>
      {users.length ? <ul className="divide-y">{users.map(user => <li key={user.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">{user.firstName[0]}{user.lastName[0]}</span><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{user.firstName} {user.lastName}</h3><p className="mt-1 break-all text-xs text-muted-foreground">{user.email}</p><p className="mt-1.5 text-xs text-muted-foreground">{roleLabels[user.role]}{user.department ? " · " + user.department : ""}</p></div></div><div className="flex items-center justify-between gap-5 sm:justify-end"><div className="text-sm"><span className="text-lg font-semibold">{user.availableDays}</span> {daysLabel(user.availableDays)}<p className="text-xs text-muted-foreground">raspoloživo</p></div><AllowanceForm employeeId={user.id} employeeName={user.firstName + " " + user.lastName} currentAllowance={user.availableDays} /></div></li>)}</ul> : <EmptyState title="Nema članova za ovaj upit." description="Pokušajte sa drugim imenom, email adresom ili odeljenjem." />}
      <Pagination base="/admin/employees" params={params} page={page} total={total} />
    </section>
  </div>;
}
