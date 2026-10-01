import Link from "next/link";
const links = [
  { href: "/admin/company-settings/profile", label: "Profil firme" },
  { href: "/admin/company-settings/working-days", label: "Radna nedelja" },
  { href: "/admin/company-settings/holidays", label: "Praznici" },
];
export function SettingsNav({ active }: { active: string }) {
  return (
    <nav aria-label="Podešavanja firme" className="flex flex-wrap gap-2">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={active === item.href ? "page" : undefined}
          className={
            "inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-medium " +
            (active === item.href
              ? "border-primary bg-secondary text-primary"
              : "bg-card text-muted-foreground hover:bg-muted")
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
