---
title: "Code that is easier to change"
description: "Notes on naming, validation, types, and the cost of splitting code into smaller pieces."
date: "2025-01-01"
tags: ["Clean Code", "Software Development", "Best Practices", "Code Quality"]
published: true
slug: "clean-code-principles"
---

A useful code review question is: where would the next change go?

If changing an order discount means editing three handlers, the rule is scattered. If understanding one handler means opening twelve files, splitting it up has created a different problem. Line count doesn't tell you much about either case.

## Name the quantity

`calculateTotal(price, tax)` leaves a question for the caller: is `tax` a rate or an amount? Units make a better name possible.

```typescript
function totalCents(subtotalCents: number, taxCents: number): number {
  return subtotalCents + taxCents;
}
```

The function is almost trivial. The names do most of the work. The same applies to `timeoutMs`, `temperatureC`, and `sampleRateHz`: they keep a conversion error from hiding behind a perfectly reasonable variable name.

A name can still become too long. It should tell the reader what they need at the call site, without copying the implementation into the identifier.

## Keep a rule in one place

Suppose both account creation and account editing require a name of at least two characters. They should agree on what counts as a valid name. A shared validator makes that agreement explicit:

```typescript
type NameResult =
  | { ok: true; name: string }
  | { ok: false; message: string };

function parseName(input: string): NameResult {
  const name = input.trim();
  if (name.length < 2) {
    return { ok: false, message: 'Name must contain at least two characters' };
  }
  return { ok: true, name };
}
```

This example counts JavaScript string code units. That may be the wrong rule for a real application's names, but now there's one place to change it.

Similar-looking code doesn't always represent the same rule. A public registration form and an administrator's import tool may have different requirements. Combining them too early tends to produce a validator with an expanding list of flags.

## Split calculations from side effects

An order handler may need to validate an order, calculate a price, save it, and send a confirmation. Keeping those steps in one coordinating function can make the sequence easier to follow. The calculation is a useful part to extract because it can run without a database or mail service.

```typescript
type LineItem = { unitPriceCents: number; quantity: number };

function subtotalCents(items: readonly LineItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
}
```

The caller still needs to validate quantities and prices. Using integer cents avoids fractional-cent arithmetic in this example; it doesn't establish a rounding policy for tax, currency conversion, or discounts.

Now a test can state a concrete expectation:

```typescript
expect(subtotalCents([
  { unitPriceCents: 1000, quantity: 2 },
  { unitPriceCents: 500, quantity: 1 },
])).toBe(2500);
```

Extracting a function should make something easier to understand or test. A wrapper that only forwards its arguments may add another name to remember without hiding any complexity.

## Let the type describe the outcome

The `NameResult` union puts the parsed name on the success branch and the error message on the failure branch. A caller checks `ok` before using either. Compare that with an object containing three optional fields: the latter allows combinations the program never intends to produce.

Use that distinction for expected failures, such as invalid input. Database outages need a different response from a short name. Turning both into `null` makes the caller guess what happened.

Types also stop at runtime boundaries. An HTTP request doesn't become valid because the handler casts its body to an interface. Parse it at the boundary, then pass the checked value inward.

## Review the behavior before the formatting

A formatter can settle indentation. It can't decide whether an order should be saved before sending an email, or what happens if saving succeeds and email fails.

For that handler, review the failure paths as carefully as the successful one. Can a retry place the order twice? Can the user see a confirmation for an order that wasn't saved? Those questions are more useful than enforcing a maximum function length.

The TypeScript handbook has a [worked explanation of discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions), including how narrowing lets callers handle each case.
