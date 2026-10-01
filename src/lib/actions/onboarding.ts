"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { z } from "zod";
import { defaultWorkingDays } from "../time-off";
const schema = z.object({
  accountType: z.enum(["admin", "employee"]),
  firstName: z.string().trim().min(1).max(55),
  lastName: z.string().trim().min(1).max(55),
  companyName: z.string().trim().max(100),
  department: z.string().trim().max(100),
  invitationCode: z.string().trim(),
});
export async function completeOnboarding(input: z.infer<typeof schema>) {
  const { userId } = await auth();
  if (!userId)
    return {
      success: false as const,
      error: "Prijavite se da biste nastavili.",
    };
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: "Proverite obavezna polja." };
  const data = parsed.data;
  if (data.accountType === "admin" && !data.companyName)
    return { success: false as const, error: "Unesite naziv firme." };
  if (data.accountType === "employee" && !/^\d{6}$/.test(data.invitationCode))
    return {
      success: false as const,
      error: "Pozivni kod mora imati šest cifara.",
    };
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;
    if (!email)
      return {
        success: false as const,
        error: "Dodajte i potvrdite email adresu svog naloga.",
      };
    // A retry after a metadata failure reuses the company and employee already created.
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        if (data.accountType === "admin")
          return tx.user.create({
            data: {
              clerkId: userId,
              email,
              firstName: data.firstName,
              lastName: data.lastName,
              role: "ADMIN",
              company: {
                create: {
                  name: data.companyName,
                  workingDays: JSON.stringify(defaultWorkingDays),
                },
              },
            },
          });
        const code = await tx.code.findFirst({
          where: { code: data.invitationCode, used: false },
        });
        if (!code) throw new Error("INVALID_CODE");
        const claimed = await tx.code.updateMany({
          where: { id: code.id, used: false },
          data: { used: true },
        });
        if (claimed.count !== 1) throw new Error("INVALID_CODE");
        return tx.user.create({
          data: {
            clerkId: userId,
            email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: "EMPLOYEE",
            department: data.department || null,
            companyId: code.companyId,
          },
        });
      });
    }
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingCompleted: true,
        role: user.role,
        companyId: user.companyId,
      },
    });
    return { success: true as const, role: user.role };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error && error.message === "INVALID_CODE"
          ? "Kod nije važeći ili je već iskorišćen. Zatražite novi od administratora."
          : "Podešavanje nije završeno. Pokušajte ponovo; sačuvani podaci neće biti duplirani.",
    };
  }
}
