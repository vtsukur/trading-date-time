import { DateTime } from 'luxon';
import { DayRules } from '../../../internal/rules/dayRules';
import type { CalendarData } from './data/calendarData';
import { US_EQUITIES_CLOSED_DAYS } from './data/closedDays';
import { US_EQUITIES_EARLY_CLOSE_DAYS } from './data/earlyCloseDays';

/**
 * @fileoverview US Equities Trading Calendar (2000-2025)
 *
 * This module provides functions to determine US equities market trading days, closed days,
 * and early close days for the years 2000-2025. It includes all federal holidays, religious
 * holidays (Good Friday), emergency closures (9/11, Hurricane Sandy), and presidential
 * funeral days.
 *
 * **Trading Hours:**
 * - Regular Trading Hours (RTH): 9:30 AM - 4:00 PM ET (6:30 hours)
 * - Extended Trading Hours (ETH): 4:00 AM - 8:00 PM ET (16 hours total)
 * - Early Close Days: RTH ends at 1:00 PM ET, ETH ends at 5:00 PM ET
 *
 * **Important Notes:**
 * - All functions expect DateTime objects to be in America/New_York timezone
 * - Invalid DateTime objects are handled gracefully (functions return false)
 * - Data is optimized for performance using nested objects with Sets for O(1) lookup operations
 * - Limited to years 2000-2025 - see LIMITATIONS.md for expansion options
 *
 * @example
 * ```typescript
 * import { DateTime } from 'luxon';
 * import {
 *   isUSEquitiesClosedDay,
 *   isUSEquitiesEarlyCloseDay,
 *   isUSEquitiesTradingDay,
 *   isWeekend
 * } from './markets/usEquities/tradingDayCalendar';
 *
 * // Calling code ensures DateTime is in NY timezone
 * const nyTime = DateTime.fromISO('2024-12-25T10:00:00-05:00');
 *
 * if (isUSEquitiesClosedDay(nyTime)) {
 *   console.log('Market is closed today');
 * } else if (isUSEquitiesEarlyCloseDay(nyTime)) {
 *   console.log('Market closes early at 1:00 PM ET today');
 * } else if (isUSEquitiesTradingDay(nyTime)) {
 *   console.log('Regular trading day - closes at 4:00 PM ET');
 * } else if (isWeekend(nyTime)) {
 *   console.log('Weekend - market closed');
 * } else {
 *   console.log('Invalid date');
 * }
 * ```
 */

/**
 * Checks if a given date falls on a weekend (Saturday or Sunday)
 *
 * @param date - Luxon DateTime object expected to be in America/New_York timezone.
 *               Calling code should ensure proper timezone before calling this function.
 * @returns true if the date is Saturday or Sunday, false otherwise or if date is invalid
 *
 * @throws Does not throw - returns false for invalid dates
 *
 * @example
 * ```typescript
 * const saturday = DateTime.fromISO('2024-03-16');
 * console.log(isWeekend(saturday)); // true
 *
 * const monday = DateTime.fromISO('2024-03-18');
 * console.log(isWeekend(monday)); // false
 * ```
 */
export function isWeekend(date: DateTime): boolean {
    if (!date.isValid) return false;

    const dayOfWeek = date.weekday; // 1 = Monday, 7 = Sunday
    return dayOfWeek === 6 || dayOfWeek === 7;
}

/**
 * Internal helper to check if a date exists in calendar data
 *
 * Performs O(1) lookup using nested object structure: year → month → day.
 * Returns false for invalid dates or dates outside the data range.
 *
 * @param date - Luxon DateTime object to check
 * @param calendarData - Calendar data structure to search in
 * @returns true if the date exists in the calendar, false otherwise or if date is invalid
 */
function isDateInCalendar(date: DateTime, calendarData: CalendarData): boolean {
    if (!date.isValid) return false;
    return calendarData[date.year]?.[date.month]?.has(date.day) ?? false;
}

