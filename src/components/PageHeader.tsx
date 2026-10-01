import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
export function PageHeader({ title, description, action, back }: { title: string; description?: string; action?: ReactNode; back?: { href: string; label: string } }) {
  return <div className="space-y-3">
    {back && <Link href={back.href} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" aria-hidden="true" />{back.label}</Link>}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0"><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}</div>
      {action && <div className="shrink-0 [&>a]:w-full [&>button]:w-full sm:[&>a]:w-auto sm:[&>button]:w-auto">{action}</div>}
    </div>
  </div>;
}
