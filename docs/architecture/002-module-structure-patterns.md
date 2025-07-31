# ADR-002: Module Structure Patterns

## Status: Accepted

## Context

As the codebase grows, we need consistent patterns for organizing complex modules to maintain clarity, discoverability, and architectural boundaries. Without standardized module organization, we risk:

- Inconsistent public API surfaces across modules
- Internal implementation details leaking into public APIs
- Difficult navigation and poor discoverability of module capabilities
- Unclear separation between public interfaces and implementation details
- Ad-hoc organization that doesn't scale with module complexity

A reference structure is needed that emerging modules can adopt to ensure consistency while remaining flexible enough to accommodate different module requirements.

## Decision

Establish a **standardized module structure pattern** for modules in the codebase, providing a scalable organization that grows with module complexity:

1. **Top-level `index.ts`** - Curated public API gateway (always required)
2. **`types/` package** (optional) - Public type definitions and interfaces
3. **`api/` package** (optional) - Concrete implementations of public interfaces
4. **`internal/` package** (optional) - Private implementation details
5. **`constants/` package** (optional) - Module constants with public/internal separation
6. **`registry/` package** (optional) - Centralized factory/service registries
7. **`shared/` package** (optional) - Cross-layer utilities

## Rationale

### Top-Level `index.ts` - API Gateway Pattern
**Purpose**: Serves as the authoritative public API surface for the module.

**Responsibilities**:
- Export only public types, interfaces, and constants
- Provide comprehensive documentation with usage examples
- Control what external consumers can access
- Prevent internal implementation leakage

**Benefits**:
- ✅ **Clear API Boundaries**: Explicit control over public surface
- ✅ **Documentation Hub**: Single place for module usage guidance
- ✅ **Refactoring Safety**: Internal changes don't affect consumers
- ✅ **Import Simplicity**: One import path for all public functionality

### `api/` Package (Optional) - Implementation Layer
**Purpose**: Contains concrete classes and implementations of public interfaces.

**Responsibilities**:
- Implement public interfaces defined in `types/`
- Provide the actual functionality consumed through the public API
- Maintain internal consistency and coordinate with other packages
- Handle implementation-specific logic and optimizations

**Organization**:
- One file per major class/implementation
- Related implementations can be grouped in subdirectories
- Internal constructor access patterns when needed

### `types/` Package (Optional) - Interface Definitions
**Purpose**: Defines the contract layer for all public interfaces and types.

**Responsibilities**:
- Export TypeScript interfaces for public consumption
- Define type aliases and unions used in public APIs
- Provide type-only exports (no runtime code)
- Establish the contract that `api/` implementations must fulfill

**Benefits**:
- ✅ **Dependency Injection**: Enables testing and alternative implementations
- ✅ **Type Safety**: Compile-time guarantees for public contracts
- ✅ **Interface Segregation**: Clean separation of contract and implementation

### `internal/` Package (Optional) - Private Implementation
**Purpose**: Houses all private implementation details not intended for external use.

**Responsibilities**:
- Contain complex internal logic and algorithms
- Provide specialized utilities for the module's internal needs
- Implement composition patterns and internal coordination
- Handle internal state management and optimization

**Organization Guidelines**:
- Group by functional responsibility (e.g., `factories/`, `rules/`, `config/`)
- Use clear naming to indicate internal-only usage
- No exports from top-level `index.ts`

### `constants/` Package (Optional) - Shared Values
**Purpose**: Centralizes module constants with appropriate visibility control.

**Structure**:
- `public.ts` - Constants exposed through public API
- `internal.ts` - Constants for internal use only
- `index.ts` - Re-exports public constants only

**When to Use**:
- Module has significant constant values
- Clear distinction between public and internal constants
- Constants are used across multiple internal components

### `registry/` Package (Optional) - Centralized Access
**Purpose**: Provides centralized discovery and access to module factories or services.

**Responsibilities**:
- Offer unified entry points for related functionality
- Enable discoverability of available implementations
- Simplify consumer import patterns
- Support extensibility for new implementations

**Pattern Example**:
```typescript
export const ModuleRegistry = {
    ServiceA: ServiceAFactory,
    ServiceB: ServiceBFactory,
} as const;
```

### `shared/` Package (Optional) - Cross-Layer Utilities
**Purpose**: Contains utilities used across multiple packages within the module.

