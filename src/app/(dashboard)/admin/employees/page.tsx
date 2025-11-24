import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmployeeSearch } from "@/components/EmployeeSearch";
import { ChevronLeft, ChevronRight, Mail, Building2, User } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
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
    },
  });

  if (!user?.companyId) {
    redirect("/onboarding");
  }

  const search = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build where clause for search
  const whereClause = {
    companyId: user.companyId,
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { department: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  // Get total count for pagination
  const totalCount = await prisma.user.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get paginated users
  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      lastName: "asc",
    },
    skip,
    take: ITEMS_PER_PAGE,
  });

  const startNumber = (currentPage - 1) * ITEMS_PER_PAGE + 1;

  return (
    <div className="space-y-8 mt-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-gray-500">Manage employee accounts</p>
          </div>
          <Suspense fallback={
            <div className="relative w-full max-w-sm">
              <div className="h-9 w-full rounded-md border bg-transparent px-10" />
            </div>
          }>
            <EmployeeSearch />
          </Suspense>
        </div>
        <Card>
          <CardContent className="pt-6">
            {users?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">
                  {search ? "No employees found matching your search." : "No employees found."}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {users?.map((user, index) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">
                              #{startNumber + index}
                            </span>
                            <h3 className="font-semibold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary" className="capitalize">
                          <User className="w-3 h-3 mr-1" />
                          {user.role}
                        </Badge>
                        {user.department && (
                          <Badge variant="outline">
                            <Building2 className="w-3 h-3 mr-1" />
                            {user.department}
                          </Badge>
                        )}
                      </div>
                      <div className="pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link href="/admin/employees/allowance">View Details</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {startNumber + index}
                          </TableCell>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">
                            {user.role}
                          </TableCell>
                          <TableCell>{user.department || "N/A"}</TableCell>
                          <TableCell>
                            <Button variant="link" asChild>
                              <Link href="/admin/employees/allowance">View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-500 text-center sm:text-left">
                      Showing {startNumber} to {Math.min(startNumber + users.length - 1, totalCount)} of {totalCount} employees
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {currentPage === 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link
                            href={`/admin/employees?${new URLSearchParams({
                              ...(search && { search }),
                              page: String(currentPage - 1),
                            }).toString()}`}
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Link>
                        </Button>
                      )}
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                          .map((page, index, array) => (
                            <div key={page} className="flex items-center gap-1">
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                asChild
                                className="min-w-[2.5rem]"
                              >
                                <Link
                                  href={`/admin/employees?${new URLSearchParams({
                                    ...(search && { search }),
                                    page: String(page),
                                  }).toString()}`}
                                >
                                  {page}
                                </Link>
                              </Button>
                            </div>
                          ))}
                      </div>
                      {/* Mobile: Show current page number */}
                      <div className="sm:hidden text-sm text-gray-600 px-2">
                        Page {currentPage} of {totalPages}
                      </div>
                      {currentPage === totalPages ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link
                            href={`/admin/employees?${new URLSearchParams({
                              ...(search && { search }),
                              page: String(currentPage + 1),
                            }).toString()}`}
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
