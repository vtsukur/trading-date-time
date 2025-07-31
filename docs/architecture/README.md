# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the trading-date-time library. ADRs capture important architectural decisions, their context, and rationale to prevent re-litigation of settled design choices.

## Organization Structure

ADRs are organized in a flat structure for simplicity:

```
docs/architecture/
├── 001-naming-conventions.md
├── 002-module-structure-patterns.md
├── 003-trading-date-time-public-api.md
├── 004-unified-api-design.md
├── 005-calendar-composition-pattern.md
├── 006-markets-time-registry.md
├── evaluation-checklist.md
└── README.md
```

## Architecture Decision Records

| ADR | Title | Status |
|-----|-------|--------|
| [001](./001-naming-conventions.md) | Core Naming Conventions | Accepted |
| [002](./002-module-structure-patterns.md) | Module Structure Patterns | Accepted |
| [003](./003-trading-date-time-public-api.md) | TradingDateTime as Public API | Accepted |
| [004](./004-unified-api-design.md) | Unified API Design | Accepted |
| [005](./005-calendar-composition-pattern.md) | Calendar as Composition Coordinator | Accepted |
| [006](./006-markets-time-registry.md) | MarketsTime Registry Pattern | Accepted |

## Creating New ADRs

1. Use sequential numbering (007-, 008-, etc.)
2. Follow naming pattern: `NNN-kebab-case-title.md`
3. Update the table above with the new ADR
4. Include proper ADR sections: Status, Context, Decision, Consequences

## ADR Lifecycle

**Status Values:**
- **Proposed**: Under consideration
- **Accepted**: Approved and implemented
- **Rejected**: Considered but not adopted
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by newer ADR

## Guidelines

- **File naming**: Use kebab-case for titles (e.g., `001-naming-conventions.md`)
- **Keep focused**: Each ADR should address one decision
- **Include evidence**: Document how decisions were validated
- **Link related ADRs**: Reference dependencies and related decisions
- **Update status**: Keep ADR status current as implementations evolve

## Architecture Overview

The trading-date-time library follows a modular architecture with clear separation between:

- **Core standards** ensuring consistency across all modules (ADR 001-002)
- **API design patterns** defining public interfaces and user experience (ADR 003-004)
- **Implementation patterns** governing internal structure and composition (ADR 005-006)
- **Public API boundaries** controlling what consumers can access
- **Internal implementation freedom** allowing modules to evolve independently

These ADRs document the key architectural decisions that shape the library's design and implementation approach.