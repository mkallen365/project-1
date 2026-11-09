/**
 * Parses a date string in `YYYY-MM-DD` format into a Date at UTC midnight.
 * Returns `null` if the string is malformed or not a real calendar date
 * (e.g. `2023-02-30`).
 */
export function parseDate(input: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Use setUTCFullYear rather than Date.UTC: Date.UTC maps years 0-99 to 1900-1999.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  // Out-of-range parts roll invalid dates over (Feb 30 -> Mar 2), so check it round-trips.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}
