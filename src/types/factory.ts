import { DateTime } from 'luxon';
import type { TradingDateTime } from './tradingDateTime';

/**
 * Interface for market-specific factory for creating TradingDateTime instances
 *
 * Provides methods for creating timezone-aware TradingDateTime instances from various inputs.
 * Each factory is configured for a specific market's timezone and trading calendar.
 */
export interface TradingDateTimeFactory {
  /**
   * Creates a TradingDateTime instance from an ISO 8601 string
   *
   * @param iso ISO 8601 formatted date string (e.g., "2024-01-15T09:30:00")
   * @returns TradingDateTime instance in the factory's timezone calendar
   * @throws {RangeError} If the ISO string is empty, whitespace-only, or too long
   * @throws {Error} If the ISO string cannot be parsed or results in invalid DateTime
   */
  fromISO(iso: string): TradingDateTime;

  /**
   * Creates a TradingDateTime instance from milliseconds since Unix epoch
   *
   * @param millis Milliseconds timestamp (must be a finite number)
   * @returns TradingDateTime instance in the factory's timezone calendar
   * @throws {RangeError} If millis is not finite or out of valid range
   * @throws {Error} If results in invalid DateTime
   */
  fromMillis(millis: number): TradingDateTime;

  /**
   * Creates a TradingDateTime instance from a Luxon DateTime object
   *
   * @param dateTime Luxon DateTime instance (must be valid)
   * @returns TradingDateTime instance with preserved time components in factory's timezone
   * @throws {Error} If the input DateTime is invalid
   */
  fromDateTime(dateTime: DateTime): TradingDateTime;

  /**
   * Creates a TradingDateTime instance representing the current moment
   *
   * @returns TradingDateTime instance representing now in the factory's timezone
   */
  now(): TradingDateTime;
}