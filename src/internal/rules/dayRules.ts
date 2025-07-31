import { DateTime } from 'luxon';

/**
 * Market day rules interface that defines trading day logic
 *
 * This interface encapsulates the business rules for determining:
 * - Which days are trading days (excluding weekends and holidays)
 * - Which trading days have early close schedules
 *
 * By separating these rules from the calendar implementation, we achieve:
 * - Better composition and modularity
 * - Easier testing of trading day logic
 * - Reusable rules across different market implementations
 * - Clear separation of concerns between calendar operations and day classification
 */
export interface DayRules {
    /**
     * Determines if the given date is a trading day for this market
     *
     * @param date The date to check
     * @returns True if it's a trading day (not weekend or holiday)
     */
    isTradingDay(date: DateTime): boolean;

    /**
     * Determines if the given date is an early close trading day
     *
     * @param date The date to check
     * @returns True if it's an early close day (e.g., day before major holidays)
     */
    isEarlyCloseDay(date: DateTime): boolean;
}