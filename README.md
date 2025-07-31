# Trading Date Time

Interface for timezone-aware trading timestamp with market calendar support

## Overview

Trading Date Time is a TypeScript library that provides timezone-aware trading time functionality designed specifically for financial markets. Unlike standard date/time libraries, this module understands trading calendars, market hours, and business day calculations essential for trading applications.

## Features

- **Built on Luxon Foundation**: Powered by Luxon's proven date/time engine for reliability and performance
- **Trading Domain Awareness**: Knows about market holidays, early close days, and trading sessions
- **Timezone Handling**: Automatically handles market-specific timezones (e.g., America/New_York for US equities)
- **Business Day Navigation**: Provides next/previous trading day functionality
- **Trading Hours Validation**: Validates trading hours for different session types

## Installation

```bash
npm install trading-date-time
```

## Quick Start

```typescript
import { MarketsTime } from 'trading-date-time';

// Create a trading timestamp for US Equities market
const marketOpen = MarketsTime.USEquities.fromISO('2024-03-15T09:30:00');

// Check if it's a trading day
console.log(marketOpen.isOnTradingDay()); // true

// Get the date string
console.log(marketOpen.toISODate()); // "2024-03-15"

// Navigate to next trading day
const nextTradingDay = marketOpen.toNextTradingDay();
console.log(nextTradingDay.toISODate());
```

## API Reference

### MarketsTime

Primary registry for creating market-specific instances.

#### MarketsTime.USEquities

Factory for US Equities market (America/New_York timezone).

```typescript
// Create from ISO string
const time = MarketsTime.USEquities.fromISO('2024-03-15T09:30:00');

// Create from milliseconds
const time = MarketsTime.USEquities.fromMillis(1710504600000);

// Create from current time
const time = MarketsTime.USEquities.now();
```

### TradingDateTime Interface

```typescript
interface TradingDateTime {
  // Trading-specific methods
  isOnTradingDay(): boolean;
  toNextTradingDay(): TradingDateTime;
  toPreviousTradingDay(): TradingDateTime;

  // Date/time methods
  toISODate(): string | null;
  toMillis(): number;

  // Comparison methods
  equals(other: TradingDateTime): boolean;
  // ... and more
}
```

### Trading Hours

```typescript
import { MarketsTime, REGULAR_HOURS, EXTENDED_HOURS } from 'trading-date-time';

const time = MarketsTime.USEquities.fromISO('2024-04-12T07:00:00');

// Check different trading sessions
console.log(time.isDuringTradingHours(REGULAR_HOURS));   // false (pre-market)
console.log(time.isDuringTradingHours(EXTENDED_HOURS));  // true (extended hours)
```

## Supported Markets

Currently supports:
- **US Equities**: America/New_York timezone with full holiday and early close calendar

## Requirements

- Node.js 16 or higher
- TypeScript 4.5 or higher (for TypeScript projects)

## Dependencies

- [Luxon](https://moment.github.io/luxon/) - Mature, powerful, and friendly wrapper for JavaScript dates and times

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.