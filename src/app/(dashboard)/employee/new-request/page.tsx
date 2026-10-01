import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TimeOffRequestForm from "@/components/TimeOffRequestForm";
import { parseWorkingDays } from "@/lib/time-off";
export default async function NewRequestPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { company: { include: { holidays: true } } },
  });
  if (!user) redirect("/onboarding");
  const requests = await prisma.timeOffRequest.findMany({
    where: { employeeId: user.id, status: { in: ["PENDING", "APPROVED"] } },
  });
  return (
    <TimeOffRequestForm
      existingRequests={requests}
      companyHolidays={user.company.holidays}
      workingDays={parseWorkingDays(user.company.workingDays)}
      availableDays={user.availableDays}
    />
  );
}
