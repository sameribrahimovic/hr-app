import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { RequestList } from "@/components/RequestList";
import { RequestFilters } from "@/components/RequestFilters";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { pageNumber, requestFilter, type FilterParams } from "@/lib/filters";
export default async function MyRequestsPage({ searchParams }: { searchParams: Promise<FilterParams> }) {
  const params = await searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");
  const where = { employeeId: user.id, ...requestFilter(params), ...(params.search?.trim() ? { OR: [{ reason: { contains: params.search.trim(), mode: "insensitive" as const } }, { notes: { contains: params.search.trim(), mode: "insensitive" as const } }] } : {}) };
  const total = await prisma.timeOffRequest.count({ where });
  const page = pageNumber(params.page, total);
  const requests = await prisma.timeOffRequest.findMany({ where, include: { manager: true }, orderBy: { createdAt: "desc" }, take: 10, skip: (page - 1) * 10 });
  return <div className="page-stack"><PageHeader title="Moji zahtevi" description="Pratite odluke i pogledajte svoja prethodna i predstojeća odsustva." action={<Button asChild><Link href="/employee/new-request"><Plus className="size-4" />Novi zahtev</Link></Button>} /><RequestFilters base="/employee/my-requests" params={params} /><section className="surface">{requests.length ? <RequestList requests={requests} /> : <EmptyState title="Nema zahteva u ovom pregledu." description="Promenite filtere ili pošaljite novi zahtev za odsustvo." action={<Button asChild variant="outline"><Link href="/employee/new-request">Zatraži odsustvo</Link></Button>} />}<Pagination base="/employee/my-requests" params={params} page={page} total={total} /></section></div>;
}
