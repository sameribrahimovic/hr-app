export const leaveTypes = {
  VACATION: "Godišnji odmor",
  SICK: "Bolovanje",
  PERSONAL: "Lično odsustvo",
  OTHER: "Drugo",
} as const;
export const requestStatuses = {
  PENDING: "Na čekanju",
  APPROVED: "Odobreno",
  REJECTED: "Odbijeno",
} as const;
export const roleLabels = {
  ADMIN: "Administrator",
  EMPLOYEE: "Zaposleni",
  MANAGER: "Menadžer",
} as const;
export function daysLabel(count: number) {
  return count % 10 === 1 && count % 100 !== 11 ? "dan" : "dana";
}
