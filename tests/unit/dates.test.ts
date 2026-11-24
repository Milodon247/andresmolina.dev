import { describe, expect, it } from 'vitest';
import {
  compareYearMonthDesc,
  currentYearMonth,
  isExpired,
  formatDuration,
  formatYearMonth,
  isYearMonth,
  monthsBetween,
} from '@/lib/dates';

describe('isYearMonth', () => {
  it.each(['2024-01', '1999-12', '2026-11'])('accepts %s', (value) => {
    expect(isYearMonth(value)).toBe(true);
  });

  it.each(['2024-13', '2024-00', '2024-1', '24-01', '2024-01-15', ''])('rejects %j', (value) => {
    expect(isYearMonth(value)).toBe(false);
  });
});

describe('formatYearMonth', () => {
  it('formats in English and Spanish', () => {
    expect(formatYearMonth('2021-03', 'en')).toBe('Mar 2021');
    expect(formatYearMonth('2021-03', 'es')).toMatch(/^mar\.? 2021$/);
  });

  it('is not shifted by the local time zone', () => {
    expect(formatYearMonth('2021-01', 'en')).toBe('Jan 2021');
  });

  it('throws on invalid input', () => {
    expect(() => formatYearMonth('2021-3', 'en')).toThrow(/Invalid YYYY-MM/);
  });
});

describe('currentYearMonth', () => {
  it('uses UTC and pads the month', () => {
    expect(currentYearMonth(new Date(Date.UTC(2026, 0, 31, 23, 59)))).toBe('2026-01');
  });
});

describe('monthsBetween', () => {
  it('counts both ends', () => {
    expect(monthsBetween('2020-01', '2020-12')).toBe(12);
    expect(monthsBetween('2020-05', '2020-05')).toBe(1);
    expect(monthsBetween('2019-11', '2021-02')).toBe(16);
  });

  it('throws when end is before start', () => {
    expect(() => monthsBetween('2021-02', '2021-01')).toThrow(/before start/);
  });
});

describe('formatDuration', () => {
  it('formats years and months per locale', () => {
    expect(formatDuration(46, 'en')).toBe('3 years 10 months');
    expect(formatDuration(46, 'es')).toBe('3 años 10 meses');
    expect(formatDuration(12, 'en')).toBe('1 year');
    expect(formatDuration(1, 'es')).toBe('1 mes');
  });
});

describe('compareYearMonthDesc', () => {
  it('sorts newest first', () => {
    expect(['2020-01', '2024-06', '2022-12'].sort(compareYearMonthDesc)).toEqual([
      '2024-06',
      '2022-12',
      '2020-01',
    ]);
  });
});

describe('isExpired', () => {
  const now = new Date('2026-11-24T12:00:00Z');

  it('treats past months as expired and the current or later months as valid', () => {
    expect(isExpired('2026-06', now)).toBe(true);
    expect(isExpired('2026-11', now)).toBe(false);
    expect(isExpired('2029-04', now)).toBe(false);
  });
});
