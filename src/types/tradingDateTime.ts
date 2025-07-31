import { DateTime, Interval } from 'luxon';
import type { TradingHoursScope } from './common';

/**
 * Interface for timezone-aware trading timestamp with market calendar support
 *
 * Represents specific moments in trading time with market-aware operations.
 * This interface provides access to both trading-specific functionality and
 * date/time utilities in a unified API.
 */
export interface TradingDateTime {
  /**
   * Access to underlying Luxon DateTime instance
   *
   * Intentional "escape hatch" for advanced use cases, performance-critical operations,
   * third-party integration, and future-proofing. Provides access to the full Luxon API
   * when the unified interface doesn't cover specific needs.
   */
  readonly dateTime: DateTime;

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
   */
  isOnTradingDay(): boolean;

  /**
   * Checks if this time falls within trading hours
   *
   * @param tradingHoursScope Specifies which trading hours to check ('regular' for standard session, 'extended' for full session)
   * @returns True if within the specified trading hours
   */
  isWithinTradingHours(tradingHoursScope?: TradingHoursScope): boolean;

  /**
   * Gets the trading day interval for this date
   *
   * Returns the full trading day interval (start to end time) for the specified
   * trading hours. This provides direct access to the Luxon Interval object
   * for advanced time range operations.
   *
   * @param tradingHoursScope Specifies which trading hours to get ('regular' for standard session, 'extended' for full session)
   * @returns Luxon Interval representing the trading day bounds, or null if not a trading day
   */
  dayTradingHoursInterval(tradingHoursScope?: TradingHoursScope): Interval | null;

  /**
   * Finds the next trading day after this date
   *
   * @returns New TradingDateTime representing the next trading day
   * @throws Error if no next trading day found within reasonable range
   */
  nextTradingDay(): TradingDateTime;

  /**
   * Finds the previous trading day before this date
   *
   * @returns New TradingDateTime representing the previous trading day
   * @throws Error if no previous trading day found within reasonable range
   */
  prevTradingDay(): TradingDateTime;

  // ==========================================
  // FORMATTING METHODS
  // ==========================================

  /**
   * Converts to ISO date format (YYYY-MM-DD)
   *
   * @returns ISO date string or null if invalid
   */
  toISODate(): string | null;

  /**
   * Converts to ISO DateTime format string without timezone
   *
   * @returns DateTime string in 'yyyy-MM-ddTHH:mm:ss' format (e.g., "2024-01-15T14:30:45")
   */
  toISODateTime(): string;

  /**
   * Converts to ISO extended time format string
   *
   * @returns Extended time string in 'HH:mm:ss' format (e.g., "09:30:45")
   */
  toISOExtendedTime(): string;

  // ==========================================
  // COMPARISON METHODS
  // ==========================================

  /**
   * Checks if this TradingDateTime is equal to another TradingDateTime
   *
   * @param other Another TradingDateTime to compare with
   * @returns True if both represent the same date and time
   */
  equals(other: TradingDateTime): boolean;
}