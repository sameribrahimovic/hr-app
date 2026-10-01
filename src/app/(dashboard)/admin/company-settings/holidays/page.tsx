import CompanyHolidaysForm from "@/components/CompanyHolidaysForm";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HolidaysPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      companyId: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const companyHolidays = await prisma.companyHoliday.findMany({
    where: {
      companyId: user.companyId,
    },
  });
  return <CompanyHolidaysForm initialHolidays={companyHolidays} />;
};

export default HolidaysPage;
