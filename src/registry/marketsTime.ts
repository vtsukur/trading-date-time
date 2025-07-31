/**
 * Central registry for market-specific trading date time factories
 *
 * Provides access to timezone-aware TradingDateTime factories for different markets.
 * This is the primary public API for creating market-specific time instances.
 */

import { USEquitiesTradingDateTimeFactory } from './markets/usEquities';

/**
 * Registry of trading date time factories for all supported markets
 *
 * @example Creating market-specific instances
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 *
 * const nyTime = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
 * if (nyTime.isOnTradingDay() && nyTime.isWithinTradingHours()) {
 *     const nextTradingDay = nyTime.nextTradingDay();
 * }
 * ```
 */
export const MarketsTime = {
    /** US Equities market (NYSE/NASDAQ) - America/New_York timezone */
    USEquities: USEquitiesTradingDateTimeFactory,
} as const;