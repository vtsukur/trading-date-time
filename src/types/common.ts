/**
 * Common types shared across the time package
 */

/**
 * Type defining trading session scope - regular hours vs extended hours
 *
 * Used to specify which trading session to consider for operations like
 * isWithinTradingHours() and dayTradingHoursInterval().
 */
export type TradingHoursScope = 'regular' | 'extended';