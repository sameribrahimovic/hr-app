"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { weekdays } from "../time-off";
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Prijavite se da biste nastavili.");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN")
    throw new Error("Ova akcija je dostupna administratorima.");
  return user;
}
function refreshRequests() {
  revalidatePath("/admin");
  revalidatePath("/admin/time-off-requests");
  revalidatePath("/employee");
  revalidatePath("/employee/my-requests");
}
export async function updateCompanyProfile(input: {
  name: string;
  website?: string;
  logo?: string;
}) {
  const user = await requireAdmin();
  const optionalUrl = z
    .string()
    .url()
    .refine((value) => /^https?:/.test(value))
    .or(z.literal(""))
    .optional();
  const data = z
    .object({
      name: z.string().trim().min(1).max(100),
      website: optionalUrl,
      logo: optionalUrl,
    })
    .parse(input);
  await prisma.company.update({ where: { id: user.companyId }, data });
  revalidatePath("/admin", "layout");
  return { success: true };
}
export async function updateCompanyWorkingDays(workingDays: string[]) {
  const user = await requireAdmin();
  const days = z
    .array(
      z.string().refine((value) => weekdays.some((day) => day.id === value)),
    )
    .min(1)
    .max(7)
    .parse(workingDays);
  await prisma.company.update({
    where: { id: user.companyId },
    data: { workingDays: JSON.stringify([...new Set(days)]) },
  });
  revalidatePath("/admin/company-settings/working-days");
  revalidatePath("/employee/new-request");
  return { success: true };
}
const holidaySchema = z.object({
  name: z.string().trim().min(1).max(100),
  date: z.date(),
  isRecurring: z.boolean(),
});
export async function addCompanyHoliday(input: {
  name: string;
  date: Date;
  isRecurring: boolean;
}) {
  const user = await requireAdmin();
  const data = holidaySchema.parse(input);
  const holiday = await prisma.companyHoliday.create({
    data: { ...data, companyId: user.companyId },
  });
  revalidatePath("/admin/company-settings/holidays");
  revalidatePath("/employee/new-request");
  return holiday;
}
export async function updateCompanyHoliday(input: {
  id: string;
  name: string;
  date: Date;
  isRecurring: boolean;
}) {
  const user = await requireAdmin();
  const data = holidaySchema.parse(input);
  const result = await prisma.companyHoliday.updateMany({
    where: { id: input.id, companyId: user.companyId },
    data,
  });
  if (result.count !== 1) throw new Error("Praznik nije pronađen.");
  revalidatePath("/admin/company-settings/holidays");
  revalidatePath("/employee/new-request");
  return prisma.companyHoliday.findUniqueOrThrow({ where: { id: input.id } });
}
export async function deleteCompanyHoliday(id: string) {
  const user = await requireAdmin();
  const result = await prisma.companyHoliday.deleteMany({
    where: { id, companyId: user.companyId },
  });
  if (result.count !== 1) throw new Error("Praznik nije pronađen.");
  revalidatePath("/admin/company-settings/holidays");
  revalidatePath("/employee/new-request");
  return { success: true };
}
export async function updateEmployeeAllowance(input: {
  employeeId: string;
  availableDays: number;
}) {
  const user = await requireAdmin();
  const data = z
    .object({
      employeeId: z.string().min(1),
      availableDays: z.number().int().min(0).max(366),
    })
    .parse(input);
  const result = await prisma.user.updateMany({
    where: { id: data.employeeId, companyId: user.companyId },
    data: { availableDays: data.availableDays },
  });
  if (result.count !== 1)
    throw new Error("Zaposleni nije pronađen u vašoj firmi.");
  revalidatePath("/admin/employees");
  revalidatePath("/admin/employees/allowance");
  revalidatePath("/employee");
  return { success: true };
}
export async function generateInvitationCode() {
  const user = await requireAdmin();
  const { randomInt } = await import("node:crypto");
  let code = String(randomInt(100000, 1000000));
  while (await prisma.code.findFirst({ where: { code } }))
    code = String(randomInt(100000, 1000000));
  const result = await prisma.code.create({
    data: { code, companyId: user.companyId },
  });
  revalidatePath("/admin/invitation-codes");
  return result;
}
export async function updateTimeOffRequestStatus(input: {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  notes?: string;
}) {
  const user = await requireAdmin();
  const parsed = z
    .object({
      requestId: z.string().min(1),
      status: z.enum(["APPROVED", "REJECTED"]),
      notes: z.string().trim().max(2000).optional(),
    })
    .safeParse(input);
  if (!parsed.success)
    return {
      success: false as const,
      error: "Proverite odluku i dužinu napomene.",
    };
  const { requestId, status, notes } = parsed.data;
  if (status === "REJECTED" && !notes)
    return { success: false as const, error: "Unesite razlog odbijanja." };
  try {
    await prisma.$transaction(async (tx) => {
      const request = await tx.timeOffRequest.findFirst({
        where: { id: requestId, employee: { companyId: user.companyId } },
      });
      if (!request) throw new Error("NOT_FOUND");
      const changed = await tx.timeOffRequest.updateMany({
        where: { id: requestId, status: "PENDING" },
        data: { status, notes: notes || null, managerId: user.id },
      });
      if (changed.count !== 1) throw new Error("ALREADY_PROCESSED");
      if (status === "APPROVED") {
        if (request.workingDaysCount < 1) throw new Error("INVALID_DAYS");
        const balance = await tx.user.updateMany({
          where: {
            id: request.employeeId,
            companyId: user.companyId,
            availableDays: { gte: request.workingDaysCount },
          },
          data: { availableDays: { decrement: request.workingDaysCount } },
        });
        if (balance.count !== 1) throw new Error("INSUFFICIENT_DAYS");
      }
    });
  } catch (error) {
    const errors: Record<string, string> = {
      NOT_FOUND: "Zahtev nije pronađen u vašoj firmi.",
      ALREADY_PROCESSED: "Ovaj zahtev je već obrađen. Osvežite stranicu.",
      INSUFFICIENT_DAYS: "Zaposleni više nema dovoljno raspoloživih dana.",
      INVALID_DAYS:
        "Zahtev nema ispravan broj radnih dana i ne može biti odobren.",
    };
    return {
      success: false as const,
      error:
        error instanceof Error && errors[error.message]
          ? errors[error.message]
          : "Odluka nije sačuvana. Pokušajte ponovo.",
    };
  }
  refreshRequests();
  revalidatePath("/admin/time-off-requests/" + requestId);
  return { success: true as const };
}
