# ADR-003: TradingDateTime as Public API

## Status: Accepted

## Context

The time package needed consistent naming for the primary date/time representation used throughout the trading date-time library. Multiple naming options were considered:
- `DateTime` (ideal for a date-time library)
- `TradingDateTime`
- `MarketTime`
- `TradingTime`

The choice affects the entire public API surface and user experience. Key evaluation criteria included:
- Semantic precision
- Usage pattern alignment
- Industry standards
- Developer clarity
- No naming conflicts
- Clear differentiation

## Decision

Use `TradingDateTime` as the primary class name for timezone-aware trading date/time operations, with corresponding `TradingDateTimeFactory` for instance creation.

## Rationale

**Chosen: `TradingDateTime`**
- ✅ **Semantic precision**: Unambiguous in trading domain where "time" has multiple meanings (e.g., economic calendar release times, order execution latency, etc.)
- ✅ **Usage pattern alignment**: Matches actual date-centric operations in codebase
- ✅ **Industry standards**: Follows established API design patterns for timestamp objects
- ✅ **Developer clarity**: Explicit about representing specific moments in time (timestamps)
- ✅ **No naming conflicts**: Avoids clash with Luxon's `DateTime` class
- ✅ **Clear differentiation**: Distinguishes our wrapper from Luxon's base class

**Rejected alternatives:**
- ❌ `DateTime`: **Primary issue** - Direct conflict with Luxon's `DateTime` import
- ❌ `MarketTime`: Too generic, could refer to market timing strategies, market volatility periods, etc.
- ❌ `TradingTime`: **Multiple issues**:
  - Ambiguous about whether it includes date component
  - Domain confusion (could mean opening time, session duration, or timestamp)
  - Misleading given actual usage is date-heavy operations

## Supporting Analysis

### Usage Pattern Evidence

Analysis of the codebase reveals a **date-centric usage pattern** that supports the `TradingDateTime` naming:

**Most frequent operations:**
- `isOnTradingDay()` - validates trading **days**
- `nextTradingDay()` / `prevTradingDay()` - navigates trading **days**
- `toISODate()` - extracts date strings for logging and business logic
- Strategy execution loops that iterate through trading **days**
- Date range validation focusing on **day** boundaries

**Less frequent operations:**
- `isWithinTradingHours()` - time-of-day validation
- Time formatting methods - primarily for debugging

This pattern demonstrates the class primarily represents **date+time timestamps** rather than abstract "time" concepts.

### Domain Semantics

In trading contexts, "time" is inherently ambiguous and could refer to:
- Market opening time (9:30 AM)
- Trading session duration (6.5 hours)
- A specific timestamp (2024-01-15T14:30:00)
- Time remaining until market close

The `DateTime` suffix eliminates this ambiguity by explicitly indicating **specific moments in time**.

### Industry Alignment

Research of successful APIs reveals consistent patterns:
- **Stripe**: Uses timestamp fields with clear temporal suffixes
- **REST API standards**: Favor explicit naming over brevity when preventing ambiguity
- **ISO 8601**: The standard itself uses "date and time" terminology for timestamp representations

### Conciseness vs. Clarity Trade-off

While `TradingTime` saves 7 characters, the potential for misinterpretation in a domain where precision matters outweighs the brevity benefit. Clear APIs prioritize developer understanding over character count.

## Consequences

**Positive:**
- Clear, unambiguous API for time operations
- Consistent naming across factories and instances
- Domain-specific terminology aids comprehension
- Factory pattern naturally follows: `TradingDateTimeFactory`
- Aligns with actual usage patterns (date-heavy operations)
- Follows industry best practices for timestamp object naming
- Eliminates potential confusion in trading domain contexts
- Explicit connection to underlying Luxon `DateTime` functionality

**Negative:**
- Slightly longer name than alternatives (7 additional characters vs. `TradingTime`)

## Notes

- **Design drivers**: Semantic precision, usage patterns, and industry alignment provide strong justification for the choice
- **Practical constraint**: Import conflicts with `import { DateTime } from 'luxon'` eliminated the ideal `DateTime` option
- In a date-time library context, plain `DateTime` would be ideal if not for the Luxon dependency
- Validated through public API design review and empirical usage analysis
- Factory naming follows established patterns in the codebase
- The "Trading" prefix serves dual purposes: avoiding conflicts and providing domain context
- Decision reinforced by industry research showing similar patterns in successful APIs (Stripe, ISO 8601)
- Usage patterns favor date operations over time-only operations, validating the naming choice