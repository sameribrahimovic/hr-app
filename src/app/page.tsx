import Link from "next/link";
import { CalendarDays, Check, CheckCheck, ChevronRight, Clock3, Plus, Smartphone, Users } from "lucide-react";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/components/RequestStatus";

function ProductPreview() {
  return <div className="relative mx-auto w-full max-w-lg">
    <div className="rounded-[2rem] bg-secondary p-3 sm:p-6">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4"><span className="flex items-center gap-2 text-sm font-semibold"><CalendarDays className="size-4 text-primary" />Moj pregled</span><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">Primer prikaza</span></div>
        <div className="space-y-5 p-5 sm:p-6">
          <div><p className="text-sm text-muted-foreground">Dobro jutro, Ana</p><h2 className="mt-1 text-xl font-semibold">Vreme za vaše planove.</h2></div>
          <div className="flex items-center justify-between rounded-xl bg-primary px-5 py-4 text-primary-foreground"><div><p className="text-sm opacity-90">Raspoloživi dani</p><p className="mt-1 text-4xl font-semibold tracking-tight">18 <span className="text-sm font-normal">dana</span></p></div><CalendarDays className="size-9 opacity-75" strokeWidth={1.5} /></div>
          <div>
            <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">Jun 2026.</span><span className="text-xs text-muted-foreground">Vaš sledeći odmor</span></div>
            <div aria-label="Primer kalendara: odmor od 15. do 19. juna" className="grid grid-cols-7 gap-y-1 text-center text-xs">
              {["P", "U", "S", "Č", "P", "S", "N"].map((day, i) => <span key={i} className="py-2 text-muted-foreground">{day}</span>)}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => <span key={day} className={"flex aspect-square items-center justify-center " + (day >= 15 && day <= 19 ? "bg-secondary font-semibold text-primary " + (day === 15 ? "rounded-l-lg" : day === 19 ? "rounded-r-lg" : "") : "text-muted-foreground")}>{day}</span>)}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><div><p className="text-sm font-medium">Godišnji odmor</p><p className="mt-1 text-xs text-muted-foreground">15–19. jun · 5 radnih dana</p></div><RequestStatus status="APPROVED" /></div>
        </div>
      </div>
    </div>
    <p className="mt-3 text-center text-xs text-muted-foreground">Ilustrativni podaci. Vaši planovi imaju svoj prostor.</p>
  </div>;
}

const questions = [
  ["Šta mogu da uradim kao zaposleni?", "Možete da proverite raspoložive dane, pošaljete zahtev za godišnji odmor ili drugo odsustvo i pratite status i napomenu administratora."],
  ["Kako da uključim svoju firmu?", "Kreirajte nalog i izaberite kreiranje firme. Podesite radnu nedelju i praznike, zatim generišite pozivne kodove za zaposlene."],
  ["Već imam pozivni kod. Šta dalje?", "Izaberite „Pridruži se timu“, napravite nalog i unesite šestocifreni kod koji ste dobili od administratora."],
  ["Mogu li da koristim TimeOffer na telefonu?", "Da. Zahteve, slobodne dane i odluke možete da pregledate u pregledaču na telefonu. Preuzimanje posebne aplikacije nije potrebno."],
];

