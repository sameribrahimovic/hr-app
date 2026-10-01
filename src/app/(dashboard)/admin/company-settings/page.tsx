import Link from "next/link";
import { Building2, CalendarDays, Clock3, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
export default function SettingsPage() {
  const settings = [
    {
      title: "Profil firme",
      description: "Naziv, web adresa i logo vaše firme.",
      icon: Building2,
      href: "/admin/company-settings/profile",
    },
    {
      title: "Radna nedelja",
      description: "Dani koji ulaze u obračun odsustva zaposlenih.",
      icon: Clock3,
      href: "/admin/company-settings/working-days",
    },
    {
      title: "Praznici i neradni dani",
      description: "Datumi koje automatski izuzimamo iz obračuna.",
      icon: CalendarDays,
      href: "/admin/company-settings/holidays",
    },
  ];
  return (
    <div className="page-stack">
      <PageHeader
        title="Podešavanja firme"
        description="Uredite podatke i pravila koja važe za ceo tim."
      />
      <div className="surface divide-y">
        {settings.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-secondary/50 sm:p-6"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <item.icon className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Radna nedelja i praznici primenjuju se na nove zahteve. Već poslati
        zahtevi zadržavaju broj dana koji je izračunat pri slanju.
      </p>
    </div>
  );
}
