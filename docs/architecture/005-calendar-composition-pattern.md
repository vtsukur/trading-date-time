# ADR-005: Calendar as Composition Coordinator

## Status: Accepted

## Context

The Calendar class needed to provide unified access to trading day logic and trading hours logic for TradingDateTime's internal use. During code review, concern was raised about whether Calendar was becoming a "god object" that handles too many responsibilities.

Two architectural approaches were considered:
1. **Monolithic Calendar**: Single class handling all date/time logic
2. **Composition Coordinator**: Calendar coordinates specialized components

## Decision

Implement Calendar as a **composition coordinator** that delegates to specialized components:
- `DayRules`: Handles trading day determination (weekends, holidays)
- `TradingHoursConfig`: Handles intraday trading hours (RTH, ETH, early close)
- `DateTimeFactory`: Handles timezone-aware DateTime creation

**Calendar's Coordination Responsibilities:**
- Combines component capabilities to provide higher-level operations
- Implements trading day navigation (`nextTradingDay`, `prevTradingDay`) by coordinating with DayRules
- Provides unified access to all calendar-related functionality
- **Internal API Design**: Calendar is primarily intended for use by TradingDateTime, not direct client access

## Rationale

**Why Composition Coordinator:**
- ✅ **Single Responsibility**: Each component has one clear purpose
- ✅ **Testability**: Components can be tested in isolation
- ✅ **Flexibility**: Can swap implementations (e.g., different market calendars)
- ✅ **Maintainability**: Changes to day logic don't affect hours logic
- ✅ **Appropriate Coordination**: Calendar implements higher-level operations by coordinating components
- ✅ **Clear Domain Ownership**: Trading day navigation logically belongs with calendar coordination
- ✅ **Simplified Client Usage**: TradingDateTime need only one dependency instead of multiple components

**Why NOT Monolithic:**
- ❌ Would violate Single Responsibility Principle
- ❌ Difficult to test complex interactions
- ❌ Hard to extend for different markets
- ❌ Classic "god object" anti-pattern

## Implementation Validation

**Calendar as Logic Owner:**
Calendar correctly implements `nextTradingDay()` and `prevTradingDay()` methods because:
- These operations require **coordination** between DayRules (holiday logic) and navigation algorithms
- They represent **higher-level calendar operations** rather than primitive component functionality
- The logic belongs with calendar domain expertise, not date/time utilities

**TradingDateTime as User Interface:**
TradingDateTime provides wrapper methods that:
- Maintain type consistency (`TradingDateTime` → `TradingDateTime`)
- Enable fluent API patterns (`date.nextTradingDay().nextTradingDay()`)
- Delegate to Calendar for actual business logic
- Avoid duplicating calendar knowledge
- **Simplified dependency management**: Only needs one Calendar reference instead of multiple component references
- **Public API Gateway**: Acts as the primary interface for calendar operations, keeping Calendar internal

**Internal vs. Public API Boundaries:**
- **Calendar**: Internal implementation detail, not exposed to API clients
- **TradingDateTime**: Public API surface for all calendar-related operations
- **Market Extensions**: New markets should extend through TradingDateTime factories, not direct Calendar usage

This architecture ensures Calendar owns the **"what"** (business logic) while TradingDateTime focuses on the **"how"** (user experience).

**Alternative Without Composition Coordinator:**
Without Calendar, TradingDateTime would need:
```typescript
class TradingDateTime {
    private dayRules: DayRules;
    private tradingHoursConfig: TradingHoursConfig;
    private dateTimeFactory: DateTimeFactory;

    // Complex coordination logic repeated in every client
    nextTradingDay(): TradingDateTime { /* coordinate components */ }
}
```

**With Composition Coordinator:**
```typescript
class TradingDateTime {
    private calendar: Calendar; // Single dependency

    // Simple delegation
    nextTradingDay(): TradingDateTime {
        return new TradingDateTime(this.calendar.nextTradingDay(this.dateTime), this.calendar);
    }
}
```

## Implementation Complexity Analysis

**Navigation Algorithm Complexity:**

Calendar implements non-trivial iterative algorithms with safety limits (see `Calendar.nextTradingDay()` and `Calendar.prevTradingDay()` in `src/core/time/internal/calendar.ts`):
- Bounded while loops with safety limits to prevent infinite iteration
- Multi-component coordination between navigation logic and DayRules
- Error handling for edge cases (extended holiday periods)
- This algorithmic complexity would be duplicated across every market without composition

**Multi-Component Coordination:**

The trading hours interval calculation (see `Calendar.tradingHoursInterval()`) demonstrates complex orchestration:
- Coordinates 3 separate components: DayRules, TradingHoursConfig, DateTimeFactory
- Contains conditional branching logic for early close scenarios
- Handles timezone-aware interval creation with market-specific rules
- Requires domain expertise that belongs in Calendar, not scattered across clients

**Measurable Coordination Benefits:**

- **Algorithm reuse**: Navigation methods contain ~15-20 lines of complex logic that would be duplicated per market
- **Component coordination**: Trading hours calculation orchestrates 3 components with 4+ decision branches
- **Error handling consolidation**: Safety limits and error scenarios handled once, not per market
- **Testing isolation**: Each component can be tested independently while coordination logic remains centralized

**Implementation Evidence:**

Before questioning this composition pattern, examine the actual implementation files:
- `src/core/time/internal/calendar.ts` - Review navigation algorithms and coordination logic
- `src/core/time/internal/dayCalendar.ts` - See focused trading day rules interface (DayRules)
- `src/core/time/internal/hoursCalendar.ts` - Review trading hours configuration structure (TradingHoursConfig)

The composition pattern prevents duplication of substantial algorithmic complexity across market implementations while maintaining clear separation of concerns.

## Consequences

**Positive:**
- Clear separation of concerns
- Easily testable components
- Extensible for different markets
- Clean, focused Calendar interface
- Follows composition over inheritance principle
- Calendar appropriately owns domain-specific coordination logic
- TradingDateTime provides ergonomic, type-safe public API
- Simplified dependency management for client classes (one Calendar vs. multiple components)
- **Clean API boundaries**: Calendar remains internal, TradingDateTime is the public interface
- **Controlled extensibility**: Market-specific features go through TradingDateTime factories

**Negative:**
- Slightly more classes than monolithic approach
- Requires understanding of composition pattern

## Notes

- Validated during architecture review - confirmed Calendar is appropriately focused
- Trading day navigation methods (`nextTradingDay`, `prevTradingDay`) correctly placed in Calendar as coordination logic
- Each composed component has clear, single responsibility
- Pattern supports future market expansion (different holiday calendars, trading hours)
- Design allows for easy mocking and testing of individual components
- Calendar remains mainly a coordinator, not a "god object"
- **API Design Principle**: Calendar is internal-only; all client interactions should go through TradingDateTime
- **Extension Strategy**: New market support should create new TradingDateTimeFactory instances, not expose Calendar directly
