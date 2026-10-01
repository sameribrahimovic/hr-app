import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { SettingsNav } from "@/components/SettingsNav";
import CompanyWorkingDaysForm from "@/components/CompanyWorkingDaysForm";
import { parseWorkingDays } from "@/lib/time-off";
export default async function WorkingDaysPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { company: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/");
  return (
    <div className="page-stack">
      <PageHeader
        title="Radna nedelja"
        description="Podesite raspored koji važi za obračun odsustva u vašoj firmi."
      />
      <SettingsNav active="/admin/company-settings/working-days" />
      <CompanyWorkingDaysForm
        initialWorkingDays={parseWorkingDays(user.company.workingDays)}
      />
    </div>
  );
}
