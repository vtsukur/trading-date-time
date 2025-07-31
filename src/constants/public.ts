/**
 * Public Trading Hours Constants
 *
 * These constants are part of the public API and can be safely used by consumers.
 */

import type { TradingHoursScope } from '../types/common';

/**
 * Regular Trading Hours only (9:30 AM - 4:00 PM ET for US Equities)
 *
 * Standard market session excluding pre-market and after-hours trading.
 */
export const REGULAR_HOURS: TradingHoursScope = 'regular';

/**
 * Extended Trading Hours including pre-market and after-hours sessions
 *
 * Full session including pre-market (4:00 AM - 9:30 AM) and after-hours (4:00 PM - 8:00 PM) for US Equities.
 */
export const EXTENDED_HOURS: TradingHoursScope = 'extended';