**Responsibilities**:
- Provide common utility functions used by both `api/` and `internal/`
- House cross-cutting concerns like validation or formatting
- Maintain utilities that don't belong in any specific layer

**Guidelines**:
- Keep minimal - avoid becoming a dumping ground
- Export only utilities genuinely needed across layers
- Consider if utilities should be promoted to `internal/` instead

## Implementation Guidelines

### Module Structure Decision Tree

**Required for all modules**:
- Top-level `index.ts` (always required - serves as public API gateway)

**Optional packages - add as module complexity grows**:
- `types/` (when module exports interfaces or complex type definitions)
- `api/` (when implementations become substantial enough to warrant separation from index.ts)
- `internal/` (when module has complex private logic requiring organization)
- `constants/` (when module has significant shared constants with public/internal separation)
- `registry/` (when module provides multiple related services/factories requiring central access)
- `shared/` (when cross-layer utilities are needed within the module)

### When to Add Each Package

**Start simple**: Begin with just `index.ts` and add packages only as complexity justifies them.

**Add `types/`** when:
- Module exports interfaces for dependency injection
- Complex type definitions need centralized documentation
- Type-only exports become numerous enough to warrant separation

**Add `api/`** when:
- Concrete implementations become too large for `index.ts`
- Multiple related implementation classes need organization
- Clear separation between interface and implementation is beneficial

**Add `internal/`** when:
- Private logic becomes complex enough to need internal organization
- Multiple internal components need coordination
- Internal algorithms or utilities warrant isolation from public API

### Import Pattern Enforcement

**✅ Allowed Import Patterns**:
```typescript
// Public API consumption
import { PublicType, PublicConstant } from './core/module';

// Internal cross-package usage (within module only)
import { InternalUtil } from '../internal/utils';
```

**❌ Prohibited Import Patterns**:
```typescript
// Direct internal access from outside module
import { InternalClass } from './core/module/internal/class'; // ❌

// Bypassing public API gateway
import { ApiClass } from './core/module/api/class'; // ❌
```

### Naming Conventions

- **Package directories**: camelCase (e.g., `api/`, `internal/`, `tradingRules/`)
- **Files within packages**: camelCase following project conventions
- **Public exports**: Follow established project naming patterns
- **Internal classes**: No special prefixing - rely on package boundaries

## Consequences

**Positive**:
- **Flexible Complexity**: Simple modules remain simple, complex modules get appropriate structure
- **Consistent Architecture**: All modules follow the same growth pattern as they evolve
- **Clear Boundaries**: Explicit separation between public and private concerns when needed
- **Discoverability**: Predictable structure aids navigation and understanding
- **Maintainability**: Changes to internal implementation don't affect public consumers
- **Testability**: Clear interfaces enable focused unit testing and mocking
- **Scalability**: Structure accommodates module growth without architectural debt
- **Documentation**: Centralized API documentation through `index.ts`
- **No Over-Engineering**: Packages added only when complexity justifies them

**Negative**:
- **Decision Overhead**: Developers must decide when to add new packages
- **Learning Curve**: Team must understand the pattern and when to apply each package
- **Potential Inconsistency**: Different modules may be at different structural maturity levels

**Trade-offs Accepted**:
- Structural complexity vs. long-term maintainability and consistency
- Initial setup time vs. ongoing development velocity
- File count vs. clear separation of concerns

## Notes

- **Start Simple**: Begin all modules with just `index.ts` and add packages incrementally as complexity grows
- **Growth Pattern**: Modules naturally evolve from simple (`index.ts` only) to complex (full package structure) as needed
- **No Premature Structure**: Avoid creating empty packages "just in case" - add them when actual complexity justifies the separation
- **Flexibility**: All packages except `index.ts` are optional - only include what adds clear value to the specific module
- **Documentation**: Each package should include clear README or inline documentation explaining its purpose
- **Evolution**: This pattern can evolve - if common needs emerge across modules, consider adding new optional packages to the pattern
- **Validation**: Regular architecture reviews should ensure pattern adherence and identify opportunities for improvement

This structure pattern prioritizes long-term maintainability, clear architectural boundaries, and consistent developer experience across the codebase while remaining flexible enough to accommodate diverse module requirements.
