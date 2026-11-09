import { describe, expect, it } from "vitest";
import { parseDate } from "./util";

describe("parseDate", () => {
  it("parses a valid YYYY-MM-DD string to UTC midnight", () => {
    const date = parseDate("2024-03-15");
    expect(date).not.toBeNull();
    expect(date!.toISOString()).toBe("2024-03-15T00:00:00.000Z");
  });

  it("ignores surrounding whitespace", () => {
    expect(parseDate("  2024-03-15 \n")?.toISOString()).toBe(
      "2024-03-15T00:00:00.000Z",
    );
  });

  it("accepts Feb 29 in a leap year", () => {
    expect(parseDate("2024-02-29")?.toISOString()).toBe(
      "2024-02-29T00:00:00.000Z",
    );
  });

  it("handles years 0000-0099 without mapping them to 1900-1999", () => {
    expect(parseDate("0050-01-01")?.toISOString()).toBe(
      "0050-01-01T00:00:00.000Z",
    );
    expect(parseDate("0000-01-01")?.getUTCFullYear()).toBe(0);
  });

  it.each([
    ["2023-02-29", "Feb 29 in a non-leap year"],
    ["2024-02-30", "Feb 30"],
    ["2024-04-31", "April 31"],
    ["2024-13-01", "month 13"],
    ["2024-00-10", "month 0"],
    ["2024-01-00", "day 0"],
  ])("returns null for impossible date %s (%s)", (input) => {
    expect(parseDate(input)).toBeNull();
  });

  it.each([
    "",
    "not a date",
    "2024/03/15",
    "15-03-2024",
    "2024-3-15",
    "2024-03-15T10:00:00Z",
  ])("returns null for malformed input %j", (input) => {
    expect(parseDate(input)).toBeNull();
  });
});
