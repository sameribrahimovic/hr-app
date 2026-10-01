import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { RequestStatus } from "@/components/RequestStatus";
import ApproveRejectButtons from "@/components/ApproveRejectButtons";
import { formatDate, calculateDays } from "@/lib/utils";
import { leaveTypes, daysLabel, roleLabels } from "@/lib/labels";
export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== "ADMIN") redirect("/");
  const { id } = await params;
  const request = await prisma.timeOffRequest.findFirst({ where: { id, employee: { companyId: admin.companyId } }, include: { employee: true, manager: true } });
  if (!request) notFound();
  return <div className="page-stack">
    <PageHeader title={leaveTypes[request.type]} description={"Zahtev zaposlenog: " + request.employee.firstName + " " + request.employee.lastName} back={{ href: "/admin/time-off-requests", label: "Svi zahtevi" }} />
    <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="surface p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="section-title">Detalji odsustva</h2><RequestStatus status={request.status} /></div><div className="my-6 rounded-xl bg-secondary p-5"><p className="text-lg font-semibold">{formatDate(request.startDate)} – {formatDate(request.endDate)}</p><p className="mt-2 text-sm text-secondary-foreground">{request.workingDaysCount} {daysLabel(request.workingDaysCount)} odsustva · {calculateDays(request.startDate, request.endDate)} kalendarskih dana</p></div><dl className="space-y-5 text-sm"><div><dt className="text-muted-foreground">Poslato</dt><dd className="mt-1">{formatDate(request.createdAt)}</dd></div><div><dt className="text-muted-foreground">Napomena zaposlenog</dt><dd className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{request.reason || "Zaposleni nije dodao napomenu."}</dd></div>{request.status !== "PENDING" && <div className="border-t pt-5"><dt className="font-medium">Odluka administratora</dt><dd className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{request.notes || "Nema dodatne napomene."}</dd>{request.manager && <dd className="mt-3 text-xs text-muted-foreground">{request.manager.firstName} {request.manager.lastName} · {formatDate(request.updatedAt)}</dd>}</div>}</dl></section>
      <aside className="space-y-5"><section className="surface p-5 sm:p-6"><h2 className="section-title">Zaposleni</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-muted-foreground">Ime i prezime</dt><dd className="mt-1 break-words font-medium">{request.employee.firstName} {request.employee.lastName}</dd></div><div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all">{request.employee.email}</dd></div><div><dt className="text-muted-foreground">Odeljenje</dt><dd className="mt-1">{request.employee.department || "Nije navedeno"}</dd></div><div><dt className="text-muted-foreground">Uloga</dt><dd className="mt-1">{roleLabels[request.employee.role]}</dd></div><div className="border-t pt-4"><dt className="text-muted-foreground">Trenutno raspoloživo</dt><dd className="mt-1 text-2xl font-semibold">{request.employee.availableDays} <span className="text-sm font-normal">dana</span></dd></div></dl></section>{request.status === "PENDING" && <section className="surface p-5"><h2 className="section-title">Vaša odluka</h2><p className="my-3 text-sm leading-relaxed text-muted-foreground">Odobrenjem se {request.workingDaysCount} dana oduzima od raspoloživog stanja zaposlenog.</p><ApproveRejectButtons id={id} /></section>}</aside>
    </div>
  </div>;
}
