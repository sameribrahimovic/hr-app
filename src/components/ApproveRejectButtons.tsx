"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateTimeOffRequestStatus } from "@/lib/actions/admin-actions";
import { toast } from "sonner";
export default function ApproveRejectButtons({ id }: { id: string }) {
  const router = useRouter();
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;
    setPending(true);
    setError("");
    try {
      const result = await updateTimeOffRequestStatus({
        requestId: id,
        status: action,
        notes,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      toast.success(
        action === "APPROVED" ? "Zahtev je odobren." : "Zahtev je odbijen.",
      );
      setAction(null);
      setNotes("");
      router.refresh();
    } catch {
      setError("Odluka nije sačuvana. Pokušajte ponovo.");
    } finally {
      setPending(false);
    }
  }
  function open(status: "APPROVED" | "REJECTED") {
    setError("");
    setNotes("");
    setAction(status);
  }
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" onClick={() => open("APPROVED")}>
          <Check className="size-4" />
          Odobri
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => open("REJECTED")}
        >
          <X className="size-4" />
          Odbij
        </Button>
      </div>
      <Dialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open && !pending) setAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "APPROVED" ? "Odobrite odsustvo" : "Odbijte zahtev"}
            </DialogTitle>
            <DialogDescription>
              {action === "APPROVED"
                ? "Zaposleni će videti odluku i vašu napomenu u svojim zahtevima."
                : "Navedite razlog kako bi zaposleni znao zašto zahtev nije odobren."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={confirm} className="space-y-5">
            <div>
              <label htmlFor="decision-notes" className="field-label">
                {action === "REJECTED"
                  ? "Razlog odbijanja"
                  : "Napomena (opciono)"}
              </label>
              <Textarea
                id="decision-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                required={action === "REJECTED"}
                maxLength={2000}
                disabled={pending}
                rows={4}
                placeholder="Napišite kratku poruku zaposlenom."
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setAction(null)}
              >
                Odustani
              </Button>
              <Button
                type="submit"
                disabled={pending}
                variant={action === "REJECTED" ? "destructive" : "default"}
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending
                  ? "Čuvanje..."
                  : action === "APPROVED"
                    ? "Potvrdi odobrenje"
                    : "Potvrdi odbijanje"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
