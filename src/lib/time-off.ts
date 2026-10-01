// Calendar dates are normalized to UTC midnight, independent of browser/server timezone.
export const weekdays = [
  { id: "monday", label: "Ponedeljak", short: "Pon" },
  { id: "tuesday", label: "Utorak", short: "Uto" },
  { id: "wednesday", label: "Sreda", short: "Sre" },
  { id: "thursday", label: "Četvrtak", short: "Čet" },
  { id: "friday", label: "Petak", short: "Pet" },
  { id: "saturday", label: "Subota", short: "Sub" },
  { id: "sunday", label: "Nedelja", short: "Ned" },
] as const;
export const defaultWorkingDays = weekdays.slice(0, 5).map(day => day.id) as string[];
export function parseWorkingDays(value: string | null | undefined): string[] {
  if (!value) return [...defaultWorkingDays];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every(day => typeof day === "string" && weekdays.some(item => item.id === day))) return [...new Set(parsed)] as string[];
  } catch { /* Older companies without a valid schedule use the standard workweek. */ }
  return [...defaultWorkingDays];
}
export function dateKey(date: Date | string) {
  return (date instanceof Date ? date : new Date(date)).toISOString().slice(0, 10);
}
export function isDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00.000Z");
  return Number.isFinite(date.getTime()) && dateKey(date) === value;
}
export function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
export type Holiday = { date: Date | string; isRecurring: boolean; name?: string };
export function leaveSummary(start: string, end: string, workingDays: string[], holidays: Holiday[]) {
  if (!isDateKey(start) || !isDateKey(end)) return { error: "Izaberite ispravan datum početka i završetka.", totalDays: 0, workingDays: 0, excludedDays: 0 };
  const startTime = new Date(start + "T00:00:00.000Z").getTime();
  const endTime = new Date(end + "T00:00:00.000Z").getTime();
  const totalDays = Math.round((endTime - startTime) / 86400000) + 1;
  if (totalDays < 1) return { error: "Završetak ne može biti pre početka odsustva.", totalDays: 0, workingDays: 0, excludedDays: 0 };
  if (totalDays > 366) return { error: "Jedan zahtev može obuhvatiti najviše 366 kalendarskih dana.", totalDays, workingDays: 0, excludedDays: 0 };
  const weekdayIds = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const holidayKeys = holidays.map(holiday => ({ key: dateKey(holiday.date), recurring: holiday.isRecurring }));
  let count = 0;
  for (let time = startTime; time <= endTime; time += 86400000) {
    const date = new Date(time);
    const key = dateKey(date);
    if (workingDays.includes(weekdayIds[date.getUTCDay()]) && !holidayKeys.some(holiday => holiday.recurring ? holiday.key.slice(5) === key.slice(5) : holiday.key === key)) count++;
  }
  return { error: null, totalDays, workingDays: count, excludedDays: totalDays - count };
}
export function hasOverlap(start: string, end: string, requests: { startDate: Date | string; endDate: Date | string; status: string }[]) {
  return requests.some(request => request.status !== "REJECTED" && start <= dateKey(request.endDate) && end >= dateKey(request.startDate));
}
