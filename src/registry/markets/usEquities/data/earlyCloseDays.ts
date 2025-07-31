/**
 * U.S. equities early close days for 2000-2025
 *
 * Days when US equities markets close at 1:00 PM ET instead of 4:00 PM ET.
 * Includes:
 * - Black Friday (day after Thanksgiving)
 * - Christmas Eve (when applicable)
 * - Day before Independence Day (when July 4th falls on certain weekdays)
 *
 * Using nested object structure with Sets for O(1) lookup performance.
 * Each date is on a separate line with descriptive comments.
 *
 * Data sources and verification:
 * - SEC: https://www.sec.gov/rules/other/2023/34-98363.pdf
 * - NYSE: https://www.nyse.com/markets/hours-calendars
 * - NASDAQ: https://www.nasdaq.com/market-activity/stock-market-holiday-calendar
 * - Federal Reserve: https://www.federalreserve.gov/aboutthefed/k8.htm
 *
 * @lastVerified 2025-07-23
 * @dataRange 2000-2025
 * @note Early close hours: Regular trading ends at 1:00 PM ET, after-hours ends at 5:00 PM ET
 */

import { day, validate } from './utils';
import type { CalendarData } from './calendarData';

const earlyCloseDaysData: CalendarData = {
    2000: {
        7: day(3),      // Day before Independence Day
        11: day(24),    // Black Friday
    },
    2001: {
        7: day(3),      // Day before Independence Day
        11: day(23),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2002: {
        7: day(3),      // Day before Independence Day
        11: day(29),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2003: {
        7: day(3),      // Day before Independence Day
        11: day(28),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2004: {
        11: day(26),    // Black Friday
    },
    2005: {
        11: day(25),    // Black Friday
    },
    2006: {
        7: day(3),      // Day before Independence Day
        11: day(24),    // Black Friday
    },
    2007: {
        7: day(3),      // Day before Independence Day
        11: day(23),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2008: {
        7: day(3),      // Day before Independence Day
        11: day(28),    // Black Friday
    },
    2009: {
        11: day(27),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2010: {
        11: day(26),    // Black Friday
    },
    2011: {
        7: day(1),      // Day before Independence Day (July 4 fell on Monday)
        11: day(25),    // Black Friday
    },
    2012: {
        11: day(23),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2013: {
        7: day(3),      // Day before Independence Day
        11: day(29),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2014: {
        7: day(3),      // Day before Independence Day
        11: day(28),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2015: {
        11: day(27),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2016: {
        7: day(1),      // Day before Independence Day (July 4 fell on Monday)
        11: day(25),    // Black Friday
        12: day(23),    // Christmas Eve (observed)
    },
    2017: {
        7: day(3),      // Day before Independence Day
        11: day(24),    // Black Friday
    },
    2018: {
        7: day(3),      // Day before Independence Day
        11: day(23),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2019: {
        7: day(3),      // Day before Independence Day
        11: day(29),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2020: {
        11: day(27),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2021: {
        7: day(2),      // Day before Independence Day (July 5 was the observed holiday)
        11: day(26),    // Black Friday
    },
    2022: {
        11: day(25),    // Black Friday
    },
    2023: {
        7: day(3),      // Day before Independence Day
        11: day(24),    // Black Friday
    },
    2024: {
        7: day(3),      // Day before Independence Day
        11: day(29),    // Black Friday
        12: day(24),    // Christmas Eve
    },
    2025: {
        7: day(3),      // Day before Independence Day
        11: day(28),    // Black Friday
        12: day(24),    // Christmas Eve
    },
};

// Validate the calendar data at module load time
validate(earlyCloseDaysData, 'US_EQUITIES_EARLY_CLOSE_DAYS');

/**
 * US Equities early close days calendar data (2000-2025)
 *
 * ReadonlySet-based calendar for O(1) lookup of early close days.
 * Use with trading calendar functions to determine market hours.
 */
export const US_EQUITIES_EARLY_CLOSE_DAYS: CalendarData = earlyCloseDaysData;
