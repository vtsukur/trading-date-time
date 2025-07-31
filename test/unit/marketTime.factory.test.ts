import { DateTime } from 'luxon';
import { MarketsTime } from '../../src';
import type { TradingDateTime } from '../../src';

describe('TradingDateTimeFactory', () => {
    let factory: typeof MarketsTime.USEquities;
    const testISO = '2024-01-16T09:30:00'; // Tuesday - regular trading day, beginning of RTH
    const testMillis = 1705415400000; // same Tuesday, same time, just in milliseconds

    beforeEach(() => {
        factory = MarketsTime.USEquities;
    });

    // Helper function to validate common MarketTime expectations for NY timezone
    const expectValidNYMarketTime = (result: TradingDateTime) => {
        expect(result.dateTime.zoneName).toBe('America/New_York');
        expect(result.dateTime.year).toBe(2024);
        expect(result.dateTime.month).toBe(1);
        expect(result.dateTime.day).toBe(16);
        expect(result.dateTime.hour).toBe(9);
        expect(result.dateTime.minute).toBe(30);
        expect(result.dateTime.second).toBe(0);
    };

    describe('fromISO', () => {
        it('should create MarketTime from valid ISO string', () => {
            const result = factory.fromISO(testISO);
            expectValidNYMarketTime(result);
        });

        it('should throw RangeError when given empty ISO string', () => {
            expect(() => factory.fromISO('')).toThrow(RangeError);
            expect(() => factory.fromISO('')).toThrow('ISO string cannot be empty');
        });

        it('should throw RangeError when given whitespace-only ISO string', () => {
            expect(() => factory.fromISO('   ')).toThrow(RangeError);
            expect(() => factory.fromISO('   ')).toThrow('ISO string cannot be whitespace-only');
        });

        it('should throw RangeError when given overly long ISO string', () => {
            const longIso = 'x'.repeat(65); // Exceeds 64 character limit
            expect(() => factory.fromISO(longIso)).toThrow(RangeError);
            expect(() => factory.fromISO(longIso)).toThrow(/ISO string too long.*received 65 characters.*maximum allowed is 64/);
        });

        it('should throw error when given invalid ISO string', () => {
            expect(() => factory.fromISO('invalid-iso-string')).toThrow('Invalid DateTime');
        });

        it('should handle edge case of exactly 64 characters', () => {
            const exactLimit = '2024-01-16T09:30:00.000-05:00' + 'x'.repeat(35); // Exactly 64 chars
            expect(exactLimit).toHaveLength(64);
            // Should not throw length error, but may throw parse error depending on content
            expect(() => factory.fromISO(exactLimit)).toThrow();
        });
    });

    describe('fromMillis', () => {
        it('should create MarketTime from valid milliseconds', () => {
            const result = factory.fromMillis(testMillis);
            expectValidNYMarketTime(result);
        });

        it('should handle negative millis (before Unix epoch)', () => {
            const result = factory.fromMillis(-86400000); // -1 day from epoch
            expect(result.dateTime.zoneName).toBe('America/New_York');
        });

        it('should handle fractional millis', () => {
            const result = factory.fromMillis(testMillis + 0.5);
            expect(result.dateTime.zoneName).toBe('America/New_York');
        });

        it('should throw RangeError when given NaN millis', () => {
            expect(() => factory.fromMillis(NaN)).toThrow(RangeError);
            expect(() => factory.fromMillis(NaN)).toThrow('Expected finite number, received NaN');
        });

        it('should throw RangeError when given Infinity millis', () => {
            expect(() => factory.fromMillis(Infinity)).toThrow(RangeError);
            expect(() => factory.fromMillis(Infinity)).toThrow('Expected finite number, received Infinity');
        });

        it('should throw RangeError when given negative Infinity millis', () => {
            expect(() => factory.fromMillis(-Infinity)).toThrow(RangeError);
            expect(() => factory.fromMillis(-Infinity)).toThrow('Expected finite number, received -Infinity');
        });

        it('should throw RangeError for extremely large finite millis', () => {
            const extremelyLarge = 8.64e15 + 1; // Beyond valid date range but still finite
            expect(() => factory.fromMillis(extremelyLarge)).toThrow(RangeError);
            expect(() => factory.fromMillis(extremelyLarge)).toThrow(/Timestamp out of valid range/);
        });

        it('should accept large timestamp values within valid range', () => {
            const largeValid = 8.64e14; // Well within the positive limit and valid
            const result = factory.fromMillis(largeValid);
            expect(result.dateTime.zoneName).toBe('America/New_York');
        });

        it('should accept timestamp values within valid range', () => {
            const withinRange = -8.64e14; // Well within the negative limit but valid
            const result = factory.fromMillis(withinRange);
            expect(result.dateTime.zoneName).toBe('America/New_York');
        });

        // Test edge cases around the boundary
        it('should accept timestamp exactly at positive boundary', () => {
            const atBoundary = 8.64e15; // Exactly at limit
            factory.fromMillis(atBoundary); // Should not throw
        });

        it('should reject timestamp just beyond positive boundary', () => {
            const beyondBoundary = 8.64e15 + 1;
            expect(() => factory.fromMillis(beyondBoundary)).toThrow(RangeError);
        });
    });

    describe('fromDateTime', () => {
        it('should skip timezone conversion when DateTime is already in correct timezone', () => {
            const nyDateTime = DateTime.fromISO('2024-01-16T09:30:00', { zone: 'America/New_York' });
            const result = factory.fromDateTime(nyDateTime);

            // Should return the same DateTime object (optimization)
            expect(result.dateTime).toBe(nyDateTime);
            expectValidNYMarketTime(result);
        });

        it('should convert from different timezones while preserving local time components', () => {
            const testCases = [
                'UTC',
                'Europe/London',
                'Asia/Tokyo',
                'America/Los_Angeles'
            ];

            testCases.forEach(timezone => {
                const sourceDateTime = DateTime.fromISO('2024-01-16T09:30:00', { zone: timezone });
                const result = factory.fromDateTime(sourceDateTime);

                // Should create new DateTime object (conversion happened)
                expect(result.dateTime).not.toBe(sourceDateTime);

                // Should be in NY timezone with preserved local time
                expect(result.dateTime.zoneName).toBe('America/New_York');
                expect(result.dateTime.hour).toBe(9);
                expect(result.dateTime.minute).toBe(30);
                expect(result.dateTime.second).toBe(0);
            });
        });

        it('should throw error when given invalid DateTime', () => {
            const invalidDateTime = DateTime.fromISO('invalid-date-string');
            expect(() => factory.fromDateTime(invalidDateTime)).toThrow('Invalid DateTime');
        });
    });

    describe('internal behavior', () => {
        it('should use cached zone options for performance', () => {
            // This tests that zoneOptions is reused, though it's hard to directly verify caching
            const result1 = factory.fromISO(testISO);
            const result2 = factory.fromMillis(testMillis);

            expect(result1.dateTime.zoneName).toBe(result2.dateTime.zoneName);
            expect(result1.dateTime.zoneName).toBe('America/New_York');
        });

        it('should validate DateTime after creation in all factory methods', () => {
            // This is implicitly tested by invalid input tests, but worth noting
            // that all methods go through the same post-creation validation
            const invalidInputs = [
                () => factory.fromISO('invalid'),
                () => factory.fromDateTime(DateTime.fromISO('invalid'))
            ];

            invalidInputs.forEach(fn => {
                expect(fn).toThrow('Invalid DateTime');
            });
        });
    });
});
