# ADR-006: MarketsTime Registry Pattern

## Status: Accepted

## Context

The time package had a "factory explosion" problem where each market required its own factory import:
```typescript
import { USEquitiesTradingDateTimeFactory } from './markets/usEquities';
import { EuropeanEquitiesTradingDateTimeFactory } from './markets/europeanEquities';
// ... more markets = more imports
```

This made market discovery difficult and import paths verbose. A centralized access pattern was needed.

## Decision

Implement a **MarketsTime registry** that provides centralized access to all market-specific factories:

```typescript
import { MarketsTime } from '../core/time/markets';

const nyTime = MarketsTime.USEquities.fromISO('2024-01-15T09:30:00');
const londonTime = MarketsTime.EuropeanEquities.fromISO('2024-01-15T09:30:00');
```

## Rationale

**Registry Pattern Benefits:**
- ✅ **Central Discovery**: All markets accessible through one import
- ✅ **Consistent Access**: `MarketsTime.MarketName` convention
- ✅ **Shorter Imports**: Single import vs. multiple market-specific imports
- ✅ **Future-Proof**: Easy to add new markets without changing consumer code
- ✅ **IDE Support**: Better autocomplete and discoverability

**Alternative Considered - Individual Imports:**
- ❌ Verbose import paths
- ❌ No central discovery mechanism
- ❌ Scales poorly with new markets
- ❌ Easy to forget available markets

**Alternative Considered - Complex Type System:**
- ❌ Over-engineering for current needs
- ❌ Added complexity without clear benefit
- ❌ Harder to understand and maintain

## Consequences

**Positive:**
- Single import for all market access
- Clear, discoverable API surface
- Scales well with new markets
- Maintains full type safety
- Backwards compatible migration path

**Negative:**
- One additional level of indirection
- Requires updating existing imports

## Notes

- Implemented as `const` assertion for full type safety
- Keeps individual factory exports for internal use
- No additional types (SupportedMarket, MarketTimeFactory) to maintain simplicity
- Pattern successfully tested across entire codebase
- Can be extended for new markets without breaking existing code
