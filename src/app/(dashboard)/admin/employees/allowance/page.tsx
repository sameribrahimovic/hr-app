import { redirect } from "next/navigation";
export default async function AllowancePage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams;
  redirect("/admin/employees" + (search ? "?search=" + encodeURIComponent(search) : ""));
}
