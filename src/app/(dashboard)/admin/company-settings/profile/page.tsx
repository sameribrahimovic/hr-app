import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { SettingsNav } from "@/components/SettingsNav";
import CompanyProfileForm from "@/components/CompanyProfileForm";
export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { company: true } });
  if (!user || user.role !== "ADMIN") redirect("/");
  return <div className="page-stack"><PageHeader title="Profil firme" description="Osnovni podaci o vašem timu." /><SettingsNav active="/admin/company-settings/profile" /><CompanyProfileForm initialData={{ name: user.company.name, website: user.company.website || "", logo: user.company.logo || "" }} /></div>;
}
