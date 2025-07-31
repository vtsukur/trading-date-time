/**
 * Core Time Module - Public API
 *
 * Provides timezone-aware trading time functionality designed specifically for financial markets.
 * Unlike standard date/time libraries, this module understands trading calendars, market hours,
 * and business day calculations essential for trading applications.
 *
 * ## What Makes This Different
 *
 * **Built on Luxon Foundation:**
 * - Powered by Luxon's proven date/time engine for reliability and performance
 * - Maintains full compatibility with Luxon's ecosystem and tooling
 * - Provides trading-specific enhancements while preserving Luxon's capabilities
 *
 * **Trading Domain Awareness:**
 * - Knows about market holidays, early close days, and trading sessions
 * - Automatically handles market-specific timezones (e.g., America/New_York for US equities)
 * - Provides business day navigation (next/previous trading day)
 * - Validates trading hours for different session types
 *
 * **Unified API Design:**
 * - Single `TradingDateTime` type combines trading logic + date/time utilities
 * - No need to switch between trading objects and date formatting objects
 * - Method chaining works seamlessly across trading and date/time operations
 * - Full TypeScript support with trading-specific type safety
 *
 * ## Quick Start
 *
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 *
 * // Create market-aware timestamp
 * const marketOpen = MarketsTime.USEquities.fromISO('2024-03-15T09:30:00');
 *
 * // Trading domain operations
 * const nextTradingDay = marketOpen.nextTradingDay();
 * const isMarketOpen = marketOpen.isWithinTradingHours();
 *
 * // Date/time utilities (no type conversion needed)
 * const formatted = nextTradingDay.toISODate() ?? 'invalid-date';
 * ```
 *
 * ## Core Exports
 *
 * - **MarketsTime**: Primary registry for creating market-specific instances
 * - **TradingDateTime**: Core type for trading-aware timestamps
 * - **REGULAR_HOURS/EXTENDED_HOURS**: Trading session scope constants
 * - **TradingDateTimeFactory**: For dependency injection patterns
 *
 * ## Advanced Usage
 *
 * **Escape hatch for Luxon-specific functionality:**
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 * const time = MarketsTime.USEquities.fromISO('2024-03-15T09:30:00');
 *
 * // Use escape hatch when unified API doesn't cover specific needs
 * const relativeTime = time.dateTime.toRelative(); // "in 2 hours"
 * const weekday = time.dateTime.weekdayLong;       // "Friday"
 * ```
 */

// ==========================================
// PRIMARY API - MOST COMMON USAGE
// ==========================================

/**
 * Central registry providing market-specific trading time factories
 *
 * Primary entry point for creating timezone-aware TradingDateTime instances.
 * Currently supports US Equities market with America/New_York timezone handling.
 *
 * @example Market opening timestamp
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 * const marketOpen = MarketsTime.USEquities.fromISO('2024-03-18T09:30:00');
 * const dateStr = marketOpen.toISODate() ?? 'invalid-date'; // "2024-03-18"
 * const isValidTradingDay = marketOpen.isOnTradingDay();
 * ```
 */
export { MarketsTime } from './registry';

// ==========================================
// CORE TYPES AND INTERFACES
// ==========================================

/**
 * Market-aware timestamp interface with unified trading and date/time operations
 *
 * Core interface combining trading domain logic with date/time utilities.
 * Use for function parameters, return types, and variable declarations.
 *
 * @example Function parameter typing
 * ```typescript
 * import { TradingDateTime } from 'src/core/time';
 *
 * function validateTradingSession(barTime: TradingDateTime) {
 *   const isValidDay = barTime.isOnTradingDay();
 *   const timeStr = barTime.toISOExtendedTime(); // "14:30:00"
 *   return { isValidDay, timeStr };
 * }
 * ```
 */
export type { TradingDateTime } from './types';

/**
 * Factory interface for creating market-specific TradingDateTime instances
 *
 * Primarily used for dependency injection in testing and modular architectures.
 * Most applications should use MarketsTime registry for direct instantiation.
 *
 * @example Testing with dependency injection
 * ```typescript
 * import { TradingDateTimeFactory } from 'src/core/time';
 *
 * class BacktestEngine {
 *   constructor(private timeFactory: TradingDateTimeFactory) {}
 *
 *   processHistoricalBar(timestamp: string): { valid: boolean; nextDay?: string } {
 *     try {
 *       const barTime = this.timeFactory.fromISO(timestamp);
 *       const valid = barTime.isOnTradingDay();
 *       const nextDay = valid ? barTime.nextTradingDay().toISODate() ?? 'invalid-date' : undefined;
 *       return { valid, nextDay };
 *     } catch (error) {
 *       return { valid: false };
 *     }
 *   }
 * }
 * ```
 */
export type { TradingDateTimeFactory } from './types';

// ==========================================
// TRADING SESSION CONSTANTS & TYPES
// ==========================================

/**
 * Trading session scope types and constants
 *
 * Defines session boundaries for market hours validation and interval calculations.
 * Use these constants with trading hours operations for consistent session handling.
 *
 * @example Trading hours validation
 * ```typescript
 * import { MarketsTime, REGULAR_HOURS, EXTENDED_HOURS } from 'src/core/time';
 *
 * const time = MarketsTime.USEquities.fromISO('2024-04-12T07:00:00');
 * const isValidDay = time.isOnTradingDay();
 * const inRegular = time.isWithinTradingHours(REGULAR_HOURS);   // false (pre-market)
 * const inExtended = time.isWithinTradingHours(EXTENDED_HOURS); // true (extended hours)
 * ```
 */
export type { TradingHoursScope } from './types';
export { REGULAR_HOURS, EXTENDED_HOURS } from './constants';
