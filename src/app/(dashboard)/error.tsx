"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="surface mx-auto mt-8 max-w-lg p-7 text-center"><h1 className="text-xl font-semibold">Podaci trenutno nisu dostupni.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Proverite vezu i pokušajte ponovo. Ako problem potraje, obratite se administratoru.</p><Button className="mt-6" onClick={reset}><RefreshCw className="size-4" />Pokušaj ponovo</Button></div>;
}
