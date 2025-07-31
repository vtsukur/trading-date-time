import { DateTime, Interval } from 'luxon';
import { type Calendar } from '../internal/calendar';
import type { TradingHoursScope } from '../types/common';
import type { TradingDateTime as ITradingDateTime } from '../types/tradingDateTime';
import { REGULAR_HOURS } from '../constants/public';

/**
 * Immutable wrapper around Luxon's DateTime specifically designed for market and trading applications
 *
 * This class provides a subset of DateTime functionality that is actually used within
 * the trading backtester codebase. It maintains immutability by always returning new
 * instances for operations that would modify state.
 *
 * Key Features:
 * - Immutable operations (all methods return new instances or primitive values)
 * - Market-focused API surface (only includes methods used in the codebase)
 * - Type-safe wrapper around Luxon DateTime
 * - Timezone-specific factories for consistent timezone handling
 * - Trading calendar awareness for market-specific operations
 * - Extensible design for multiple markets and trading instruments
 *
 * @example
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 * const date = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
 *
 * // Trading-specific operations
 * if (date.isOnTradingDay() && date.isWithinTradingHours()) {
 *     const nextTradingDay = date.nextTradingDay();
 * }
 * ```
 */
export class TradingDateTime implements ITradingDateTime {
    public readonly dateTime: DateTime;
    private readonly calendar: Calendar;

    /**
     * Constructor accessible to factory implementations within this module
     * @internal
     */
    constructor(dateTime: DateTime, calendar: Calendar) {
        this.dateTime = dateTime;
        this.calendar = calendar;
    }

    // ==========================================
    // TRADING-SPECIFIC METHODS
    // ==========================================

    /**
     * Checks if this timestamp is on a trading day
     *
     * Note: This method evaluates only the date component (YYYY-MM-DD), not the time.
     * A timestamp at 2:00 AM on a trading day will return true.
     *
     * @returns True if the date portion represents a valid trading day (not weekend or holiday)
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const timestamp = MarketsTime.USEquities.fromISO('2024-01-15T02:00:00');
     * if (timestamp.isOnTradingDay()) {
     *     console.log('This timestamp is on a trading day');
     * }
     * ```
     */
    isOnTradingDay(): boolean {
        return this.calendar.isTradingDay(this.dateTime);
    }

    /**
     * Checks if this time falls within trading hours
     *
     * @param tradingHoursScope Specifies which trading hours to check ('regular' for standard session, 'extended' for full session)
     * @returns True if within the specified trading hours
     *
     * @example
     * ```typescript
     * import { MarketsTime, REGULAR_HOURS, EXTENDED_HOURS } from 'src/core/time';
     * const date = MarketsTime.USEquities.fromISO('2024-01-15T10:30:00');
     * date.isWithinTradingHours();                    // true (within regular hours - default)
     * date.isWithinTradingHours(REGULAR_HOURS);     // true (within regular hours)
     * date.isWithinTradingHours(EXTENDED_HOURS);    // true (within extended hours)
     * ```
     */
    isWithinTradingHours(tradingHoursScope: TradingHoursScope = REGULAR_HOURS): boolean {
        const interval = this.calendar.tradingHoursInterval(this.dateTime, tradingHoursScope);
        return interval ? interval.contains(this.dateTime) : false;
    }

