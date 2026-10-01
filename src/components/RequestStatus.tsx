import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { requestStatuses } from "@/lib/labels";
export function RequestStatus({
  status,
}: {
  status: keyof typeof requestStatuses;
}) {
  const Icon =
    status === "APPROVED"
      ? CheckCircle2
      : status === "REJECTED"
        ? XCircle
        : Clock3;
  return (
    <span
      className={
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium status-" +
        status.toLowerCase()
      }
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {requestStatuses[status]}
    </span>
  );
}
