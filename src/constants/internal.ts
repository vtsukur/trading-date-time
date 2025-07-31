/**
 * Internal Constants - Private Implementation
 *
 * These constants are used internally and should not be exported from the public API.
 */

/**
 * Safety limit for trading day navigation to prevent infinite loops
 * Covers longest holiday periods (e.g., Christmas/New Year extended holidays)
 */
export const MAX_DAYS_TO_CHECK = 30;