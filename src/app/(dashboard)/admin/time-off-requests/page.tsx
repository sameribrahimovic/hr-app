import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { RequestList } from "@/components/RequestList";
import { RequestFilters } from "@/components/RequestFilters";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import {
  normalizeFilters,
  pageNumber,
  requestFilter,
  type FilterParams,
} from "@/lib/filters";
export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<FilterParams>;
}) {
  const params = normalizeFilters(await searchParams);
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") redirect("/");
  const search = params.search?.trim();
  const where = {
    employee: { companyId: user.companyId },
    ...requestFilter(params),
    ...(search
      ? {
          OR: [
            {
              employee: {
                firstName: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              employee: {
                lastName: { contains: search, mode: "insensitive" as const },
              },
            },
            { reason: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const total = await prisma.timeOffRequest.count({ where });
  const page = pageNumber(params.page, total);
  const requests = await prisma.timeOffRequest.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    skip: (page - 1) * 10,
  });
  return (
    <div className="page-stack">
      <PageHeader
        title="Zahtevi za odsustvo"
        description="Pregledajte planove tima i donesite odluke uz sve potrebne informacije."
      />
      <RequestFilters base="/admin/time-off-requests" params={params} admin />
      <section className="surface">
        {requests.length ? (
          <RequestList requests={requests} admin />
        ) : (
          <EmptyState
            title="Nema zahteva u ovom pregledu."
            description="Pokušajte sa drugim filterima. Novi zahtevi zaposlenih pojaviće se ovde."
          />
        )}
        <Pagination
          base="/admin/time-off-requests"
          params={params}
          page={page}
          total={total}
        />
      </section>
    </div>
  );
}