export default function Home() {
  return <div className="min-h-dvh">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:p-4">Pređi na sadržaj</a>
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur-sm">
      <div className="site-container flex h-20 items-center justify-between gap-3">
        <Brand />
        <nav aria-label="Glavna navigacija" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><Link href="#mogucnosti" className="hover:text-primary">Mogućnosti</Link><Link href="#kako-radi" className="hover:text-primary">Kako funkcioniše</Link><Link href="#pitanja" className="hover:text-primary">Pitanja</Link></nav>
        <div className="flex items-center gap-1 sm:gap-3"><div className="hidden sm:block"><ThemeToggle /></div><Button asChild variant="outline"><Link href="/sign-in">Prijavi se</Link></Button></div>
      </div>
    </header>
    <main id="main-content">
      <section className="site-container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs font-medium text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />Manje administracije. Više vremena.</div>
          <h1 className="max-w-xl text-[2.65rem] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-[4.2rem]">Odmori i odsustva, jasno organizovani.</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">Pošaljite zahtev, pratite odobrenje i proverite preostale slobodne dane. Sve što vašem timu treba za jednostavnije planiranje odsustava.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/sign-up?mode=admin">Kreiraj firmu<ChevronRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/sign-up?mode=employee">Pridruži se timu</Link></Button></div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Imate pozivni kod? Pridružite se svojoj firmi u nekoliko koraka.</p>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t pt-6 text-xs font-medium sm:text-sm">{["Jasno stanje dana", "Pregledni zahtevi", "Dostupno na telefonu"].map(text => <span key={text} className="flex items-center gap-2"><Check className="size-4 text-primary" />{text}</span>)}</div>
        </div>
        <ProductPreview />
      </section>
      <section id="mogucnosti" className="border-y bg-card">
        <div className="site-container py-14 sm:py-20">
          <div className="mb-10 max-w-2xl"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dobar pregled za ceo tim.</h2><p className="mt-4 leading-relaxed text-muted-foreground">Od prvog zahteva do poslednjeg slobodnog dana — svako zna šta je sledeće.</p></div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="rounded-2xl bg-secondary p-6 sm:p-8"><CalendarDays className="mb-5 size-7 text-primary" /><h3 className="text-xl font-semibold">Vaše odsustvo, bez nedoumica.</h3><p className="mt-3 leading-relaxed text-muted-foreground">Izaberite datume i vrstu odsustva. Pre slanja pogledajte koliko radnih dana zahtev obuhvata.</p><ul className="mt-6 space-y-3 text-sm">{["Raspoloživi dani uvek na dohvat ruke", "Status zahteva i napomena administratora", "Prethodni i predstojeći odmori na jednom mestu"].map(text => <li key={text} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{text}</li>)}</ul><Link href="/sign-up?mode=employee" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">Pridruži se svom timu<ChevronRight className="size-4" /></Link></div>
            <div className="py-2 sm:py-5"><Users className="mb-5 size-7 text-primary" /><h3 className="text-xl font-semibold">Manje posla oko organizacije.</h3><p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">Pregledajte zahteve zaposlenih, zabeležite odluku i uredite pravila odsustva za svoju firmu.</p><div className="mt-7 space-y-5">{[{ icon: CheckCheck, title: "Odluke na jednom mestu", text: "Odobrite ili odbijte zahtev uz napomenu zaposlenom." }, { icon: CalendarDays, title: "Pravila prilagođena firmi", text: "Podesite radne dane i praznike koji se izuzimaju iz obračuna." }, { icon: Users, title: "Jednostavno uključivanje tima", text: "Pozovite zaposlene kodom i podesite raspoložive dane." }].map(item => <div key={item.title} className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted"><item.icon className="size-5 text-primary" /></span><div><h4 className="text-sm font-semibold">{item.title}</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p></div></div>)}</div></div>
          </div>
        </div>
      </section>
      <section id="kako-radi" className="site-container py-14 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Od plana do odobrenja.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">{[{ icon: CalendarDays, title: "Izaberite datume", text: "Odredite period i vrstu odsustva. Broj radnih dana računa se prema pravilima firme." }, { icon: Clock3, title: "Pošaljite zahtev", text: "Administrator dobija zahtev na pregled. Po potrebi dodajte kratku napomenu." }, { icon: CheckCheck, title: "Pratite odluku", text: "Status i obrazloženje dostupni su u vašim zahtevima. Odobreni dani ažuriraju vaše stanje." }].map((item, index) => <div key={item.title} className="border-t pt-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm font-medium text-primary">Korak {index + 1}</span><item.icon className="size-5 text-muted-foreground" /></div><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p></div>)}</div>
      </section>
      <section className="site-container"><div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary p-7 text-primary-foreground sm:flex-row sm:items-center sm:p-10"><div className="max-w-xl"><Smartphone className="mb-4 size-7" /><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Vaši planovi idu sa vama.</h2><p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">Proverite dane uz jutarnju kafu. Pošaljite zahtev u pokretu. TimeOffer je prilagođen telefonu, tabletu i računaru.</p></div><Button asChild size="lg" className="shrink-0 bg-white text-[#08616b] hover:bg-white/90"><Link href="/sign-in">Otvori svoj nalog</Link></Button></div></section>
      <section id="pitanja" className="site-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><h2 className="text-3xl font-semibold tracking-tight">Pre nego što počnete.</h2><p className="mt-4 text-muted-foreground">Odgovori na najčešća pitanja.</p></div><div className="divide-y border-y">{questions.map(([question, answer]) => <details key={question} className="group py-1"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium sm:text-base [&::-webkit-details-marker]:hidden">{question}<Plus className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" /></summary><p className="pb-5 pr-6 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div></section>
    </main>
    <footer className="border-t bg-card"><div className="site-container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between"><Brand /><p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TimeOffer. Vreme za bolju organizaciju.</p><div className="flex items-center gap-5 text-sm"><Link href="/sign-in" className="hover:text-primary">Prijava</Link><Link href="/sign-up" className="hover:text-primary">Registracija</Link><div className="sm:hidden"><ThemeToggle /></div></div></div></footer>
  </div>;
}
