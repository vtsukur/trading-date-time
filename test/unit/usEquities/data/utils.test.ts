import type { CalendarData } from '../../../../src/registry/markets/usEquities/data/calendarData';
import {
    day,
    days,
    validate,
} from '../../../../src/registry/markets/usEquities/data/utils';

describe('utils functions', () => {
    describe('day', () => {
        it('should create ReadonlySet with single day', () => {
            const result = day(25);
            expect(result).toEqual(new Set([25]));
            expect(result.has(25)).toBe(true);
            expect(result.size).toBe(1);
        });
    });

    describe('days', () => {
        it('should create ReadonlySet with multiple days', () => {
            const result = days([24, 25, 26]);
            expect(result).toEqual(new Set([24, 25, 26]));
            expect(result.has(24)).toBe(true);
            expect(result.has(25)).toBe(true);
            expect(result.has(26)).toBe(true);
            expect(result.size).toBe(3);
        });

        it('should handle empty arrays', () => {
            const result = days([]);
            expect(result).toEqual(new Set([]));
            expect(result.size).toBe(0);
        });
    });

    describe('validate', () => {
        const validData: CalendarData = {
            2024: {
                1: new Set([1, 15]), // Valid dates
                2: new Set([14, 29]), // Valid dates (2024 is leap year)
                12: new Set([25]), // Valid date
            },
            2023: {
                2: new Set([14, 28]), // Valid dates (2023 is not leap year)
                7: new Set([4]), // Valid date
            },
        };

        const invalidData: CalendarData = {
            2024: {
                2: new Set([30, 31]), // Invalid dates for February
                13: new Set([1]), // Invalid month
            },
        };

        const dateNormalizationData: CalendarData = {
            2024: {
                2: new Set([31]), // February 31st doesn't exist, would normalize to March 2nd
            },
        };

        it('should pass validation for valid calendar data', () => {
            expect(() => {
                validate(validData, 'VALID_TEST_DATA');
            }).not.toThrow();
        });

        it('should throw error for invalid dates', () => {
            expect(() => {
                validate(invalidData, 'INVALID_TEST_DATA');
            }).toThrow('Invalid dates found in INVALID_TEST_DATA');
        });

        it('should catch date normalization issues', () => {
            expect(() => {
                validate(dateNormalizationData, 'NORMALIZATION_TEST_DATA');
            }).toThrow('Invalid dates found in NORMALIZATION_TEST_DATA');
        });

        it('should provide detailed error messages for invalid dates', () => {
            let errorMessage = '';
            try {
                validate(invalidData, 'TEST_DATA');
            } catch (error) {
                errorMessage = (error as Error).message;
            }

            expect(errorMessage).toContain('TEST_DATA');
            expect(errorMessage).toContain('2024-02-30');
            expect(errorMessage).toContain('2024-02-31');
            expect(errorMessage).toContain('2024-13-01');
        });

        it('should handle empty data gracefully', () => {
            const emptyData: CalendarData = {};
            expect(() => {
                validate(emptyData, 'EMPTY_DATA');
            }).not.toThrow();
        });

        it('should handle leap year validation correctly', () => {
            const leapYearData: CalendarData = {
                2024: { 2: new Set([29]) }, // Valid leap year date
                2023: { 2: new Set([28]) }, // Valid non-leap year date
            };

            const invalidLeapYearData: CalendarData = {
                2023: { 2: new Set([29]) }, // Invalid non-leap year date
            };

            expect(() => {
                validate(leapYearData, 'LEAP_YEAR_DATA');
            }).not.toThrow();

            expect(() => {
                validate(invalidLeapYearData, 'INVALID_LEAP_YEAR_DATA');
            }).toThrow();
        });
    });
});
