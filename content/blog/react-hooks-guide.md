---
title: "React hooks: state, effects, and stale results"
description: "Working through derived state, effect cleanup, and when memoization helps."
date: "2025-01-01"
tags: ["React", "Hooks", "JavaScript", "Frontend", "Performance"]
published: true
slug: "react-hooks-guide"
---

A component can become difficult to follow even when each hook looks reasonable on its own. State feeds an effect, the effect sets more state, and another effect tries to keep the two values in sync.

Before adding a hook, check whether the value can be calculated during rendering.

## Derived values can stay in the render

For a short list, filtering doesn't need an effect or another state variable:

```tsx
import { useState } from 'react';

type Item = { id: string; name: string };

export function SearchList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.toLowerCase();
  const matches = items.filter(item =>
    item.name.toLowerCase().includes(normalizedQuery),
  );

  return (
    <>
      <label>
        Search
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul>
        {matches.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </>
  );
}
```

There is one changing value to track: `query`. `matches` follows from it and the current props. Storing both would create a synchronization job the component doesn't need. React's [guide to unnecessary effects](https://react.dev/learn/you-might-not-need-an-effect) works through this distinction in more detail.

When an update depends on the previous state, pass an updater: `setCount(count => count + 1)`. React can apply it to the pending state instead of a value captured by an earlier render.

## An effect needs a cleanup story

Subscriptions, timers, and network requests involve something outside React. An effect can manage that connection, but it needs to account for a changed dependency or an unmounted component.

Consider a user switching quickly between two records. The first request may finish after the second. Without cleanup, its response can replace the record the user just selected.

This hook assumes an API returning `{ name: string }`:

```tsx
import { useEffect, useState } from 'react';

type UserState =
  | { userId: string; status: 'loading' }
  | { userId: string; status: 'ready'; name: string }
  | { userId: string; status: 'error'; message: string };

export function useUser(userId: string): UserState {
  const [state, setState] = useState<UserState>({ userId, status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ userId, status: 'loading' });

    async function load() {
      try {
        const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data: unknown = await response.json();
        if (!data || typeof data !== 'object' ||
            !('name' in data) || typeof data.name !== 'string') {
          throw new Error('Response is missing a name');
        }
        if (!controller.signal.aborted) {
          setState({ userId, status: 'ready', name: data.name });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            userId,
            status: 'error',
            message: error instanceof Error ? error.message : 'Request failed',
          });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [userId]);

  return state.userId === userId ? state : { userId, status: 'loading' };
}
```

The dependency is `userId`, because it determines which resource the effect loads. Cleanup aborts the previous request. Checking the signal before updating state also prevents an abandoned request from setting the result. Keeping the ID with the result avoids showing the previous user's data in the render before the new effect starts.

This is enough to explain the race. An application may also need caching, retries, or server rendering; a framework's data-loading facilities can handle those concerns without rebuilding them in every component.

## A custom hook shares behavior

Extracting `useUser` gives callers the same request and cleanup behavior. Each call still owns its own state. Two components calling it don't automatically share a cache or a request.

`useContext` reads a value supplied by a provider. `useReducer` groups related state transitions in one function. These solve different problems; adding either won't fix an effect with a missing dependency.

Call ordinary hooks at the top level of a component or custom hook, before conditional returns. Their order must remain consistent between renders.

## Measure before memoizing

`useMemo` caches a calculation between renders when its dependencies haven't changed. `useCallback` preserves a function reference under the same condition. Neither prevents every render, and a newly created object in the dependency list can defeat the cache.

For a slow interaction, profile the component first. If filtering is expensive, memoization may help. If rendering thousands of rows is expensive, caching the filter won't remove that cost. A deferred value or a transition can change which updates React prioritizes, but it doesn't make synchronous JavaScript inside your callback run on a worker thread.

For the request example, a useful test changes `userId` while the first response is pending, resolves responses in reverse order, and checks which name appears. A test that only verifies the initial loading state misses the failure this hook is meant to prevent.
