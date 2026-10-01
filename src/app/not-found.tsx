import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="site-container flex min-h-[70dvh] flex-col items-center justify-center gap-5 py-12 text-center">
      <Brand />
      <p className="mt-5 text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">Ova stranica nije pronađena.</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Link možda više nije važeći. Vratite se na svoj pregled da biste
        nastavili.
      </p>
      <Button asChild>
        <Link href="/">Nazad na početnu</Link>
      </Button>
    </main>
  );
}