/**
 * Checks if a given date is a US equities market closed day
 *
 * Includes federal holidays, Good Friday, emergency closures (9/11, Hurricane Sandy),
 * and presidential funerals for years 2000-2025.
 *
 * @param date - Luxon DateTime object expected to be in America/New_York timezone.
 *               Calling code should ensure proper timezone before calling this function.
 * @returns true if the US equities market is closed on this date, false if open or date is invalid
 *
 * @throws Does not throw - returns false for invalid dates
 *
 * @example
 * ```typescript
 * const christmas = DateTime.fromISO('2024-12-25');
 * console.log(isUSEquitiesClosedDay(christmas)); // true
 *
 * const regularDay = DateTime.fromISO('2024-03-15');
 * console.log(isUSEquitiesClosedDay(regularDay)); // false
 * ```
 */
export function isUSEquitiesClosedDay(date: DateTime): boolean {
    return isDateInCalendar(date, US_EQUITIES_CLOSED_DAYS);
}

/**
 * Checks if a given date is a US equities market early close day
 *
 * Returns true for days when the market closes at 1:00 PM ET instead of the normal 4:00 PM ET.
 * This includes Black Friday, Christmas Eve (when applicable), and days before Independence Day
 * when July 4th falls on certain weekdays.
 *
 * Regular trading hours end at 1:00 PM ET, extended hours end at 5:00 PM ET.
 *
 * @param date - Luxon DateTime object expected to be in America/New_York timezone.
 *               Calling code should ensure proper timezone before calling this function.
 * @returns true if the US equities market closes early on this date, false otherwise or if date is invalid
 *
 * @throws Does not throw - returns false for invalid dates
 *
 * @example
 * ```typescript
 * const blackFriday = DateTime.fromISO('2024-11-29');
 * console.log(isUSEquitiesEarlyCloseDay(blackFriday)); // true
 *
 * const regularDay = DateTime.fromISO('2024-03-15');
 * console.log(isUSEquitiesEarlyCloseDay(regularDay)); // false
 * ```
 */
export function isUSEquitiesEarlyCloseDay(date: DateTime): boolean {
    return isDateInCalendar(date, US_EQUITIES_EARLY_CLOSE_DAYS);
}

/**
 * Checks if a given date is a US equities trading day
 *
 * Returns true for weekdays that are not market holidays. A trading day is any weekday
 * (Monday-Friday) that is not a closed day. Early close days are still considered trading days.
 *
 * Weekend days and market holidays are not trading days.
 *
 * @param date - Luxon DateTime object expected to be in America/New_York timezone.
 *               Calling code should ensure proper timezone before calling this function.
 * @returns true if this is a valid US equities trading day, false if weekend/holiday or date is invalid
 *
 * @throws Does not throw - returns false for invalid dates
 *
 * @example
 * ```typescript
 * const monday = DateTime.fromISO('2024-03-18');
 * console.log(isUSEquitiesTradingDay(monday)); // true
 *
 * const christmas = DateTime.fromISO('2024-12-25');
 * console.log(isUSEquitiesTradingDay(christmas)); // false
 *
 * const blackFriday = DateTime.fromISO('2024-11-29');
 * console.log(isUSEquitiesTradingDay(blackFriday)); // true (early close, but still trading)
 * ```
 */
export function isUSEquitiesTradingDay(date: DateTime): boolean {
    // Fast path: weekend check first (cheaper than Set lookup)
    if (isWeekend(date)) return false;

    // Expensive path: holiday lookup
    return !isUSEquitiesClosedDay(date);
}

/**
 * US Equities market day rules implementation
 *
 * Implements trading day logic specific to the US stock market:
 * - US market holidays and weekend handling
 * - Early close days (like day before major holidays)
 * - NYSE/NASDAQ trading calendar rules
 */
export class USEquitiesTradingDayCalendar implements DayRules {
    /**
     * Determines if the given date is a trading day for US equities
     *
     * @param date The date to check
     * @returns True if it's a trading day (not weekend or holiday)
     */
    isTradingDay(date: DateTime): boolean {
        return isUSEquitiesTradingDay(date);
    }

    /**
     * Determines if the given date is an early close trading day
     *
     * @param date The date to check
     * @returns True if it's an early close day (e.g., day before major holidays)
     */
    isEarlyCloseDay(date: DateTime): boolean {
        return isUSEquitiesEarlyCloseDay(date);
    }
}