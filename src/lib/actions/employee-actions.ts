"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { isDateKey, leaveSummary, parseWorkingDays, todayKey } from "../time-off";
const schema = z.object({
  startDate: z.string().refine(isDateKey), endDate: z.string().refine(isDateKey),
  type: z.enum(["VACATION", "SICK", "PERSONAL", "OTHER"]), reason: z.string().trim().max(2000),
});
export async function createTimeOffRequest(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Prijavite se da biste poslali zahtev." };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false as const, error: "Proverite datume, vrstu odsustva i dužinu napomene." };
  const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { company: { include: { holidays: true } } } });
  if (!user || user.role !== "EMPLOYEE") return { success: false as const, error: "Zahtev može poslati zaposleni sa završenim podešavanjem naloga." };
  const { startDate, endDate, type, reason } = parsed.data;
  const summary = leaveSummary(startDate, endDate, parseWorkingDays(user.company.workingDays), user.company.holidays);
  if (summary.error) return { success: false as const, error: summary.error };
  if (startDate < todayKey()) return { success: false as const, error: "Početak odsustva mora biti danas ili kasnije." };
  if (summary.workingDays < 1) return { success: false as const, error: "Izabrani period ne sadrži radne dane." };
  if (summary.workingDays > user.availableDays) return { success: false as const, error: "Nemate dovoljno raspoloživih dana za ovaj zahtev." };
  try {
    await prisma.$transaction(async tx => {
      // Lock the employee row so simultaneous submissions cannot create overlapping requests.
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;
      const overlap = await tx.timeOffRequest.findFirst({ where: { employeeId: user.id, status: { in: ["PENDING", "APPROVED"] }, startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } } });
      if (overlap) throw new Error("OVERLAP");
      await tx.timeOffRequest.create({ data: { employeeId: user.id, startDate: new Date(startDate), endDate: new Date(endDate), type, reason: reason || null, workingDaysCount: summary.workingDays } });
    });
  } catch (error) {
    return { success: false as const, error: error instanceof Error && error.message === "OVERLAP" ? "Period se preklapa sa postojećim zahtevom. Osvežite pregled datuma." : "Zahtev nije sačuvan. Pokušajte ponovo." };
  }
  revalidatePath("/employee"); revalidatePath("/employee/my-requests"); revalidatePath("/admin");
  revalidatePath("/admin/time-off-requests");
  return { success: true as const };
}
