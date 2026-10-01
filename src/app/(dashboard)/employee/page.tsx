import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, CalendarDays, Clock3, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { RequestList } from "@/components/RequestList";
import { formatDate } from "@/lib/utils";
import { daysLabel } from "@/lib/labels";
import { todayKey } from "@/lib/time-off";
export default async function EmployeePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");
  const [recent, pending, next] = await Promise.all([
    prisma.timeOffRequest.findMany({
      where: { employeeId: user.id },
      include: { manager: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.timeOffRequest.aggregate({
      where: { employeeId: user.id, status: "PENDING" },
      _count: true,
      _sum: { workingDaysCount: true },
    }),
    prisma.timeOffRequest.findFirst({
      where: {
        employeeId: user.id,
        status: "APPROVED",
        endDate: { gte: new Date(todayKey()) },
      },
      orderBy: { startDate: "asc" },
    }),
  ]);
  return (
    <div className="page-stack">
      <PageHeader
        title={"Zdravo, " + user.firstName + "."}
        description="Vaši slobodni dani, planovi i zahtevi na jednom mestu."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr]">
        <section className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-medium opacity-90">
                Raspoloživi dani
              </h2>
              <p className="mt-3 text-5xl font-semibold tracking-tight">
                {user.availableDays}
                <span className="ml-2 text-base font-normal">
                  {daysLabel(user.availableDays)}
                </span>
              </p>
            </div>
            <CalendarDays className="size-7 opacity-80" />
          </div>
          <p className="mt-4 text-xs leading-relaxed opacity-85">
            Zahtevi na čekanju još nisu oduzeti od ovog stanja.
          </p>
          <Button
            asChild
            className="mt-6 bg-white text-[#08616b] hover:bg-white/90"
          >
            <Link href="/employee/new-request">
              <Plus className="size-4" />
              Zatraži odsustvo
            </Link>
          </Button>
        </section>
        <section className="surface p-6">
          <Clock3 className="mb-5 size-6 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            Čeka odluku
          </h2>
          <p className="mt-2 text-3xl font-semibold">
            {pending._count}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              zahteva
            </span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Ukupno {pending._sum.workingDaysCount ?? 0} dana u zahtevima na
            čekanju.
          </p>
          <Link
            href="/employee/my-requests?status=PENDING"
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
          >
            Pogledaj zahteve
            <ArrowUpRight className="size-4" />
          </Link>
        </section>
        <section className="surface p-6 md:col-span-2 xl:col-span-1">
          <CalendarDays className="mb-5 size-6 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            Sledeće ili tekuće odsustvo
          </h2>
          {next ? (
            <>
              <p className="mt-3 text-lg font-semibold">
                {formatDate(next.startDate)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                do {formatDate(next.endDate)}
              </p>
              <p className="mt-5 text-sm font-medium text-primary">
                {next.workingDaysCount} {daysLabel(next.workingDaysCount)} za
                vaše planove
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-lg font-semibold">Planovi tek dolaze.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ovde će biti prikazano vaše sledeće odobreno odsustvo.
              </p>
            </>
          )}
        </section>
      </div>
      <section className="surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
          <h2 className="section-title">Poslednji zahtevi</h2>
          <Link
            href="/employee/my-requests"
            className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
          >
            Svi zahtevi
            <Chevron />
          </Link>
        </div>
        {recent.length ? (
          <RequestList requests={recent} />
        ) : (
          <EmptyState
            title="Vaš prvi odmor počinje ovde."
            description="Izaberite datume i pošaljite zahtev. Status i odgovor administratora biće dostupni u ovom pregledu."
            action={
              <Button asChild>
                <Link href="/employee/new-request">
                  <Plus className="size-4" />
                  Novi zahtev
                </Link>
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
function Chevron() {
  return <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />;
}
