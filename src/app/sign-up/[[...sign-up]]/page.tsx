import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  const accountMode = mode === "admin" ? "admin" : "employee";
  return <AuthShell title={accountMode === "admin" ? "Prostor za vaš tim." : "Pridružite se svom timu."} description={accountMode === "admin" ? "Napravite nalog, zatim dodajte firmu i pozovite zaposlene." : "Napravite nalog, zatim unesite pozivni kod svoje firme."}><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl={"/onboarding?mode=" + accountMode} appearance={{ elements: { rootBox: "w-full", cardBox: "w-full max-w-full", card: "w-full max-w-full shadow-none" }, variables: { colorPrimary: "#087f8c", borderRadius: "0.75rem" } }} /></AuthShell>;
}
