/**
 * Type definitions for US Equities trading calendar data structures
 *
 * This module defines immutable types for calendar data consumption.
 * For mutable types used during data construction, see ./mutableCalendarData.ts
 *
 * @fileoverview Calendar data type definitions for US equities trading calendar
 */

/**
 * Immutable calendar data type used for consumption after construction
 *
 * Structure: Record<year, Record<month, ReadonlySet<day>>>
 * - year: 4-digit year (e.g., 2024)
 * - month: 1-12 (January = 1, December = 12)
 * - day: 1-31 (day of month)
 *
 * This readonly version prevents accidental modifications and provides O(1) lookup performance.
 *
 * @example
 * ```typescript
 * const data: CalendarData = {
 *   2024: {
 *     12: new Set([25]), // Christmas Day
 *     1: new Set([1, 17]) // New Year's Day, MLK Day
 *   }
 * };
 *
 * // O(1) lookup
 * const isChristmas = data[2024]?.[12]?.has(25) ?? false;
 * ```
 *
 * @see {@link MutableCalendarData} for the mutable version used during construction
 */
export type CalendarData = Readonly<Record<number, Readonly<Record<number, ReadonlySet<number>>>>>;
