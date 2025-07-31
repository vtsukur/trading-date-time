# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the trading backtester project. ADRs capture important architectural decisions, their context, and rationale to prevent re-litigation of settled design choices.

## Organization Structure

ADRs are organized by scope to improve navigation and maintain clear ownership:

```
docs/architecture/
├── project/          # Project-wide decisions
├── modules/          # Module-specific decisions
│   └── core/
│       └── time/     # Core time module decisions
├── templates/        # ADR templates
└── README.md        # This file
```

## Quick Access

### [Project-Level ADRs](./project/README.md)
Decisions affecting the entire codebase and cross-cutting concerns.

| ADR | Title | Status |
|-----|-------|--------|
| [P001](./project/P001-naming-conventions.md) | Core Naming Conventions | Accepted |
| [P002](./project/P002-module-structure-patterns.md) | Module Structure Patterns | Accepted |

### [Module-Level ADRs](./modules/README.md)
Decisions specific to individual modules and their internal architecture.

#### Core Time Module
| ADR | Title | Status |
|-----|-------|--------|
| [T001](./modules/core/time/T001-trading-date-time-public-api.md) | TradingDateTime as Public API | Accepted |
| [T002](./modules/core/time/T002-unified-api-design.md) | TradingDateTime Unified API Design | Accepted |
| [T003](./modules/core/time/T003-calendar-composition-pattern.md) | Calendar as Composition Coordinator | Accepted |
| [T004](./modules/core/time/T004-markets-time-registry.md) | MarketsTime Registry Pattern | Accepted |

## ADR Scope Guidelines

### Project-Level ADRs (P-prefix)
Use for decisions that:
- Establish codebase-wide conventions
- Define cross-module architectural patterns
- Set technology stack standards
- Create project infrastructure decisions

### Module-Level ADRs (Module-prefix)
Use for decisions that:
- Define module-specific patterns
- Design internal component interactions
- Establish module extension strategies
- Document domain-specific architectural choices

## Numbering Conventions

- **Project ADRs**: `PNNN-title.md` (e.g., `P001-naming-conventions.md`)
- **Module ADRs**: `[M]NNN-title.md` where M is the module identifier
  - `T` = core/time module
  - `I` = indicators module
  - `S` = strategies module
  - `O` = ohlcv/data module

## Creating New ADRs

### For Project-Wide Decisions
1. Use template: [project-adr-template.md](./templates/project-adr-template.md)
2. Place in `project/` directory with P-prefix numbering
3. Update [project README](./project/README.md)
4. Update this README

### For Module-Specific Decisions
1. Use template: [module-adr-template.md](./templates/module-adr-template.md)
2. Place in appropriate `modules/[module-path]/` directory
3. Update module README
4. Update this README if it's a new module

## ADR Lifecycle

**Status Values:**
- **Proposed**: Under consideration
- **Accepted**: Approved and implemented
- **Rejected**: Considered but not adopted
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by newer ADR

## Guidelines

- **File naming**: Use kebab-case for titles (e.g., `P001-naming-conventions.md`)
- **Keep focused**: Each ADR should address one decision
- **Include evidence**: Document how decisions were validated
- **Link related ADRs**: Reference dependencies and related decisions
- **Update status**: Keep ADR status current as implementations evolve

## Templates

- [Project ADR Template](./templates/project-adr-template.md) - For project-wide decisions
- [Module ADR Template](./templates/module-adr-template.md) - For module-specific decisions

## Architecture Overview

The trading backtester follows a modular architecture with clear separation between:

- **Project-level standards** ensuring consistency across all modules
- **Module-specific patterns** optimized for each domain's unique requirements
- **Public API boundaries** controlling what consumers can access
- **Internal implementation freedom** allowing modules to evolve independently

This ADR organization reflects and supports this architectural approach by providing appropriate decision-making contexts for both cross-cutting and domain-specific concerns.