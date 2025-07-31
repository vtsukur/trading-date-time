import { DateTime } from 'luxon';
import { type Calendar } from '../internal/calendar';
import { DateTimeFactory } from '../internal/factories/dateTimeFactory';
import type { TradingDateTimeFactory as ITradingDateTimeFactory } from '../types';
import { TradingDateTime } from './tradingDateTime';

/**
 * Factory class that creates TradingDateTime instances with timezone and market calendar
 *
 * This class provides a robust factory implementation that:
 * - Delegates DateTime creation to DateTimeFactory for consistent validation and error handling
 * - Encapsulates market calendar for factory operations
 * - Wraps DateTime instances with TradingDateTime for market-specific functionality
 *
 * Design Features:
 * - Composition over duplication: delegates to DateTimeFactory for DateTime creation
 * - Encapsulates market calendar as instance state
 * - Provides market-specific wrapper around generic DateTime functionality
 * - Maintains consistent API while leveraging existing DateTime creation logic
 *
 * @example Internal usage (for module development)
 * ```typescript
 * import { DateTimeFactory } from '../internal/factories/dateTimeFactory';
 * import { TradingDateTimeFactory } from './tradingDateTimeFactory';
 *
 * const dateTimeFactory = new DateTimeFactory('America/New_York');
 * const factory = new TradingDateTimeFactory(dateTimeFactory, calendar);
 * const tradingDateTime = factory.fromISO('2024-01-16T09:30:00');
 * ```
 *
 * @example Public API usage (recommended)
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 *
 * // Use the registry instead of constructing factories directly
 * const tradingDateTime = MarketsTime.USEquities.fromISO('2024-01-16T09:30:00');
 * ```
 */
export class TradingDateTimeFactory implements ITradingDateTimeFactory {
    constructor(
        private readonly dateTimeFactory: DateTimeFactory,
        private readonly calendar: Calendar
    ) {}

    /**
     * Creates a TradingDateTime instance from an ISO 8601 string
     *
     * Delegates to the DateTimeFactory for DateTime creation and validation,
     * then wraps the result with TradingDateTime for market-specific functionality.
     *
     * @param iso ISO 8601 formatted date string (e.g., "2024-01-15T09:30:00")
     * @returns TradingDateTime instance in the factory's timezone calendar
     * @throws {RangeError} If the ISO string is empty, whitespace-only, or too long
     * @throws {Error} If the ISO string cannot be parsed or results in invalid DateTime
     */
    fromISO(iso: string): TradingDateTime {
        const dateTime = this.dateTimeFactory.fromISO(iso);
        return new TradingDateTime(dateTime, this.calendar);
    }

    /**
     * Creates a TradingDateTime instance from milliseconds since Unix epoch
     *
     * Delegates to the DateTimeFactory for DateTime creation and validation,
     * then wraps the result with TradingDateTime for market-specific functionality.
     *
     * @param millis Milliseconds timestamp (must be a finite number)
     * @returns TradingDateTime instance in the factory's timezone calendar
     * @throws {RangeError} If millis is not finite or out of valid range
     * @throws {Error} If results in invalid DateTime
     */
    fromMillis(millis: number): TradingDateTime {
        const dateTime = this.dateTimeFactory.fromMillis(millis);
        return new TradingDateTime(dateTime, this.calendar);
    }

    /**
     * Creates a TradingDateTime instance from a Luxon DateTime object
     *
     * Delegates to the DateTimeFactory for DateTime conversion and validation,
     * then wraps the result with TradingDateTime for market-specific functionality.
     *
     * @param dateTime Luxon DateTime instance (must be valid)
     * @returns TradingDateTime instance with preserved time components in factory's timezone
     * @throws {Error} If the input DateTime is invalid
     */
    fromDateTime(dateTime: DateTime): TradingDateTime {
        const convertedDateTime = this.dateTimeFactory.fromDateTime(dateTime);
        return new TradingDateTime(convertedDateTime, this.calendar);
    }

    /**
     * Creates a TradingDateTime instance representing the current moment
     *
     * @returns TradingDateTime instance representing now in the factory's timezone
     */
    now(): TradingDateTime {
        const dateTime = this.dateTimeFactory.fromMillis(Date.now());
        return new TradingDateTime(dateTime, this.calendar);
    }
}
