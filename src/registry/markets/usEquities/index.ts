import { USEquitiesTradingDayCalendar } from './tradingDayCalendar';
import { HourMinute } from '../../../internal/config/tradingHoursConfig';
import { createTradingDateTimeFactory } from '../../../internal/factories/composition';

/**
 * US Equities trading date time factory
 *
 * Factory for creating timezone-aware TradingDateTime instances for US stock market operations.
 * Access this factory through MarketsTime.USEquities instead of importing directly.
 *
 * @example
 * ```typescript
 * import { MarketsTime } from 'src/core/time';
 *
 * const date = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
 * ```
 */
export const USEquitiesTradingDateTimeFactory = createTradingDateTimeFactory({
    zoneName: 'America/New_York',
    dayRules: new USEquitiesTradingDayCalendar(),
    tradingHoursConfig: {
        rth: {
            openTime: new HourMinute(9, 30),
            closeTime: new HourMinute(16, 0),
            earlyCloseTime: new HourMinute(13, 0),
        },
        eth: {
            openTime: new HourMinute(4, 0),
            closeTime: new HourMinute(20, 0),
            earlyCloseTime: new HourMinute(17, 0),
        }
    }
});