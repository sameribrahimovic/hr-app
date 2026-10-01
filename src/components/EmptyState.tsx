import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center px-5 py-12 text-center">
    <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><CalendarDays className="size-6" aria-hidden="true" /></span>
    <h2 className="font-semibold">{title}</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}
  </div>;
}
