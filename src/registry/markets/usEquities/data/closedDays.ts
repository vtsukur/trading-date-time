/**
 * U.S. equities closed days for 2000-2025
 *
 * Complete market closure days when US equities markets are closed for trading.
 * Includes:
 * - Federal holidays
 * - Religious holidays (Good Friday)
 * - Emergency closures (9/11, Hurricane Sandy)
 * - State funeral days
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
 */

import { day, days, validate } from './utils';
import type { CalendarData } from './calendarData';

const closedDaysData: CalendarData = {
    2000: {
        1: day(17),     // Martin Luther King Jr. Day
        2: day(21),     // Presidents Day
        4: day(21),     // Good Friday
        5: day(29),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(4),      // Labor Day
        11: day(23),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2001: {
        1: days([
            1,          // New Year's Day
            15,         // Martin Luther King Jr. Day
        ]),
        2: day(19),     // Presidents Day
        4: day(13),     // Good Friday
        5: day(28),     // Memorial Day
        7: day(4),      // Independence Day
        9: days([
            3,          // Labor Day
            11,         // 9/11 Attacks
            12,         // 9/11 Attacks
            13,         // 9/11 Attacks
            14,         // 9/11 Attacks
        ]),
        11: day(22),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2002: {
        1: days([
            1,          // New Year's Day
            21,         // Martin Luther King Jr. Day
        ]),
        2: day(18),     // Presidents Day
        3: day(29),     // Good Friday
        5: day(27),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(2),      // Labor Day
        11: day(28),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2003: {
        1: days([
            1,          // New Year's Day
            20,         // Martin Luther King Jr. Day
        ]),
        2: day(17),     // Presidents Day
        4: day(18),     // Good Friday
        5: day(26),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(1),      // Labor Day
        11: day(27),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2004: {
        1: days([
            1,          // New Year's Day
            19,         // Martin Luther King Jr. Day
        ]),
        2: day(16),     // Presidents Day
        4: day(9),      // Good Friday
        5: day(31),     // Memorial Day
        6: day(11),     // President Reagan Funeral
        7: day(5),      // Independence Day (observed)
        9: day(6),      // Labor Day
        11: day(25),    // Thanksgiving
        12: day(24),    // Christmas (observed)
    },
    2005: {
        1: day(17),     // Martin Luther King Jr. Day
        2: day(21),     // Presidents Day
        3: day(25),     // Good Friday
        5: day(30),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(5),      // Labor Day
        11: day(24),    // Thanksgiving
        12: day(26),    // Christmas (observed)
    },
    2006: {
        1: days([
            2,          // New Year's Day (observed)
            16,         // Martin Luther King Jr. Day
        ]),
        2: day(20),     // Presidents Day
        4: day(14),     // Good Friday
        5: day(29),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(4),      // Labor Day
        11: day(23),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2007: {
        1: days([
            2,          // President Ford Funeral
            15,         // Martin Luther King Jr. Day
        ]),
        2: day(19),     // Presidents Day
        4: day(6),      // Good Friday
        5: day(28),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(3),      // Labor Day
        11: day(22),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2008: {
        1: days([
            1,          // New Year's Day
            21,         // Martin Luther King Jr. Day
        ]),
        2: day(18),     // Presidents Day
        3: day(21),     // Good Friday
        5: day(26),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(1),      // Labor Day
        11: day(27),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2009: {
        1: days([
            1,          // New Year's Day
            19,         // Martin Luther King Jr. Day
        ]),
        2: day(16),     // Presidents Day
        4: day(10),     // Good Friday
        5: day(25),     // Memorial Day
        7: day(3),      // Independence Day (observed)
        9: day(7),      // Labor Day
        11: day(26),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2010: {
        1: days([
            1,          // New Year's Day
            18,         // Martin Luther King Jr. Day
        ]),
        2: day(15),     // Presidents Day
        4: day(2),      // Good Friday
        5: day(31),     // Memorial Day
        7: day(5),      // Independence Day (observed)
        9: day(6),      // Labor Day
        11: day(25),    // Thanksgiving
        12: day(24),    // Christmas (observed)
    },
    2011: {
        1: day(17),     // Martin Luther King Jr. Day
        2: day(21),     // Presidents Day
        4: day(22),     // Good Friday
        5: day(30),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(5),      // Labor Day
        11: day(24),    // Thanksgiving
        12: day(26),    // Christmas (observed)
    },
    2012: {
        1: days([
            2,          // New Year's Day (observed)
            16,         // Martin Luther King Jr. Day
        ]),
        2: day(20),     // Presidents Day
        4: day(6),      // Good Friday
        5: day(28),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(3),      // Labor Day
        10: days([
            29,         // Hurricane Sandy
            30,         // Hurricane Sandy
        ]),
        11: day(22),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2013: {
        1: days([
            1,          // New Year's Day
            21,         // Martin Luther King Jr. Day
        ]),
        2: day(18),     // Presidents Day
        3: day(29),     // Good Friday
        5: day(27),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(2),      // Labor Day
        11: day(28),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2014: {
        1: days([
            1,          // New Year's Day
            20,         // Martin Luther King Jr. Day
        ]),
        2: day(17),     // Presidents Day
        4: day(18),     // Good Friday
        5: day(26),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(1),      // Labor Day
        11: day(27),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2015: {
        1: days([
            1,          // New Year's Day
            19,         // Martin Luther King Jr. Day
        ]),
        2: day(16),     // Presidents Day
        4: day(3),      // Good Friday
        5: day(25),     // Memorial Day
        7: day(3),      // Independence Day (observed)
        9: day(7),      // Labor Day
        11: day(26),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2016: {
        1: days([
            1,          // New Year's Day
            18,         // Martin Luther King Jr. Day
        ]),
        2: day(15),     // Presidents Day
        3: day(25),     // Good Friday
        5: day(30),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(5),      // Labor Day
        11: day(24),    // Thanksgiving
        12: day(26),    // Christmas (observed)
    },
    2017: {
        1: days([
            2,          // New Year's Day (observed)
            16,         // Martin Luther King Jr. Day
        ]),
        2: day(20),     // Presidents Day
        4: day(14),     // Good Friday
        5: day(29),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(4),      // Labor Day
        11: day(23),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2018: {
        1: days([
            1,          // New Year's Day
            15,         // Martin Luther King Jr. Day
        ]),
        2: day(19),     // Presidents Day
        3: day(30),     // Good Friday
        5: day(28),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(3),      // Labor Day
        11: day(22),    // Thanksgiving
        12: days([
            5,          // President George H.W. Bush Funeral
            25,         // Christmas
        ]),
    },
    2019: {
        1: days([
            1,          // New Year's Day
            21,         // Martin Luther King Jr. Day
        ]),
        2: day(18),     // Presidents Day
        4: day(19),     // Good Friday
        5: day(27),     // Memorial Day
        7: day(4),      // Independence Day
        9: day(2),      // Labor Day
        11: day(28),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2020: {
        1: days([
            1,          // New Year's Day
            20,         // Martin Luther King Jr. Day
        ]),
        2: day(17),     // Presidents Day
        4: day(10),     // Good Friday
        5: day(25),     // Memorial Day
        7: day(3),      // Independence Day (observed)
        9: day(7),      // Labor Day
        11: day(26),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2021: {
        1: days([
            1,          // New Year's Day
            18,         // Martin Luther King Jr. Day
        ]),
        2: day(15),     // Presidents Day
        4: day(2),      // Good Friday
        5: day(31),     // Memorial Day
        7: day(5),      // Independence Day (observed)
        9: day(6),      // Labor Day
        11: day(25),    // Thanksgiving
        12: day(24),    // Christmas (observed)
    },
    2022: {
        1: day(17),     // Martin Luther King Jr. Day
        2: day(21),     // Presidents Day
        4: day(15),     // Good Friday
        5: day(30),     // Memorial Day
        6: day(20),     // Juneteenth (observed)
        7: day(4),      // Independence Day
        9: day(5),      // Labor Day
        11: day(24),    // Thanksgiving
        12: day(26),    // Christmas (observed)
    },
    2023: {
        1: days([
            2,          // New Year's Day (observed)
            16,         // Martin Luther King Jr. Day
        ]),
        2: day(20),     // Presidents Day
        4: day(7),      // Good Friday
        5: day(29),     // Memorial Day
        6: day(19),     // Juneteenth
        7: day(4),      // Independence Day
        9: day(4),      // Labor Day
        11: day(23),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2024: {
        1: days([
            1,          // New Year's Day
            15,         // Martin Luther King Jr. Day
        ]),
        2: day(19),     // Presidents Day
        3: day(29),     // Good Friday
        5: day(27),     // Memorial Day
        6: day(19),     // Juneteenth
        7: day(4),      // Independence Day
        9: day(2),      // Labor Day
        11: day(28),    // Thanksgiving
        12: day(25),    // Christmas
    },
    2025: {
        1: days([
            1,          // New Year's Day
            9,          // President Jimmy Carter Funeral
            20,         // Martin Luther King Jr. Day
        ]),
        2: day(17),     // Presidents Day
        4: day(18),     // Good Friday
        5: day(26),     // Memorial Day
        6: day(19),     // Juneteenth
        7: day(4),      // Independence Day
        9: day(1),      // Labor Day
        11: day(27),    // Thanksgiving
        12: day(25),    // Christmas
    },
};

// Validate the calendar data at module load time
validate(closedDaysData, 'US_EQUITIES_CLOSED_DAYS');

/**
 * US Equities closed days calendar data (2000-2025)
 *
 * ReadonlySet-based calendar for O(1) lookup of market closure days.
 * Use with trading calendar functions to determine market availability.
 */
export const US_EQUITIES_CLOSED_DAYS: CalendarData = closedDaysData;
