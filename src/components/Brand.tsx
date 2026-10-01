import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";
export function Brand({ href = "/", className }: { href?: string; className?: string }) {
  return <Link href={href} aria-label="TimeOffer — početna" className={cn("inline-flex shrink-0 items-center gap-2.5 font-semibold tracking-tight", className)}>
    <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><CalendarCheck2 className="size-5" aria-hidden="true" /></span>
    <span className="text-xl">TimeOffer<span className="text-primary">.</span></span>
  </Link>;
}
