import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
export function formatTime(date: Date) {
  return date.toLocaleTimeString("sr-Latn-RS", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade" });
}
export function calculateDays(startDate: Date, endDate: Date) {
  const start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
  return Math.max(0, Math.round((end - start) / 86400000) + 1);
}
