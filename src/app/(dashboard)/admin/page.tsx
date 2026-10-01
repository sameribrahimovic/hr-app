import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Users,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/RequestList";
import { EmptyState } from "@/components/EmptyState";
import { todayKey } from "@/lib/time-off";
import { formatDate } from "@/lib/utils";
export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/");
  const scope = { employee: { companyId: user.companyId } };
  const today = new Date(todayKey());
  const [pendingCount, employeeCount, awayCount, pending, upcoming] =
    await Promise.all([
      prisma.timeOffRequest.count({ where: { ...scope, status: "PENDING" } }),
      prisma.user.count({ where: { companyId: user.companyId } }),
      prisma.user.count({
        where: {
          companyId: user.companyId,
          timeOffRequests: {
            some: {
              status: "APPROVED",
              startDate: { lte: today },
              endDate: { gte: today },
            },
          },
        },
      }),
      prisma.timeOffRequest.findMany({
        where: { ...scope, status: "PENDING" },
        include: { employee: true },
        orderBy: { createdAt: "asc" },
        take: 5,
      }),
      prisma.timeOffRequest.findMany({
        where: { ...scope, status: "APPROVED", endDate: { gte: today } },
        include: { employee: true },
        orderBy: { startDate: "asc" },
        take: 5,
      }),
    ]);
  const metrics = [
    {
      title: "Zahtevi na čekanju",
      count: pendingCount,
      text: "Spremni za vašu odluku",
      icon: Clock3,
      href: "/admin/time-off-requests?status=PENDING",
      primary: true,
    },
    {
      title: "Danas odsutni",
      count: awayCount,
      text: "Odobrena odsustva u toku",
      icon: CalendarDays,
      href:
        "/admin/time-off-requests?status=APPROVED&from=" +
        todayKey() +
        "&to=" +
        todayKey(),
    },
    {
      title: "Članovi tima",
      count: employeeCount,
      text: user.company.name,
      icon: Users,
      href: "/admin/employees",
    },
  ];
  return (
    <div className="page-stack">
      <PageHeader
        title="Dobar pregled. Lakše odluke."
        description={
          "Sve što se dešava sa odsustvima u firmi " + user.company.name + "."
        }
        action={
          <Button asChild variant="outline">
            <Link href="/admin/invitation-codes">
              <UserPlus className="size-4" />
              Pozovi zaposlenog
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={
              "rounded-2xl border p-5 transition-colors sm:p-6 " +
              (item.primary
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary/40")
            }
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">{item.title}</h2>
              <item.icon className="size-5 opacity-75" />
            </div>
            <p className="my-3 text-4xl font-semibold tracking-tight">
              {item.count}
            </p>
            <p
              className={
                "break-words text-xs " +
                (item.primary ? "opacity-85" : "text-muted-foreground")
              }
            >
              {item.text}
            </p>
          </Link>
        ))}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="surface">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
            <h2 className="section-title">Čekaju vašu odluku</h2>
            <Link
              href="/admin/time-off-requests?status=PENDING"
              className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary"
            >
              Svi zahtevi
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {pending.length ? (
            <RequestList requests={pending} admin />
          ) : (
            <EmptyState
              title="Sve je obrađeno."
              description="Trenutno nema zahteva koji čekaju vašu odluku. Novi zahtevi pojaviće se ovde."
            />
          )}
        </section>
        <section className="surface">
          <h2 className="section-title border-b p-5">Planirana odsustva</h2>
          {upcoming.length ? (
            <ul className="divide-y">
              {upcoming.map((request) => (
                <li key={request.id} className="p-5">
                  <Link
                    href={"/admin/time-off-requests/" + request.id}
                    className="flex min-h-11 items-start gap-3"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                      {request.employee.firstName[0]}
                      {request.employee.lastName[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium">
                        {request.employee.firstName} {request.employee.lastName}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {formatDate(request.startDate)} –{" "}
                        {formatDate(request.endDate)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Otvoren prostor za planove."
              description="Predstojeća i tekuća odobrena odsustva biće prikazana ovde."
            />
          )}
        </section>
      </div>
    </div>
  );
}
