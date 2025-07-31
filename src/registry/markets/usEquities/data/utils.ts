import { DateTime } from 'luxon';
import type { CalendarData } from './calendarData';

/**
 * Utility functions for US Equities trading calendar data construction and validation
 *
 * This module provides:
 * - Factory functions for creating immutable Sets from day numbers
 * - Runtime validation for calendar data integrity
 * - Type-safe utilities for data module construction
 *
 * These utilities are used by calendar data modules (closedDays.ts, earlyCloseDays.ts)
 * to ensure consistent data structure creation and validate data integrity at module load time.
 *
 * @fileoverview Calendar data utilities for US equities trading calendar
 */

/**
 * Factory function for single-day entries - creates ReadonlySet internally
 *
 * Creates an immutable Set containing a single day number for use in calendar data.
 * Used when defining single-date holidays or events in calendar data modules.
 *
 * @param dayNum - Day of the month (1-31). No validation is performed - caller
 *                 must ensure valid day numbers for the target month/year context.
 * @returns ReadonlySet containing the single day number
 *
 * @example Basic usage in calendar data
 * ```typescript
 * const christmas = day(25); // ReadonlySet containing [25]
 * const newYear = day(1);    // ReadonlySet containing [1]
 *
 * // Used in calendar data structure
 * const holidays = {
 *   2024: {
 *     12: day(25),  // Christmas
 *     1: day(1)     // New Year's Day
 *   }
 * };
 * ```
 *
 * @see {@link days} For multi-day entries
 */
export function day(dayNum: number): ReadonlySet<number> {
    return new Set([dayNum]);
}

/**
 * Factory function for multi-day entries - creates ReadonlySet from array
 *
 * Creates an immutable Set from an array of day numbers. Automatically deduplicates
 * entries if duplicates are provided. Used when defining multi-date events or
 * months with multiple holidays in calendar data modules.
 *
 * @param dayNums - Array of days of the month (1-31). Can be empty (returns empty Set).
 *                  No validation is performed - caller must ensure valid day numbers
 *                  for the target month/year context. Duplicates are automatically removed.
 * @returns ReadonlySet containing all unique day numbers
 *
 * @example Multiple dates in calendar data
 * ```typescript
 * const multiDayHoliday = days([24, 25, 26]); // ReadonlySet containing [24, 25, 26]
 * const duplicatesHandled = days([1, 1, 2]);  // ReadonlySet containing [1, 2]
 * const emptyMonth = days([]);                // ReadonlySet containing []
 *
 * // Used in calendar data structure
 * const holidays = {
 *   2001: {
 *     1: days([1, 15]),  // New Year's Day + MLK Day
 *     9: days([11, 12, 13, 14])  // 9/11 closure period
 *   }
 * };
 * ```
 *
 * @see {@link day} For single-day entries
 */
export function days(dayNums: number[]): ReadonlySet<number> {
    return new Set(dayNums);
}

/**
 * Validates all dates in calendar data by constructing DateTime instances
 *
 * Iterates through all year/month/day combinations in the calendar data
 * and validates each date by constructing a DateTime instance and checking
 * if it represents a valid calendar date.
 *
 * @param calendarData - The calendar data to validate
 * @param dataName - Name of the data being validated (for error messages)
 * @throws Error if any invalid dates are found
 *
 * @example
 * ```typescript
 * validate(US_EQUITIES_CLOSED_DAYS, 'US_EQUITIES_CLOSED_DAYS');
 * ```
 */
export function validate(calendarData: CalendarData, dataName: string): void {
    const invalidDates: string[] = [];

    for (const [yearStr, yearData] of Object.entries(calendarData)) {
        const year = parseInt(yearStr, 10);

        for (const [monthStr, daySet] of Object.entries(yearData)) {
            const month = parseInt(monthStr, 10);

            for (const day of daySet) {
                // Construct DateTime and check if it's valid
                const dateTime = DateTime.fromObject({ year, month, day });

                if (!dateTime.isValid) {
                    invalidDates.push(
                        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} (${dateTime.invalidReason})`
                    );
                }

                // Additional validation: ensure the constructed date matches input
                if (dateTime.isValid && (dateTime.year !== year || dateTime.month !== month || dateTime.day !== day)) {
                    invalidDates.push(
                        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} (date normalization mismatch: became ${dateTime.year}-${dateTime.month}-${dateTime.day})`
                    );
                }
            }
        }
    }

    if (invalidDates.length > 0) {
        throw new Error(`Invalid dates found in ${dataName}:\n${invalidDates.join('\n')}`);
    }
}
