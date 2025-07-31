import { DateTime } from 'luxon';
import { MarketsTime } from '../../src';

describe('TradingDateTime Formatting', () => {
    const testISO = '2024-01-16T09:30:00'; // Tuesday - regular trading day
    const testMarketTimeFactory = MarketsTime.USEquities;

    describe('Formatting Methods', () => {
        const baseDate = testMarketTimeFactory.fromISO(testISO);

        describe('toISODateTime', () => {
            it('should return formatted DateTime string', () => {
                expect(baseDate.toISODateTime()).toBe('2024-01-16T09:30:00');
            });

            it('should handle different times consistently', () => {
                const afternoon = testMarketTimeFactory.fromISO('2024-01-16T14:45:30');
                expect(afternoon.toISODateTime()).toBe('2024-01-16T14:45:30');
            });

            it('should preserve timezone in formatting', () => {
                const utcInput = DateTime.fromISO('2024-01-16T14:30:00.000Z');
                const nyTime = testMarketTimeFactory.fromDateTime(utcInput);
                // The fromDateTime method preserves local time components in NY timezone
                expect(nyTime.toISODateTime()).toBe('2024-01-16T16:30:00');
            });
        });

        describe('toISODate', () => {
            it('should return ISO date string', () => {
                expect(baseDate.toISODate()).toBe('2024-01-16');
            });
        });

        describe('toISOExtendedTime', () => {
            it('should return extended time in HH:mm:ss format', () => {
                expect(baseDate.toISOExtendedTime()).toBe('09:30:00');
            });

            it('should handle different times correctly', () => {
                const afternoon = testMarketTimeFactory.fromISO('2024-01-16T14:45:30');
                expect(afternoon.toISOExtendedTime()).toBe('14:45:30');

                const midnight = testMarketTimeFactory.fromISO('2024-01-16T00:00:00');
                expect(midnight.toISOExtendedTime()).toBe('00:00:00');

                const lateNight = testMarketTimeFactory.fromISO('2024-01-16T23:59:59');
                expect(lateNight.toISOExtendedTime()).toBe('23:59:59');
            });
        });
    });

    describe('Internal Access & Interoperability', () => {
        describe('dateTime property access', () => {
            it('should provide access to underlying DateTime', () => {
                const marketTime = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
                const dateTime = marketTime.dateTime;

                expect(dateTime).toBeInstanceOf(DateTime);
                expect(dateTime.year).toBe(2024);
                expect(dateTime.month).toBe(1);
                expect(dateTime.day).toBe(16);
                expect(dateTime.hour).toBe(9);
                expect(dateTime.minute).toBe(30);
                expect(dateTime.zoneName).toBe('America/New_York');
            });

            it('should allow Luxon operations on underlying DateTime', () => {
                const marketTime = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
                const luxonResult = marketTime.dateTime.plus({ hours: 1 });

                expect(luxonResult).toBeInstanceOf(DateTime);
                expect(luxonResult.hour).toBe(10);
            });
        });
    });

    describe('Immutability', () => {
        it('should not modify original instance during formatting operations', () => {
            const original = testMarketTimeFactory.fromISO('2024-01-16T09:30:00');
            const originalDay = original.dateTime.day;
            const originalHour = original.dateTime.hour;

            // Perform various formatting operations
                    original.toISODate();
        original.toISODateTime();
        original.toISOExtendedTime();

            // Original should remain unchanged
            expect(original.dateTime.day).toBe(originalDay);
            expect(original.dateTime.hour).toBe(originalHour);
        });
    });
});
