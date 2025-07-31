/**
 * Immutable class representing a specific time as hour and minute components
 *
 * Provides type-safe time representation with validation to ensure:
 * - Hour is in valid range (0-23)
 * - Minute is in valid range (0-59)
 *
 * This class is immutable - all properties are readonly and cannot be modified after construction.
 */
export class HourMinute {
    /** Hour component (0-23) */
    readonly hour: number;

    /** Minute component (0-59) */
    readonly minute: number;

    /**
     * Creates a new HourMinute instance
     *
     * @param hour Hour component (must be 0-23)
     * @param minute Minute component (must be 0-59)
     * @throws {RangeError} If hour or minute are outside valid ranges
     */
    constructor(hour: number, minute: number) {
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
            throw new RangeError(`Hour must be an integer between 0 and 23, received: ${hour}`);
        }

        if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
            throw new RangeError(`Minute must be an integer between 0 and 59, received: ${minute}`);
        }

        this.hour = hour;
        this.minute = minute;
    }

    /**
     * Converts this HourMinute instance to a time string in HH:mm:ss format
     *
     * @returns Time string in HH:mm:ss format (e.g., "09:30:00")
     */
    toTimeString(): string {
        const hourStr = this.hour.toString().padStart(2, '0');
        const minuteStr = this.minute.toString().padStart(2, '0');
        return `${hourStr}:${minuteStr}:00`;
    }
}

/**
 * Trading Hours configuration interface
 *
 * Defines the trading hours for a market session, including:
 * - Normal market open/close times
 * - Early close time for special trading days (holidays, half-days)
 *
 * This unified interface is used for both Regular Trading Hours (RTH)
 * and Extended Trading Hours (ETH) configurations.
 *
 * @example RTH Configuration
 * ```typescript
 * const rth: TradingHours = {
 *   openTime: new HourMinute(9, 30),
 *   closeTime: new HourMinute(16, 0),
 *   earlyCloseTime: new HourMinute(13, 0)
 * };
 * ```
 *
 * @example ETH Configuration
 * ```typescript
 * const eth: TradingHours = {
 *   openTime: new HourMinute(4, 0),
 *   closeTime: new HourMinute(20, 0),
 *   earlyCloseTime: new HourMinute(17, 0)
 * };
 * ```
 */
export interface TradingHours {
    /** Market session start time */
    readonly openTime: HourMinute;

    /** Market session end time */
    readonly closeTime: HourMinute;

    /** Early close time for special trading days */
    readonly earlyCloseTime: HourMinute;
}



/**
 * Configuration for market-specific day trading session settings
 *
 * This interface encapsulates all time-related configuration for a market:
 * - Timezone identification for the market's local time
 * - Regular Trading Hours (RTH) configuration
 * - Extended Trading Hours (ETH) configuration
 *
 * This unified configuration simplifies market setup and ensures consistent
 * time handling across different market implementations.
 *
 * @example US Equities Configuration
 * ```typescript
 * const usEquitiesConfig: TradingHoursConfig = {
 *     rth: {
 *         openTime: new HourMinute(9, 30),
 *         closeTime: new HourMinute(16, 0),
 *         earlyCloseTime: new HourMinute(13, 0)
 *     },
 *     eth: {
 *         openTime: new HourMinute(4, 0),
 *         closeTime: new HourMinute(20, 0),
 *         earlyCloseTime: new HourMinute(17, 0)
 *     }
 * };
 * ```
 */
export interface TradingHoursConfig {
    /** Regular Trading Hours configuration */
    readonly rth: TradingHours;

    /** Extended Trading Hours configuration */
    readonly eth: TradingHours;
}