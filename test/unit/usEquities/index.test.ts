import { describe, it, expect } from '@jest/globals';
import { DateTime } from 'luxon';
import { MarketsTime } from '../../../src';

describe('MarketsTime.USEquities', () => {
    const factory = MarketsTime.USEquities;
    // Simple integration test focusing on the public API
    it('should use America/New_York timezone across all factory methods', () => {
        const isoResult = factory.fromISO('2024-01-16T09:30:00');
        const millisResult = factory.fromMillis(1705415400000);
        const dateTimeResult = factory.fromDateTime(
            DateTime.fromISO('2024-01-16T09:30:00', { zone: 'UTC' })
        );

        [isoResult, millisResult, dateTimeResult].forEach(result => {
            expect(result.dateTime.zoneName).toBe('America/New_York');
        });
    });
});
