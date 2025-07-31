# ADR Compliance Evaluation Checklist

## Purpose
Systematic framework for deterministic evaluation of code against ADRs. Use this checklist to ensure consistent, repeatable analysis.

## How to Use
- Check EVERY item systematically
- Mark each with ✅ PASS, ❌ FAIL, or ⚠️ REVIEW
- A file only passes if ALL items are ✅ PASS
- Document specific issues found for any ❌ FAIL or ⚠️ REVIEW
- **CRITICAL**: Double-check all ❌ FAIL items before reporting to ensure they represent actual issues, not misapplication of criteria

## ADR 002: Module Structure Patterns

### Required Elements
- [ ] **API Gateway**: Top-level index.ts serves as public API gateway
- [ ] **Export Control**: Only public interfaces exported from index.ts
- [ ] **Documentation**: Comprehensive docs with usage examples
- [ ] **Import Patterns**: Examples show project-relative import paths
- [ ] **Package Organization**: Correct usage of api/, types/, internal/, etc.

### Documentation Quality
- [ ] **Self-Contained**: All examples include necessary imports
- [ ] **Accurate**: Examples use only verified API methods
- [ ] **Consistent**: Similar detail level across all examples
- [ ] **Realistic**: Import paths use appropriate project-relative paths (e.g., 'src/core/time')
- [ ] **Complete**: No missing context or broken references

## ADR 004: Unified API Design

### Core Principles
- [ ] **Unified Interface**: Single type for trading + date/time operations
- [ ] **Method Chaining**: Examples demonstrate fluent API usage
- [ ] **No Type Switching**: Examples avoid object unwrapping patterns
- [ ] **Escape Hatch**: Proper documentation of dateTime property access
- [ ] **Trading Focus**: Examples emphasize trading domain operations

### Example Quality
- [ ] **API Benefits**: Clear demonstration of unified API advantages
- [ ] **Error Handling**: Proper exception and null value handling
- [ ] **Workflow Completeness**: Examples show start-to-finish operations
- [ ] **Domain Specificity**: Uses trading-specific variable names and patterns

## ADR 001: Naming Conventions

### Consistency Checks
- [ ] **File Names**: camelCase for all files (never PascalCase)
- [ ] **Variable Names**: Contextually appropriate names for each example's domain (not forced consistency across different contexts)
- [ ] **Terminology**: Consistent use of trading terms
- [ ] **Human-Readable**: Proper spacing in console output and strings
- [ ] **Type Safety**: No underscore prefixes, proper boolean naming

## Technical Accuracy

### API Verification
- [ ] **Method Existence**: All called methods exist in actual API
- [ ] **Return Types**: Proper handling of nullable return values
- [ ] **Parameter Types**: Correct parameter usage for all method calls
- [ ] **Error Scenarios**: Realistic error handling for actual failure modes

### Code Quality
- [ ] **Syntax**: All examples are syntactically correct
- [ ] **Imports**: All imported items are actually exported, using project-relative paths
- [ ] **Types**: TypeScript usage is accurate and complete
- [ ] **Null Safety**: Proper handling of potential null/undefined values

## Documentation Standards

### Content Quality
- [ ] **Purpose Clarity**: Clear explanation of what module provides
- [ ] **Beginner Context**: Accessible to developers new to trading
- [ ] **Advanced Patterns**: Shows sophisticated usage for experienced users
- [ ] **Complete Workflows**: End-to-end examples of real use cases

### Structure Quality
- [ ] **Logical Organization**: Information flows logically
- [ ] **Appropriate Complexity**: Examples match their context
- [ ] **No Redundancy**: Information not duplicated across sections
- [ ] **Clear Hierarchy**: Good use of headings and sections

## Final Validation

### Completeness Check
- [ ] **All Exports Documented**: Every export has appropriate documentation
- [ ] **All ADRs Addressed**: No architectural decisions ignored
- [ ] **No Assumptions**: No unverified claims about behavior
- [ ] **Production Ready**: Safe for developers to copy/paste examples

### Review Process
- [ ] **Systematic Review**: All checklist items evaluated
- [ ] **Issue Documentation**: Specific problems identified for any failures
- [ ] **Verification**: Claims verified against actual implementation
- [ ] **Consistency**: Same standards applied throughout
- [ ] **Double-Check Failures**: Re-examine any ❌ FAIL items to ensure they are actual issues, not evaluation errors

## Scoring
- **PASS**: All items ✅ PASS
- **FAIL**: Any item ❌ FAIL
- **REVIEW NEEDED**: Any item ⚠️ REVIEW

Only files scoring **PASS** should be considered complete.
