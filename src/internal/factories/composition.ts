import { TradingDateTimeFactory } from '../../api/tradingDateTimeFactory';
import { Calendar } from '../calendar';
import { DateTimeFactory } from './dateTimeFactory';
import { DayRules } from '../rules/dayRules';
import { TradingHoursConfig } from '../config/tradingHoursConfig';

/**
 * Configuration for creating a trading schedule
 *
 * This type defines the required components for constructing a trading schedule,
 * including the timezone, trading day rules, and trading hours configuration.
 */
export type TradingScheduleConfig = {
    /** Timezone name (e.g., 'America/New_York', 'Europe/London') */
    zoneName: string;

    /** Trading day rules for trading day logic */
    dayRules: DayRules;

    /** Trading hours configuration including timezone and trading hours */
    tradingHoursConfig: TradingHoursConfig;
};

/**
 * Creates a TradingDateTimeFactory from a trading schedule configuration
 *
 * This function takes a complete trading schedule configuration and creates
 * a properly configured TradingDateTimeFactory instance that can be used
 * to create timezone-aware TradingDateTime instances.
 *
 * @param config The trading schedule configuration containing:
 *   - zoneName: Timezone for the market (e.g., 'America/New_York')
 *   - dayRules: Rules defining trading days and holidays
 *   - tradingHoursConfig: Configuration for trading hours (RTH/ETH)
 * @returns A configured TradingDateTimeFactory instance
 *
 * @example
 * ```typescript
 * import { createTradingDateTimeFactory } from './internal/composition';
 * import { TradingScheduleConfig } from './internal/composition';
 *
 * const config: TradingScheduleConfig = {
 *   zoneName: 'America/New_York',
 *   dayRules: myDayRules,
 *   tradingHoursConfig: myTradingHoursConfig
 * };
 *
 * const factory = createTradingDateTimeFactory(config);
 * const tradingDateTime = factory.fromISO('2024-01-15T09:30:00');
 * ```
 */
export function createTradingDateTimeFactory(config: TradingScheduleConfig): TradingDateTimeFactory {
    // Create timezone-aware DateTimeFactory
    const dateTimeFactory = new DateTimeFactory(config.zoneName);

    // Create trading calendar that combines all components
    const tradingCalendar = new Calendar(
        dateTimeFactory,
        config.dayRules,
        config.tradingHoursConfig
    );

    // Create and return the TradingDateTimeFactory
    return new TradingDateTimeFactory(dateTimeFactory, tradingCalendar);
}