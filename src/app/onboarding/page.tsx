import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import OnboardingForm from "@/components/OnboardingForm";
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const { mode } = await searchParams;
  return (
    <AuthShell
      title="Još malo do vašeg tima."
      description="Dopunite podatke i izaberite kako želite da koristite TimeOffer."
    >
      <OnboardingForm
        userEmail={
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses[0]?.emailAddress ||
          ""
        }
        firstName={user.firstName || ""}
        lastName={user.lastName || ""}
        initialMode={mode === "admin" ? "admin" : "employee"}
      />
    </AuthShell>
  );
}
