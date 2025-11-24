import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TimeOffType, RequestStatus } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Table,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EmployeeSearch } from "@/components/EmployeeSearch";
import { ChevronLeft, ChevronRight, User, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const TimeOffRequestPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { companyId } = sessionClaims.metadata;

  const search = resolvedSearchParams?.search || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build where clause for search
  // For enum fields (type, status), we need to check if search matches enum values
  const searchUpper = search.toUpperCase();
  const matchingTypes = (["VACATION", "SICK", "PERSONAL", "OTHER"] as TimeOffType[]).filter(
    (type) => type.includes(searchUpper)
  );
  const matchingStatuses = (["PENDING", "APPROVED", "REJECTED"] as RequestStatus[]).filter(
    (status) => status.includes(searchUpper)
  );

  const whereClause = {
    employee: {
      companyId: companyId,
    },
    ...(search && {
      OR: [
        ...(matchingTypes.length > 0
          ? [{ type: { in: matchingTypes } }]
          : []),
        ...(matchingStatuses.length > 0
          ? [{ status: { in: matchingStatuses } }]
          : []),
        {
          employee: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ],
          },
        },
      ],
    }),
  };

  // Get total count for pagination
  const totalCount = await prisma.timeOffRequest.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get paginated requests
  const requests = await prisma.timeOffRequest.findMany({
    where: whereClause,
    include: {
      employee: true,
      manager: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: ITEMS_PER_PAGE,
  });

  const startNumber = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Time Off Requests</h1>
            <p className="text-sm sm:text-base text-gray-500">View and manage all time off requests</p>
          </div>
          <Suspense fallback={
            <div className="relative w-full">
              <div className="h-10 sm:h-9 w-full rounded-md border bg-transparent px-10" />
            </div>
          }>
            <div className="w-full">
              <EmployeeSearch basePath="/admin/time-off-requests" />
            </div>
          </Suspense>
        </div>
        <Card>
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            {!requests || requests?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <p className="text-sm sm:text-base text-gray-500 text-center px-4">
                  {search ? "No requests found matching your search." : "No time off requests found."}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {requests?.map((request, index) => (
                    <Card key={request.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-400 shrink-0">
                              #{startNumber + index}
                            </span>
                            <h3 className="font-semibold text-base sm:text-lg truncate">
                              {request.employee.firstName} {request.employee.lastName}
                            </h3>
                          </div>
                          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className="capitalize text-xs">
                          {request.type}
                        </Badge>
                        <Badge
                          variant={
                            request.status === "PENDING"
                              ? "secondary"
                              : request.status === "APPROVED"
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {request.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                          {request.status === "APPROVED" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {request.status === "REJECTED" && <XCircle className="w-3 h-3 mr-1" />}
                          {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-3">
                        {request.manager && (
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">Approved by: {request.manager.firstName} {request.manager.lastName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span>Created: {formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <Button variant="outline" size="sm" className="w-full h-9" asChild>
                          <Link href={`/admin/time-off-requests/${request.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-6 lg:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">#</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Approved By</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests?.map((request, index) => (
                          <TableRow key={request.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {startNumber + index}
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.employee.firstName} {request.employee.lastName}
                            </TableCell>
                            <TableCell>
                              {formatDate(request.startDate) +
                                " - " +
                                formatDate(request.endDate)}
                            </TableCell>
                            <TableCell className="capitalize">{request.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  request.status === "PENDING"
                                    ? "secondary"
                                    : request.status === "APPROVED"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {request.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                                {request.status === "APPROVED" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {request.status === "REJECTED" && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status.charAt(0) +
                                  request.status.slice(1).toLowerCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {request.manager
                                ? `${request.manager.firstName} ${request.manager.lastName}`
                                : "-"}
                            </TableCell>
                            <TableCell>{formatDate(request.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" size="sm" className="h-8" asChild>
                                <Link href={`/admin/time-off-requests/${request.id}`}>
                                  View
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t">
                    <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
                      Showing <span className="font-medium">{startNumber}</span> to <span className="font-medium">{Math.min(startNumber + requests.length - 1, totalCount)}</span> of <span className="font-medium">{totalCount}</span> requests
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center order-1 sm:order-2 w-full sm:w-auto">
                      {currentPage === 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="h-9 min-w-[90px]"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          <span className="hidden xs:inline">Previous</span>
                          <span className="xs:hidden">Prev</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-9 min-w-[90px]"
                        >
                          <Link
                            href={`/admin/time-off-requests?${new URLSearchParams({
                              ...(search && { search }),
                              page: String(currentPage - 1),
                            }).toString()}`}
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            <span className="hidden xs:inline">Previous</span>
                            <span className="xs:hidden">Prev</span>
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
                                className="min-w-[2.5rem] h-9"
                              >
                                <Link
                                  href={`/admin/time-off-requests?${new URLSearchParams({
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
                      <div className="sm:hidden text-xs sm:text-sm text-gray-600 px-2 font-medium">
                        Page {currentPage} of {totalPages}
                      </div>
                      {currentPage === totalPages ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="h-9 min-w-[90px]"
                        >
                          <span className="hidden xs:inline">Next</span>
                          <span className="xs:hidden">Next</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-9 min-w-[90px]"
                        >
                          <Link
                            href={`/admin/time-off-requests?${new URLSearchParams({
                              ...(search && { search }),
                              page: String(currentPage + 1),
                            }).toString()}`}
                          >
                            <span className="hidden xs:inline">Next</span>
                            <span className="xs:hidden">Next</span>
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

export default TimeOffRequestPage;
