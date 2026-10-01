import test from "node:test";
import assert from "node:assert/strict";
import { leaveSummary, parseWorkingDays, defaultWorkingDays, hasOverlap, isDateKey } from "../src/lib/time-off.ts";

test("standard workweek excludes weekends, includes both endpoints", () => {
  assert.deepEqual(leaveSummary("2026-06-12", "2026-06-15", defaultWorkingDays, []), { error: null, totalDays: 4, workingDays: 2, excludedDays: 2 });
});
test("a same-day request counts as one working day", () => {
  assert.equal(leaveSummary("2026-06-15", "2026-06-15", defaultWorkingDays, []).workingDays, 1);
});
test("company schedule can include Saturday and exclude Monday", () => {
  assert.equal(leaveSummary("2026-06-13", "2026-06-15", ["saturday"], []).workingDays, 1);
  assert.equal(leaveSummary("2026-06-15", "2026-06-15", ["saturday"], []).workingDays, 0);
});
test("recurring holiday is excluded in following years", () => {
  const holiday = { date: new Date("2025-01-01T00:00:00Z"), isRecurring: true };
  assert.equal(leaveSummary("2026-01-01", "2026-01-02", defaultWorkingDays, [holiday]).workingDays, 1);
});
test("one-off holiday is not excluded in following years", () => {
  assert.equal(leaveSummary("2026-01-01", "2026-01-02", defaultWorkingDays, [{ date: "2025-01-01", isRecurring: false }]).workingDays, 2);
});
test("holidays on weekends are not deducted twice", () => {
  assert.deepEqual(leaveSummary("2026-06-12", "2026-06-15", defaultWorkingDays, [{ date: "2026-06-13", isRecurring: false }]), { error: null, totalDays: 4, workingDays: 2, excludedDays: 2 });
});
test("cross-year requests count recurring dates in each year", () => {
  assert.equal(leaveSummary("2025-12-31", "2026-01-02", defaultWorkingDays, [{ date: "2024-01-01", isRecurring: true }]).workingDays, 2);
});
test("daylight saving transition does not affect calendar day count", () => {
  assert.equal(leaveSummary("2026-03-27", "2026-03-30", defaultWorkingDays, []).totalDays, 4);
  assert.equal(leaveSummary("2026-03-27", "2026-03-30", defaultWorkingDays, []).workingDays, 2);
});
test("invalid, reversed and excessive ranges are rejected", () => {
  assert.ok(leaveSummary("2026-02-30", "2026-03-02", defaultWorkingDays, []).error);
  assert.ok(leaveSummary("2026-06-20", "2026-06-15", defaultWorkingDays, []).error);
  assert.ok(leaveSummary("2026-01-01", "2028-01-01", defaultWorkingDays, []).error);
  assert.equal(isDateKey("2028-02-29"), true);
  assert.equal(isDateKey("2026-02-29"), false);
});
test("legacy companies get a default schedule; explicit empty schedules remain empty", () => {
  assert.deepEqual(parseWorkingDays(null), defaultWorkingDays);
  assert.deepEqual(parseWorkingDays("invalid"), defaultWorkingDays);
  assert.deepEqual(parseWorkingDays('["bad-day"]'), defaultWorkingDays);
  assert.deepEqual(parseWorkingDays("[]"), []);
  assert.deepEqual(parseWorkingDays('["monday","monday","saturday"]'), ["monday", "saturday"]);
});
test("pending and approved requests overlap inclusively; rejected requests do not", () => {
  const request = { startDate: "2026-06-15", endDate: "2026-06-19", status: "PENDING" };
  assert.equal(hasOverlap("2026-06-19", "2026-06-22", [request]), true);
  assert.equal(hasOverlap("2026-06-01", "2026-06-30", [request]), true);
  assert.equal(hasOverlap("2026-06-20", "2026-06-22", [request]), false);
  assert.equal(hasOverlap("2026-06-15", "2026-06-16", [{ ...request, status: "REJECTED" }]), false);
  assert.equal(hasOverlap("2026-06-15", "2026-06-16", [{ ...request, status: "APPROVED" }]), true);
});