    /**
     * Gets the trading day interval for this date
     *
     * Returns the full trading day interval (start to end time) for the specified
     * trading hours. This provides direct access to the Luxon Interval object
     * for advanced time range operations.
     *
     * @param tradingHoursScope Specifies which trading hours to get ('regular' for standard session, 'extended' for full session)
     * @returns Luxon Interval representing the trading day bounds, or null if not a trading day
     *
     * @example
     * ```typescript
     * import { MarketsTime, REGULAR_HOURS, EXTENDED_HOURS } from 'src/core/time';
     * const date = MarketsTime.USEquities.fromISO('2024-01-15T10:30:00');
     *
     * // Get Regular Trading Hours interval (9:30 AM - 4:00 PM)
     * const regularInterval = date.dayTradingHoursInterval();
     * const regularInterval2 = date.dayTradingHoursInterval(REGULAR_HOURS);
     *
     * // Get Extended Trading Hours interval (4:00 AM - 8:00 PM)
     * const extendedInterval = date.dayTradingHoursInterval(EXTENDED_HOURS);
     *
     * if (regularInterval) {
     *     console.log(`Regular Hours: ${regularInterval.start.toFormat('HH:mm')} - ${regularInterval.end.toFormat('HH:mm')}`);
     *     console.log(`Duration: ${regularInterval.length('minutes')} minutes`);
     *     console.log(`Contains current time: ${regularInterval.contains(date.dateTime)}`);
     * }
     *
     * // Weekend/holiday will return null
     * const weekend = MarketsTime.USEquities.fromISO('2024-01-13T10:30:00'); // Saturday
     * const weekendInterval = weekend.dayTradingHoursInterval(); // null
     * ```
     */
    dayTradingHoursInterval(tradingHoursScope: TradingHoursScope = REGULAR_HOURS): Interval | null {
        return this.calendar.tradingHoursInterval(this.dateTime, tradingHoursScope);
    }

    /**
     * Finds the next trading day after this date
     *
     * @returns New MarketTime representing the next trading day
     * @throws Error if no next trading day found within reasonable range
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const friday = MarketsTime.USEquities.fromISO('2024-01-05T14:30:00'); // Friday
     * const monday = friday.nextTradingDay(); // Following Monday (skips weekend)
     * ```
     */
    nextTradingDay(): TradingDateTime {
        return this.createDerivedMarketTime(this.calendar.nextTradingDay(this.dateTime));
    }

    /**
     * Finds the previous trading day before this date
     *
     * @returns New MarketTime representing the previous trading day
     * @throws Error if no previous trading day found within reasonable range
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const monday = MarketsTime.USEquities.fromISO('2024-01-08T14:30:00'); // Monday
     * const friday = monday.prevTradingDay(); // Previous Friday (skips weekend)
     * ```
     */
    prevTradingDay(): TradingDateTime {
        return this.createDerivedMarketTime(this.calendar.prevTradingDay(this.dateTime));
    }

    /**
     * Helper method for creating derived MarketTime instances from DateTime results
     * @private
     */
    private createDerivedMarketTime(result: DateTime): TradingDateTime {
        return new TradingDateTime(result, this.calendar);
    }

    // ==========================================
    // FORMATTING METHODS
    // ==========================================

    /**
     * Converts to ISO date format (YYYY-MM-DD)
     *
     * @returns ISO date string or null if invalid
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const date = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
     * date.toISODate(); // '2024-01-15'
     * ```
     */
    toISODate(): string | null {
        return this.dateTime.toISODate();
    }

    /**
     * Converts to ISO DateTime format string without timezone
     *
     * @returns DateTime string in 'yyyy-MM-ddTHH:mm:ss' format (e.g., "2024-01-15T14:30:45")
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const date = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
     * date.toISODateTime(); // "2024-01-15T09:30:00"
     * ```
     */
    toISODateTime(): string {
        return this.dateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    }

    /**
     * Converts to ISO extended time format string
     *
     * @returns Extended time string in 'HH:mm:ss' format (e.g., "09:30:45")
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const date = MarketsTime.USEquities.fromISO('2024-01-15T09:30:45');
     * date.toISOExtendedTime(); // "09:30:45"
     * ```
     */
    toISOExtendedTime(): string {
        return this.dateTime.toFormat('HH:mm:ss');
    }

    // ==========================================
    // COMPARISON METHODS
    // ==========================================

    /**
     * Checks if this TradingDateTime is equal to another TradingDateTime
     *
     * @param other Another TradingDateTime to compare with
     * @returns True if both represent the same date and time
     *
     * @example
     * ```typescript
     * import { MarketsTime } from 'src/core/time';
     * const date1 = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
     * const date2 = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
     * const date3 = MarketsTime.USEquities.fromISO('2024-01-16T09:30:00');
     * date1.equals(date2); // true
     * date1.equals(date3); // false
     * ```
     */
    equals(other: TradingDateTime): boolean {
        return this.dateTime.equals(other.dateTime);
    }
}

// TradingDateTimeFactory is now exported through the main module index
// to enforce proper module boundaries
