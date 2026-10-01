import type { Prisma, RequestStatus, TimeOffType } from "@prisma/client";
import { isDateKey } from "./time-off";
import { leaveTypes, requestStatuses } from "./labels";
export type FilterParams = {
  search?: string;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  page?: string;
};
export function normalizeFilters(input: FilterParams): FilterParams {
  const result: FilterParams = {};
  for (const key of [
    "search",
    "status",
    "type",
    "from",
    "to",
    "page",
  ] as const) {
    const value = input[key];
    if (typeof value === "string") result[key] = value.slice(0, 200);
  }
  if (result.status && !Object.hasOwn(requestStatuses, result.status))
    delete result.status;
  if (result.type && !Object.hasOwn(leaveTypes, result.type))
    delete result.type;
  if (result.from && !isDateKey(result.from)) delete result.from;
  if (result.to && !isDateKey(result.to)) delete result.to;
  return result;
}
export function requestFilter(
  params: FilterParams,
): Prisma.TimeOffRequestWhereInput {
  return {
    ...(params.status && Object.hasOwn(requestStatuses, params.status)
      ? { status: params.status as RequestStatus }
      : {}),
    ...(params.type && Object.hasOwn(leaveTypes, params.type)
      ? { type: params.type as TimeOffType }
      : {}),
    ...(params.from && isDateKey(params.from)
      ? { endDate: { gte: new Date(params.from) } }
      : {}),
    ...(params.to && isDateKey(params.to)
      ? { startDate: { lte: new Date(params.to) } }
      : {}),
  };
}
export function pageNumber(
  value: string | undefined,
  total: number,
  size = 10,
) {
  return Math.max(
    1,
    Math.min(
      Math.ceil(total / size) || 1,
      Number.isSafeInteger(Number(value)) ? Number(value) : 1,
    ),
  );
}
export function queryHref(
  base: string,
  params: FilterParams,
  overrides: FilterParams = {},
) {
  const query = new URLSearchParams();
  Object.entries({ ...params, ...overrides }).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return base + (query.size ? "?" + query.toString() : "");
}
