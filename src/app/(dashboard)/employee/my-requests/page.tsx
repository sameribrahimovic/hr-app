import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, XCircle, User, Plus } from "lucide-react";

const MyRequestsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  const requests = await prisma.timeOffRequest.findMany({
    where: {
      employeeId: dbUser.id,
    },
    include: {
      manager: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div className="flex flex-col space-y-1 sm:space-y-2 min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">My Time Off Requests</h1>
          <p className="text-sm sm:text-base text-gray-500 break-words">
            View and manage your time off requests
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto shrink-0">
          <Link href={"/employee/new-request"}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-full overflow-hidden">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 w-full max-w-full">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 w-full">
              <p className="text-sm sm:text-base text-gray-500 text-center px-4 mb-4 break-words">
                You don&apos;t have any time off requests yet.
              </p>
              <Button className="mt-2" asChild>
                <Link href={"/employee/new-request"}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first request
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3 w-full">
                {requests?.map((request) => (
                  <Card key={request.id} className="p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-full overflow-hidden">
                    <div className="flex items-start justify-between mb-3 w-full">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600 mb-2 w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
                            <span className="leading-relaxed font-medium break-words">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3 w-full">
                      <Badge variant="outline" className="capitalize text-xs font-medium shrink-0">
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
                        className="text-xs font-medium shrink-0"
                      >
                        {request.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                        {request.status === "APPROVED" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {request.status === "REJECTED" && <XCircle className="w-3 h-3 mr-1" />}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600 w-full">
                      {request.manager && (
                        <div className="flex items-center gap-2 min-w-0 w-full">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />
                          <span className="break-words min-w-0">
                            Manager: {request.manager.firstName} {request.manager.lastName}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 min-w-0 w-full">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />
                        <span className="break-words">Created: {formatDate(request.createdAt)}</span>
                      </div>
                      {request.notes && (
                        <div className="pt-2 mt-2 border-t w-full">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Notes:</p>
                          <p className="text-sm text-gray-700 leading-relaxed break-words">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dates</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((request) => (
                        <TableRow key={request.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
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
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request?.manager
                          ? `${request?.manager?.firstName} ${request?.manager?.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request?.notes || <span className="text-muted-foreground">No notes</span>}
                          </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRequestsPage;
