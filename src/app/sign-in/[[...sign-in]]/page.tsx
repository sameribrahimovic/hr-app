import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";
export default function SignInPage() {
  return <AuthShell title="Dobro došli nazad." description="Vaši slobodni dani i zahtevi čekaju vas na jednom mestu."><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/" appearance={{ elements: { rootBox: "w-full", cardBox: "w-full max-w-full", card: "w-full max-w-full shadow-none" }, variables: { colorPrimary: "#087f8c", borderRadius: "0.75rem" } }} /></AuthShell>;
}
