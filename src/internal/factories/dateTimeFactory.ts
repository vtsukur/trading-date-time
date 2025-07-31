import { DateTime, DateTimeOptions } from 'luxon';

/**
 * Factory class that creates Luxon DateTime instances with timezone handling
 *
 * This class provides a robust factory implementation that:
 * - Delivers consistent DateTime validation across all factory methods
 * - Standardizes error handling and messaging for invalid inputs
 * - Encapsulates timezone configuration for factory operations
 * - Abstracts common validation → creation → instantiation pattern via generic helper
 *
 * Design Features:
 * - Encapsulates timezone as instance state
 * - Uses generic abstraction pattern with anonymous types for strategy-based factory methods
 * - Provides a single point of change for validation and error handling
 * - Caches zone options and optimizes timezone conversions for better performance
 *
 * @example
 * ```typescript
 * const factory = new DateTimeFactory('America/New_York');
 * const dateTime = factory.fromISO('2024-01-16T09:30:00');
 * ```
 */
export class DateTimeFactory {
    private readonly zoneOptions: DateTimeOptions;

    constructor(private readonly zoneName: string) {
        // Cache DateTime options to avoid repeated object creation
        this.zoneOptions = Object.freeze({ zone: zoneName });
    }

    // ==========================================
    // fromISO CREATION LOGIC
    // ==========================================

    /**
     * Creates a DateTime instance from an ISO 8601 string
     *
     * Parses the ISO string in the factory's timezone and validates
     * the resulting DateTime before returning it.
     *
     * @param iso ISO 8601 formatted date string (e.g., "2024-01-15T09:30:00")
     * @returns DateTime instance in the factory's timezone
     * @throws {RangeError} If the ISO string is empty, whitespace-only, or too long
     * @throws {Error} If the ISO string cannot be parsed or results in invalid DateTime
     */
    fromISO(iso: string): DateTime {
        return this.createFromInput(iso, {
            validate: (iso) => {
                if (iso.length === 0) {
                    throw new RangeError('ISO string cannot be empty');
                }
                if (iso.trim().length === 0) {
                    throw new RangeError('ISO string cannot be whitespace-only');
                }
                if (iso.length > DateTimeFactory.MAX_ISO_LENGTH) {
                    throw new RangeError(`ISO string too long: received ${iso.length} characters, maximum allowed is ${DateTimeFactory.MAX_ISO_LENGTH}. Input: "${iso.substring(0, 50)}..."`);
                }
            },
            createDateTime: (iso) => DateTime.fromISO(iso, this.zoneOptions)
        });
    }

    /**
     * Maximum allowed ISO string length to prevent DoS attacks via extremely long strings.
     * Typical Luxon ISO strings are ~29 characters, this provides flexible truncation buffer.
     */
    private static readonly MAX_ISO_LENGTH = 64;

    // ==========================================
    // fromMillis CREATION LOGIC
    // ==========================================

    /**
     * Creates a DateTime instance from milliseconds since Unix epoch
     *
     * Validates the input is a finite number before conversion and creates
     * the DateTime in the factory's timezone.
     *
     * @param millis Milliseconds timestamp (must be a finite number)
     * @returns DateTime instance in the factory's timezone
     * @throws {RangeError} If millis is not finite or out of valid range
     * @throws {Error} If results in invalid DateTime
     */
    fromMillis(millis: number): DateTime {
        return this.createFromInput(millis, {
            validate: (millis) => {
                if (!Number.isFinite(millis)) {
                    throw new RangeError(`Expected finite number, received ${millis}`);
                }
                // JavaScript Date range: approximately ±8.64e15 milliseconds from epoch
                if (Math.abs(millis) > DateTimeFactory.MAX_TIMESTAMP_VALUE) {
                    throw new RangeError(`Timestamp out of valid range: ${millis}`);
                }
            },
            createDateTime: (millis) => DateTime.fromMillis(millis, this.zoneOptions)
        });
    }

    /**
     * Maximum valid JavaScript timestamp value (±8.64e15 ms from epoch)
     * Corresponds to approximately ±273,790 years from 1970-01-01
     */
    private static readonly MAX_TIMESTAMP_VALUE = 8.64e15;

    // ==========================================
    // fromDateTime CREATION LOGIC
    // ==========================================

