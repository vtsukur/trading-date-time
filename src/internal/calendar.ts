import { DateTime, Interval } from 'luxon';
import type { TradingHoursScope } from '../types/common';
import { EXTENDED_HOURS } from '../constants/public';
import { MAX_DAYS_TO_CHECK } from '../constants/internal';
import { DateTimeFactory } from './factories/dateTimeFactory';
import { TradingHoursConfig } from './config/tradingHoursConfig';
import { DayRules } from './rules/dayRules';

/**
 * Base class for market-specific trading calendars
 *
 * This class provides common functionality for timezone handling, trading hours configuration,
 * interval calculation, and trading day navigation using a DayRules implementation.
 *
 * Features:
 * - Trading day navigation with safety limits
 * - Market-specific day rules via DayRules
 * - Timezone-aware trading hours calculation
 */
export class Calendar {
    /** DateTime factory for timezone-aware DateTime creation */
    readonly dateTimeFactory: DateTimeFactory;

    /** Trading day rules for trading day logic */
    readonly dayRules: DayRules;

    /** Trading hours configuration including timezone and trading hours */
    readonly tradingHoursConfig: TradingHoursConfig;

    constructor(dateTimeFactory: DateTimeFactory, dayRules: DayRules, tradingHoursConfig: TradingHoursConfig) {
        this.dateTimeFactory = dateTimeFactory;
        this.dayRules = dayRules;
        this.tradingHoursConfig = tradingHoursConfig;
    }



    // ==========================================
    // DELEGATED METHODS (Market day rules)
    // ==========================================

    /**
     * Determines if the given date is a trading day for this market
     * @param date The date to check
     * @returns True if it's a trading day, false for weekends/holidays
     */
    isTradingDay(date: DateTime): boolean {
        return this.dayRules.isTradingDay(date);
    }

    /**
     * Determines if the given date is an early close trading day
     * @param date The date to check
     * @returns True if it's an early close day (e.g., day before major holidays)
     */
    isEarlyCloseDay(date: DateTime): boolean {
        return this.dayRules.isEarlyCloseDay(date);
    }

    // ==========================================
    // TRADING DAY NAVIGATION
    // ==========================================

    /**
     * Finds the next trading day after the given date
     *
     * Skips weekends and holidays to find the actual next trading day.
     * Includes safety limit to prevent infinite loops.
     *
     * @param date Starting date
     * @returns DateTime representing the next trading day
     * @throws Error if no trading day found within reasonable range
     */
    nextTradingDay(date: DateTime): DateTime {
        let candidate = date.plus({ days: 1 });
        let daysChecked = 0;
        const maxDaysToCheck = MAX_DAYS_TO_CHECK; // Safety limit (covers longest holiday periods)

        while (daysChecked < maxDaysToCheck) {
            if (this.isTradingDay(candidate)) {
                return candidate;
            }
            candidate = candidate.plus({ days: 1 });
            daysChecked++;
        }

        throw new Error(`No trading day found within ${maxDaysToCheck} days after ${date.toISODate()}`);
    }

    /**
     * Finds the previous trading day before the given date
     *
     * Skips weekends and holidays to find the actual previous trading day.
     * Includes safety limit to prevent infinite loops.
     *
     * @param date Starting date
     * @returns DateTime representing the previous trading day
     * @throws Error if no trading day found within reasonable range
     */
    prevTradingDay(date: DateTime): DateTime {
        let candidate = date.minus({ days: 1 });
        let daysChecked = 0;
        const maxDaysToCheck = MAX_DAYS_TO_CHECK; // Safety limit (covers longest holiday periods)

        while (daysChecked < maxDaysToCheck) {
            if (this.isTradingDay(candidate)) {
                return candidate;
            }
            candidate = candidate.minus({ days: 1 });
            daysChecked++;
        }

        throw new Error(`No trading day found within ${maxDaysToCheck} days before ${date.toISODate()}`);
    }

    // ==========================================
    // CONCRETE METHODS (Common functionality)
    // ==========================================

    /**
     * Gets the trading hours interval for a specific date and trading hours type
     *
     * @param date The trading date
     * @param tradingHoursScope Whether to use regular or extended hours
     * @returns Interval representing the trading session, or null if not a trading day
     */
    tradingHoursInterval(date: DateTime, tradingHoursScope: TradingHoursScope): Interval | null {
        if (!this.isTradingDay(date)) return null;

        const dateStr = date.toISODate();
        let startTime: string;
        let endTime: string;

        if (tradingHoursScope === EXTENDED_HOURS) {
            startTime = this.tradingHoursConfig.eth.openTime.toTimeString();
            endTime = this.isEarlyCloseDay(date) ? this.tradingHoursConfig.eth.earlyCloseTime.toTimeString() : this.tradingHoursConfig.eth.closeTime.toTimeString();
        } else {
            startTime = this.tradingHoursConfig.rth.openTime.toTimeString();
            endTime = this.isEarlyCloseDay(date) ? this.tradingHoursConfig.rth.earlyCloseTime.toTimeString() : this.tradingHoursConfig.rth.closeTime.toTimeString();
        }

        return Interval.fromDateTimes(
            this.dateTimeFactory.fromISO(`${dateStr}T${startTime}`),
            this.dateTimeFactory.fromISO(`${dateStr}T${endTime}`)
        );
    }


}