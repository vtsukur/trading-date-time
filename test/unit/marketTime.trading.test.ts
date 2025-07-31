import { MarketsTime, EXTENDED_HOURS } from '../../src';

describe('Trading Operations', () => {
    it('should correctly identify trading days', () => {
        const tuesday = MarketsTime.USEquities.fromISO('2024-01-16T10:30:00'); // Tuesday
        expect(tuesday.isOnTradingDay()).toBe(true);

        const wednesday = MarketsTime.USEquities.fromISO('2024-01-17T10:30:00'); // Wednesday
        expect(wednesday.isOnTradingDay()).toBe(true);
    });

    it('should correctly identify non-trading days', () => {
        const saturday = MarketsTime.USEquities.fromISO('2024-01-13T10:30:00'); // Saturday
        expect(saturday.isOnTradingDay()).toBe(false);

        const sunday = MarketsTime.USEquities.fromISO('2024-01-14T10:30:00'); // Sunday
        expect(sunday.isOnTradingDay()).toBe(false);
    });

    describe('Regular Trading Hours', () => {
        it('should correctly identify times within Regular Trading Hours', () => {
            const marketOpen = MarketsTime.USEquities.fromISO('2024-01-16T09:30:00');
            expect(marketOpen.isWithinTradingHours()).toBe(true);

            const midDay = MarketsTime.USEquities.fromISO('2024-01-16T12:00:00');
            expect(midDay.isWithinTradingHours()).toBe(true);

            const beforeClose = MarketsTime.USEquities.fromISO('2024-01-16T15:59:00');
            expect(beforeClose.isWithinTradingHours()).toBe(true);
        });

        it('should correctly identify times outside Regular Trading Hours', () => {
            const beforeOpen = MarketsTime.USEquities.fromISO('2024-01-16T09:29:00');
            expect(beforeOpen.isWithinTradingHours()).toBe(false);

            const afterClose = MarketsTime.USEquities.fromISO('2024-01-16T16:01:00');
            expect(afterClose.isWithinTradingHours()).toBe(false);

            const evening = MarketsTime.USEquities.fromISO('2024-01-16T20:00:00');
            expect(evening.isWithinTradingHours()).toBe(false);
        });

        it('should return false for weekends even during what would be trading hours', () => {
            const saturday = MarketsTime.USEquities.fromISO('2024-01-13T12:00:00'); // Saturday noon
            expect(saturday.isWithinTradingHours()).toBe(false);
        });
    });

    describe('Extended Trading Hours', () => {
        it('should correctly identify times within Extended Trading Hours', () => {
            const earlyMorning = MarketsTime.USEquities.fromISO('2024-01-16T05:00:00');
            expect(earlyMorning.isWithinTradingHours(EXTENDED_HOURS)).toBe(true);

            const regularHours = MarketsTime.USEquities.fromISO('2024-01-16T12:00:00');
            expect(regularHours.isWithinTradingHours(EXTENDED_HOURS)).toBe(true);

            const eveningETH = MarketsTime.USEquities.fromISO('2024-01-16T18:00:00');
            expect(eveningETH.isWithinTradingHours(EXTENDED_HOURS)).toBe(true);

            const beforeETHClose = MarketsTime.USEquities.fromISO('2024-01-16T19:59:00');
            expect(beforeETHClose.isWithinTradingHours(EXTENDED_HOURS)).toBe(true);
        });

        it('should correctly identify times outside Extended Trading Hours', () => {
            const beforeETH = MarketsTime.USEquities.fromISO('2024-01-16T03:59:00');
            expect(beforeETH.isWithinTradingHours(EXTENDED_HOURS)).toBe(false);

            const afterETH = MarketsTime.USEquities.fromISO('2024-01-16T20:01:00');
            expect(afterETH.isWithinTradingHours(EXTENDED_HOURS)).toBe(false);

            const lateNight = MarketsTime.USEquities.fromISO('2024-01-16T23:00:00');
            expect(lateNight.isWithinTradingHours(EXTENDED_HOURS)).toBe(false);
        });

        it('should return false for weekends even during extended hours', () => {
            const saturday = MarketsTime.USEquities.fromISO('2024-01-13T12:00:00'); // Saturday noon
            expect(saturday.isWithinTradingHours(EXTENDED_HOURS)).toBe(false);
        });
    });

    describe('Trading Hours Interval', () => {
        it('should return interval for Regular Trading Hours on trading days', () => {
            const tradingDay = MarketsTime.USEquities.fromISO('2024-01-16T12:00:00'); // Tuesday
            const interval = tradingDay.dayTradingHoursInterval();

            expect(interval).not.toBeNull();
            if (interval && interval.start && interval.end) {
                expect(interval.start.toFormat('HH:mm')).toBe('09:30');
                expect(interval.end.toFormat('HH:mm')).toBe('16:00');
            }
        });

        it('should return interval for Extended Trading Hours on trading days', () => {
            const tradingDay = MarketsTime.USEquities.fromISO('2024-01-16T12:00:00'); // Tuesday
            const interval = tradingDay.dayTradingHoursInterval(EXTENDED_HOURS);

            expect(interval).not.toBeNull();
            if (interval && interval.start && interval.end) {
                expect(interval.start.toFormat('HH:mm')).toBe('04:00');
                expect(interval.end.toFormat('HH:mm')).toBe('20:00');
            }
        });

        it('should return interval length correctly', () => {
            const tradingDay = MarketsTime.USEquities.fromISO('2024-01-16T12:00:00'); // Tuesday

            const rthInterval = tradingDay.dayTradingHoursInterval();
            if (rthInterval) {
                expect(rthInterval.length('minutes')).toBe(390); // 6.5 hours
            }

            const ethInterval = tradingDay.dayTradingHoursInterval(EXTENDED_HOURS);
            if (ethInterval) {
                expect(ethInterval.length('minutes')).toBe(960); // 16 hours
            }
        });

        it('should return null for non-trading days', () => {
            const saturday = MarketsTime.USEquities.fromISO('2024-01-13T12:00:00'); // Saturday
            expect(saturday.dayTradingHoursInterval()).toBeNull();
            expect(saturday.dayTradingHoursInterval(EXTENDED_HOURS)).toBeNull();
        });
    });

    describe('Trading Day Navigation', () => {
        it('should find next trading day correctly', () => {
            const tuesday = MarketsTime.USEquities.fromISO('2024-01-16T14:30:00'); // Tuesday
            const nextTradingDay = tuesday.nextTradingDay();

            expect(nextTradingDay.toISODate()).toBe('2024-01-17'); // Wednesday
        });

        it('should skip weekends when finding next trading day', () => {
            const friday = MarketsTime.USEquities.fromISO('2024-01-12T14:30:00'); // Friday
            const nextTradingDay = friday.nextTradingDay();

            expect(nextTradingDay.toISODate()).toBe('2024-01-16'); // Monday (skips weekend)
        });

        it('should find next trading day from weekend', () => {
            const saturday = MarketsTime.USEquities.fromISO('2024-01-13T14:30:00'); // Saturday
            const nextTradingDay = saturday.nextTradingDay();

            expect(nextTradingDay.toISODate()).toBe('2024-01-16'); // Monday
        });

        it('should find previous trading day correctly', () => {
            const wednesday = MarketsTime.USEquities.fromISO('2024-01-17T14:30:00'); // Wednesday
            const prevTradingDay = wednesday.prevTradingDay();

            expect(prevTradingDay.toISODate()).toBe('2024-01-16'); // Tuesday
        });

        it('should skip weekend and holiday when finding previous trading day', () => {
            const tuesday = MarketsTime.USEquities.fromISO('2024-01-16T14:30:00'); // Tuesday (Monday was MLK Day)
            const prevTradingDay = tuesday.prevTradingDay();

            expect(prevTradingDay.toISODate()).toBe('2024-01-12'); // Friday
        });

        it('should find previous trading day from weekend', () => {
            const sunday = MarketsTime.USEquities.fromISO('2024-01-14T14:30:00'); // Sunday
            const prevTradingDay = sunday.prevTradingDay();

            expect(prevTradingDay.toISODate()).toBe('2024-01-12'); // Friday
        });
    });
});