    /**
     * Creates a DateTime instance from a Luxon DateTime object
     *
     * Converts the DateTime to the factory's timezone while preserving the
     * local time components (year, month, day, hour, minute, second, millisecond).
     * This means the time values stay the same but are interpreted in the new timezone.
     * Includes timezone optimization to skip conversion when already in correct timezone.
     *
     * @param dateTime Luxon DateTime instance (must be valid)
     * @returns DateTime instance with preserved time components in factory's timezone
     * @throws {Error} If the input DateTime is invalid
     */
    fromDateTime(dateTime: DateTime): DateTime {
        return this.createFromInput(dateTime, {
            validate: DateTimeFactory.validateDateTime,
            createDateTime: (dateTime) => {
                // Skip conversion if already in correct timezone
                if (dateTime.zone.name === this.zoneName) {
                    return dateTime;
                }
                return DateTime.fromObject(
                    this.extractDateTimeComponents(dateTime),
                    this.zoneOptions
                );
            }
        });
    }

    /**
     * Extracts individual time components from a DateTime for timezone conversion
     *
     * IMPORTANT: This method extracts LOCAL time components, not UTC.
     * The extracted components represent the same wall-clock time in the
     * target timezone, effectively preserving visual time while changing timezone.
     *
     * Example: 09:30 UTC becomes 09:30 America/New_York (not 04:30)
     *
     * Separates the DateTime into its constituent parts (year, month, day, hour, minute,
     * second, millisecond) so they can be used to create a new DateTime in a different
     * timezone while preserving the same local time values.
     *
     * @param dateTime Source DateTime to extract components from
     * @returns Object containing all time components ready for DateTime.fromObject()
     * @private
     */
    private extractDateTimeComponents(dateTime: DateTime) {
        return {
            year: dateTime.year,
            month: dateTime.month,
            day: dateTime.day,
            hour: dateTime.hour,
            minute: dateTime.minute,
            second: dateTime.second,
            millisecond: dateTime.millisecond,
        };
    }

    // ==========================================
    // COMMON CREATION AND VALIDATION METHODS
    // ==========================================

    /**
     * Generic helper method that abstracts the common pattern of input validation,
     * DateTime creation, and DateTime instantiation.
     *
     * This method implements the strategy pattern using anonymous types to handle
     * different input validation and DateTime creation approaches while ensuring
     * consistent post-creation validation and DateTime instantiation.
     *
     * @param input The input value to process
     * @param operations Anonymous object containing validation and DateTime creation strategies
     * @returns DateTime instance created from the processed input
     * @private
     */
    private createFromInput<T>(
        input: T,
        operations: {
            readonly validate: (input: T) => void;
            readonly createDateTime: (input: T) => DateTime;
        }
    ): DateTime {
        operations.validate(input);
        const dateTime = operations.createDateTime(input);
        DateTimeFactory.validateDateTime(dateTime);
        return dateTime;
    }

    /**
     * Validates a DateTime instance and throws a standardized error if invalid
     *
     * Checks the DateTime.isValid property and throws a descriptive error with
     * the specific reason for invalidity if validation fails.
     *
     * @param dateTime DateTime instance to validate
     * @throws {Error} With message "Invalid DateTime: {reason}" if invalid
     * @private
     */
    private static validateDateTime(dateTime: DateTime): void {
        if (!dateTime.isValid) {
            DateTimeFactory.throwInvalidDateTimeError(DateTimeFactory.getInvalidDateTimeReason(dateTime));
        }
    }

    /**
     * Extracts a human-readable error reason from an invalid DateTime
     *
     * @param dateTime Invalid DateTime instance
     * @returns The invalidReason from Luxon, or 'Unknown reason' as fallback
     * @private
     */
    private static getInvalidDateTimeReason(dateTime: DateTime): string {
        return dateTime.invalidReason || 'Unknown reason';
    }

    /**
     * Throws a standardized "Invalid DateTime" error with custom reason
     *
     * Provides consistent error messaging across all factory methods.
     *
     * @param reason Specific reason why the DateTime is invalid
     * @throws {Error} Always throws with format "Invalid DateTime: {reason}"
     * @returns Never returns (TypeScript never type)
     * @private
     */
    private static throwInvalidDateTimeError(reason: string): never {
        throw new Error(`Invalid DateTime: ${reason}`);
    }
}
