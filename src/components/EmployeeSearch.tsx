import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function EmployeeSearch({ basePath = "/admin/employees", search = "" }: { basePath?: string; search?: string }) {
  return <form action={basePath} method="get" className="flex w-full flex-col gap-3 sm:flex-row"><div className="relative flex-1"><label htmlFor="employee-search" className="sr-only">Pretraži zaposlene</label><Search className="absolute top-4 left-3 size-4 text-muted-foreground" aria-hidden="true" /><Input id="employee-search" name="search" defaultValue={search} placeholder="Ime, email ili odeljenje..." className="pl-10" /></div><Button variant="outline" type="submit">Pretraži</Button></form>;
}
