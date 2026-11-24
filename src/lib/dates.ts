/** `YYYY-MM`, the month precision used across CV content. */
export const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isYearMonth(value: string): boolean {
  return YEAR_MONTH.test(value);
}

function parseYearMonth(value: string): { year: number; month: number } {
  if (!isYearMonth(value)) throw new Error(`Invalid YYYY-MM date: "${value}"`);
  const [year, month] = value.split('-').map(Number) as [number, number];
  return { year, month };
}

/** Formats `2021-03` as "Mar 2021" (en) or "mar 2021" (es). */
export function formatYearMonth(value: string, locale: string): string {
  const { year, month } = parseYearMonth(value);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

/** Current month as `YYYY-MM` (UTC). */
export function currentYearMonth(now: Date = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** True when a credential's `YYYY-MM` expiry month is already over in `now`'s month. */
export function isExpired(expires: string, now: Date = new Date()): boolean {
  return expires < currentYearMonth(now);
}

/** Inclusive number of months between two `YYYY-MM` dates: `2020-01`..`2020-12` is 12. */
export function monthsBetween(start: string, end: string): number {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  const months = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  if (months < 1) throw new Error(`End date ${end} is before start date ${start}`);
  return months;
}

/** Formats a month count as "2 yrs 3 mos" / "2 años 3 meses". */
export function formatDuration(totalMonths: number, locale: string): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const unit = (value: number, kind: 'year' | 'month') =>
    new Intl.NumberFormat(locale, { style: 'unit', unit: kind, unitDisplay: 'long' }).format(value);
  const parts: string[] = [];
  if (years > 0) parts.push(unit(years, 'year'));
  if (months > 0) parts.push(unit(months, 'month'));
  return parts.join(' ');
}

/** Sorts `YYYY-MM` strings newest first; works because the format sorts lexicographically. */
export function compareYearMonthDesc(a: string, b: string): number {
  return b.localeCompare(a);
}
