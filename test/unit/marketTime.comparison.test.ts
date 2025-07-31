import { DateTime } from 'luxon';
import { MarketsTime } from '../../src';
import { Calendar } from '../../src/internal/calendar';
import { HourMinute, TradingHoursConfig } from '../../src/internal/config/tradingHoursConfig';
import { DateTimeFactory } from '../../src/internal/factories/dateTimeFactory';
import { DayRules } from '../../src/internal/rules/dayRules';
import { TradingDateTimeFactory } from '../../src/api/tradingDateTimeFactory';

describe('TradingDateTime Comparison', () => {
    const testMarketTimeFactory = MarketsTime.USEquities;

    // Mock day rules for testing - always returns true for trading days
    class MockDayRules implements DayRules {
        isTradingDay(date: DateTime) { return true; }
        isEarlyCloseDay(date: DateTime) { return false; }
    }

    // Create mock hours calendar
    const mockTradingHoursConfig: TradingHoursConfig = {
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
    };

    describe('equals method', () => {
        it('should return true for TradingDateTime instances representing the same date and time', () => {
            const dateTime1 = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
            const dateTime2 = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');

            expect(dateTime1.equals(dateTime2)).toBe(true);
        });

        it('should return false for TradingDateTime instances representing different dates', () => {
            const dateTime1 = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
            const dateTime2 = testMarketTimeFactory.fromISO('2024-01-17T09:30:00');

            expect(dateTime1.equals(dateTime2)).toBe(false);
        });

        it('should return false for TradingDateTime instances representing different times on same date', () => {
            const dateTime1 = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
            const dateTime2 = testMarketTimeFactory.fromISO('2024-01-16T10:30:00');

            expect(dateTime1.equals(dateTime2)).toBe(false);
        });

        it('should work correctly with very close timestamps (millisecond differences)', () => {
            // Different by 1 millisecond
            const dateTimeFactory = new DateTimeFactory('America/New_York');
            const mockCalendar = new Calendar(dateTimeFactory, new MockDayRules(), mockTradingHoursConfig);
            const factory = new TradingDateTimeFactory(dateTimeFactory, mockCalendar);

            const dateTime1 = factory.fromMillis(1705416600000); // 2024-01-16T09:30:00.000Z in EST
            const dateTime2 = factory.fromMillis(1705416600001); // 2024-01-16T09:30:00.001Z in EST

            expect(dateTime1.equals(dateTime2)).toBe(false);
        });

        it('should return false for TradingDateTime instances with different timezones even if same absolute time', () => {
            // Create a mock calendar that's different from MarketsTime.USEquities's calendar
            class MockCalendar extends Calendar {
                constructor() {
                    const utcDateTimeFactory = new DateTimeFactory('UTC');
                    const mockDayRules = new MockDayRules();
                    super(utcDateTimeFactory, mockDayRules, mockTradingHoursConfig);
                }
            }

            const utcFactory = new TradingDateTimeFactory(
                new DateTimeFactory('UTC'),
                new MockCalendar()
            );

            // Same absolute time, different timezones
            const nyTime = testMarketTimeFactory.fromISO('2024-01-16T09:30:00'); // EST
            const utcTime = utcFactory.fromISO('2024-01-16T14:30:00'); // UTC (same absolute moment)

            expect(nyTime.equals(utcTime)).toBe(false);
        });
    });
});