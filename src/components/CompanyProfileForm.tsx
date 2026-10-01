"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCompanyProfile } from "@/lib/actions/admin-actions";
import { toast } from "sonner";
export default function CompanyProfileForm({
  initialData,
}: {
  initialData: { name: string; website: string; logo: string };
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await updateCompanyProfile({
        name: String(data.get("name")),
        website: String(data.get("website")),
        logo: String(data.get("logo")),
      });
      toast.success("Podaci firme su sačuvani.");
      router.refresh();
    } catch {
      setError(
        "Podaci nisu sačuvani. Proverite naziv i web adrese pa pokušajte ponovo.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="surface max-w-3xl space-y-6 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Building2 className="size-6" />
        </span>
        <div>
          <h2 className="section-title">Podaci o firmi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ovi podaci predstavljaju vaš tim.
          </p>
        </div>
      </div>
      <fieldset disabled={pending} className="space-y-5">
        <div>
          <label htmlFor="company-name" className="field-label">
            Naziv firme
          </label>
          <Input
            id="company-name"
            name="name"
            defaultValue={initialData.name}
            required
            maxLength={100}
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="company-website" className="field-label">
            Web adresa{" "}
            <span className="font-normal text-muted-foreground">(opciono)</span>
          </label>
          <Input
            id="company-website"
            name="website"
            type="url"
            defaultValue={initialData.website}
            placeholder="https://vasafirma.rs"
            autoComplete="url"
          />
        </div>
        <div>
          <label htmlFor="company-logo" className="field-label">
            Link do logotipa{" "}
            <span className="font-normal text-muted-foreground">(opciono)</span>
          </label>
          <Input
            id="company-logo"
            name="logo"
            type="url"
            defaultValue={initialData.logo}
            placeholder="https://vasafirma.rs/logo.png"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Unesite javnu web adresu slike logotipa.
          </p>
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button disabled={pending} type="submit">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Čuvanje..." : "Sačuvaj izmene"}
        </Button>
      </div>
    </form>
  );
}
