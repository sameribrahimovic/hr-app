import Link from "next/link";
import type { TimeOffRequest } from "@prisma/client";
import { CalendarDays, ChevronRight } from "lucide-react";
import { RequestStatus } from "@/components/RequestStatus";
import { leaveTypes, daysLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
type Request = TimeOffRequest & { employee?: { firstName: string; lastName: string }; manager?: { firstName: string; lastName: string } | null };
export function RequestList({ requests, admin = false }: { requests: Request[]; admin?: boolean }) {
  return <ul className="divide-y">{requests.map(request => <li key={request.id} className="p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3 sm:gap-4"><span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary min-[380px]:flex"><CalendarDays className="size-5" aria-hidden="true" /></span><div className="min-w-0">
        <p className="break-words text-sm font-semibold">{admin && request.employee ? request.employee.firstName + " " + request.employee.lastName : leaveTypes[request.type]}</p>
        <p className="mt-1 text-sm">{formatDate(request.startDate)} – {formatDate(request.endDate)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{request.workingDaysCount} {daysLabel(request.workingDaysCount)} odsustva{admin ? " · " + leaveTypes[request.type] : ""}</p>
      </div></div>
      <div className="flex items-center justify-between gap-3 sm:justify-end"><RequestStatus status={request.status} />{admin && <Link href={"/admin/time-off-requests/" + request.id} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary" aria-label={"Pregledaj zahtev: " + request.employee?.firstName + " " + request.employee?.lastName}>Pregledaj<ChevronRight className="size-4" /></Link>}</div>
    </div>
    {!admin && (request.notes || request.reason || request.manager) && <details className="mt-3 text-sm"><summary className="w-fit cursor-pointer py-2 text-muted-foreground">Detalji zahteva</summary><div className="mt-1 space-y-2 rounded-xl bg-muted p-4 leading-relaxed">{request.reason && <p className="break-words"><span className="font-medium">Vaša napomena: </span>{request.reason}</p>}{request.notes && <p className="break-words"><span className="font-medium">Odgovor administratora: </span>{request.notes}</p>}{request.manager && <p className="text-xs text-muted-foreground">Obradio/la: {request.manager.firstName} {request.manager.lastName}</p>}<p className="text-xs text-muted-foreground">Poslato {formatDate(request.createdAt)}</p></div></details>}
  </li>)}</ul>;
}
