/**
 * Common utilities used across the time package
 *
 * These utilities can be safely used by both public API and internal implementation.
 */

import { DateTime } from 'luxon';

/**
 * Validates if a string is a properly formatted ISO string
 *
 * @param str - String to validate
 * @returns True if the string appears to be a valid ISO format
 */
export function validateISOString(str: string): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }

  // Basic ISO format validation
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?$/;
  return isoRegex.test(str.trim());
}

/**
 * Common formatting utilities for DateTime objects
 */
export const formatters = {
  /**
   * Format DateTime to ISO date string (YYYY-MM-DD)
   */
  toISODate: (date: DateTime): string | null => date.toISODate(),

  /**
   * Format DateTime to ISO date/time string without timezone
   */
  toISODateTime: (date: DateTime): string => date.toFormat("yyyy-MM-dd'T'HH:mm:ss"),

  /**
   * Format DateTime to extended time string (HH:mm:ss)
   */
  toISOExtendedTime: (date: DateTime): string => date.toFormat('HH:mm:ss'),
} as const;