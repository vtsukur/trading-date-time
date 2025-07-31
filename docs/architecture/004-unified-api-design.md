# ADR-004: Unified API Design

## Status: Accepted

## Context

Trading applications need to work with date/time values for multiple purposes:
- Trading domain operations (navigation between trading days, validation of trading hours)
- Standard date/time operations (formatting, comparison, time zone handling)
- Business logic integration (logging, data processing, strategy execution)

Multiple design approaches were considered:
1. **Separate Types**: Trading domain objects separate from date/time utilities
2. **Composition Pattern**: Trading objects wrap date/time objects, requiring type switching
3. **Unified API**: Single type providing both trading domain and date/time functionality

## Decision

Implement **TradingDateTime as a unified API** that provides both trading domain operations and date/time utilities in a single type, eliminating the need for client code to work with multiple date/time types.

## Rationale

**Unified API Benefits:**
- ✅ **Single Type for All Needs**: Client code only works with `TradingDateTime`
- ✅ **No Type Conversion Overhead**: No need to convert to/from Luxon DateTime for formatting
- ✅ **Complete API Surface**: Both trading domain logic AND date/time utilities in one place
- ✅ **Consistent Developer Experience**: All date/time operations available through one interface
- ✅ **Fluent API Patterns**: Method chaining works seamlessly across trading and date/time operations

**Industry Alignment:**
This follows established patterns from successful date/time libraries:

```typescript
// Java LocalDateTime - unified approach
LocalDateTime.now()
  .plusDays(1)                        // temporal math
  .format(DateTimeFormatter.ISO_DATE) // string formatting

// Luxon DateTime - unified approach
DateTime.now()
  .plus({ days: 1 })                  // temporal math
  .toISODate()                        // string formatting

// Our TradingDateTime - unified approach
TradingDateTime.fromISO('...')
  .nextTradingDay()                   // trading domain logic
  .toISODate()                        // string formatting
```

**Client Code Comparison:**

Without unified API (rejected):
```typescript
const luxonDate = DateTime.fromISO('2024-01-15T09:30:00');
const tradingDate = new TradingDateTime(luxonDate, calendar);
if (tradingDate.isOnTradingDay()) {
  const next = tradingDate.nextTradingDay();
  const formatted = next.dateTime.toISODate(); // ← type switching required
}
```

With unified API (chosen):
```typescript
const tradingDate = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
if (tradingDate.isOnTradingDay()) {
  const next = tradingDate.nextTradingDay();
  const formatted = next.toISODate(); // ← all operations on one type
}
```

## Supporting Analysis

### Usage Pattern Evidence

Analysis of trading application requirements reveals that both capabilities are frequently needed together:

**Most frequent operations:**
- `isOnTradingDay()` → `toISODate()` - validate then log/store
- `nextTradingDay()` → `toISODate()` - navigate then format for business logic
- `fromISO()` → `isWithinTradingHours()` - parse then validate
- Strategy execution loops that iterate through trading days AND format results

**Anti-pattern with separate types:**
```typescript
// This pattern would be repeated throughout the codebase
const tradingLogic = myTradingDateTime.nextTradingDay();
const formatted = tradingLogic.dateTime.toISODate(); // ← unwrap to access formatting
```

### Domain-Specific Requirements

Trading applications have unique requirements that benefit from unified design:
- **Strategy Execution**: Needs both trading day navigation and timestamp formatting
- **Backtesting**: Requires seamless switching between trading domain logic and data processing
- **Logging/Debugging**: Must format dates while maintaining trading context
- **Data Pipeline Integration**: Often converts between trading dates and external timestamp formats

### Escape Hatch Design

While the unified API provides comprehensive functionality, TradingDateTime intentionally exposes the underlying Luxon `DateTime` instance via a public `dateTime` property:

```typescript
class TradingDateTime {
    public readonly dateTime: DateTime;  // ← Intentional escape hatch
    // ... unified API methods
}
```

**Design Rationale:**
- **Advanced Use Cases**: Provides access to Luxon's full API surface for edge cases not covered by the unified interface
- **Performance-Critical Operations**: Allows direct access to optimized Luxon methods when needed
- **Third-Party Integration**: Enables passing the underlying DateTime to libraries expecting Luxon objects
- **Future-Proofing**: Ensures no functionality loss when Luxon adds new capabilities

**Usage Guidelines:**
- **Primary**: Use TradingDateTime's unified methods for all standard operations
- **Fallback**: Access `dateTime` only when specific Luxon functionality is required
- **API Evolution**: If `tradingDateTime.dateTime.someMethod()` appears frequently in the codebase, introduce `tradingDateTime.someMethod()` to maintain the unified API principle
- **Code Review Trigger**: Multiple usages of the same escape hatch pattern should prompt unified API expansion

This escape hatch maintains the unified API benefits while providing flexibility for advanced scenarios, following the principle of "make simple things simple, complex things possible."

## Consequences

**Positive:**
- Clean, unified interface for all date/time needs
- Eliminates type conversion boilerplate in client code
- Enables fluent API patterns across domain and utility operations
- Follows industry best practices from established date/time libraries
- Reduces cognitive load - developers work with single type
- Type safety maintained throughout operation chains
- Consistent API surface regardless of operation type
- **Escape hatch access**: Public `dateTime` property provides full Luxon functionality when needed

**Negative:**
- Larger API surface for single class (acceptable trade-off for usability)
- Must maintain both trading domain and date/time utility methods

**Trade-offs Accepted:**
- Slightly larger class interface vs. significantly better developer experience
- Potential method name conflicts vs. type switching overhead

## Notes

- **Design Validation**: Pattern successfully used in Java `LocalDateTime`, Luxon `DateTime`, and other mature date/time APIs
- **Usage Analysis**: Empirical evidence shows trading + formatting operations frequently used together
- **Developer Experience**: Eliminates common anti-patterns requiring type unwrapping
- **Future Extensibility**: New trading operations or date/time utilities can be added to same interface
- **Type Safety**: Full TypeScript support maintained across all operations
- **Performance**: No runtime overhead compared to separate types (same underlying DateTime instance)
- **Backwards Compatibility**: Design allows for easy migration from separate type patterns

This unified approach prioritizes developer experience and API consistency while maintaining the full power of both trading domain operations and date/time utilities.
