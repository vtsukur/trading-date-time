# ADR-001: Core Naming Conventions

## Status: Accepted

## Context

Consistent naming conventions are critical for maintainable codebases. During development and code review, several naming decisions were made that need to be captured to prevent future inconsistencies.

## Decision

Establish the following naming conventions for the trading date-time library:

### Multi-Word Term Naming
- **Human-readable strings**: Use separate words (e.g., "time frame", "trading day", "market data")
- **Type/Class names**: Use PascalCase (e.g., `TimeFrame`, `TradingDay`, `MarketData`)
- **Variable names**: Use camelCase (e.g., `timeFrame`, `tradingDay`, `marketData`)

### Factory Pattern
- **Factory Classes**: Use `*Factory` suffix (e.g., `TradingDateTimeFactory`)
- **Factory Instances**: Use descriptive names without redundant "Factory" (e.g., `USEquitiesTradingDateTimeFactory`)
- **Registry Access**: Use `MarketsTime.MarketName` pattern

### File Naming
- **TypeScript Files**: Use camelCase (e.g., `tradingDateTime.ts`, `tradingDateTimeFactory.ts`)
- **Directory Names**: Use camelCase for consistency with file naming
- **Never Use PascalCase**: Avoid PascalCase file names (e.g., ~~`TradingDateTime.ts`~~, ~~`TradingDateTimeFactory.ts`~~) - this note is for you, Cursor!

### Type Safety
- **Private Fields**: No underscore prefixes (rely on TypeScript `private`)
- **Boolean Properties**: Use descriptive names like `initialized` (not `_isInitialized`)
- **Getter Methods**: Can be verbose like `isInitialized()` for clarity

## Rationale

**Multi-Word Term Naming:**
- ✅ Separate words read naturally in logs and error messages (e.g., "time frame", "trading day")
- ✅ Follows English language conventions for human-readable text
- ✅ Distinguishes user-facing text from code identifiers
- ✅ Consistent pattern applicable to all multi-word domain terms

**Factory Naming:**
- ✅ Clear pattern that scales across markets
- ✅ Consistent with existing codebase patterns
- ✅ Balances brevity with descriptiveness

**File Naming:**
- ✅ Consistent camelCase pattern across all files and directories
- ✅ Avoids filesystem case sensitivity issues on different operating systems
- ✅ Aligns with modern JavaScript/TypeScript project conventions
- ✅ Clear distinction between file names (camelCase) and exported types (PascalCase)

**TypeScript-First Approach:**
- ✅ Leverages TypeScript's type system for safety
- ✅ Cleaner, more readable code
- ✅ Modern JavaScript/TypeScript conventions

## Consequences

**Positive:**
- Consistent naming across entire codebase
- Clear distinction between code and human-readable text
- Leverages TypeScript features effectively
- Scalable patterns for future development

**Negative:**
- Requires discipline to maintain consistency
- May require refactoring existing inconsistent names

## Notes

- Validated across all tests - all naming conventions applied consistently
- Factory naming pattern successfully scaled with MarketsTime registry
- Multi-word term conventions improve user experience in logs and error messages
- Private field convention aligns with modern TypeScript best practices
- File naming convention prevents filesystem case sensitivity conflicts and tooling issues
