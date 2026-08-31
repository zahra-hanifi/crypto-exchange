# Crypto Exchange

A cryptocurrency market dashboard built with Nuxt.js and Tailwind CSS. Browse live market data for the top coins by market cap, search across the list, and drill into any coin for detailed market stats and a price history chart.

**[Live demo →](https://crypto-exchange-six-kappa.vercel.app/)**

> _Screenshot goes here — add one before publishing._

---

## Why I built this

I work on real-time trading interfaces professionally, and I wanted a small, self-contained project where I could focus on the parts of that work that are easy to get wrong: request handling, loading states, and rendering a long list without the page falling over.

The scope is deliberately narrow. The interesting parts are in the data layer and the component layer, not the feature list.

---

## What's actually interesting here

### Request deduplication in the API layer

The API client keeps a map of in-flight requests keyed by URL and params. If the same request is asked for while one is already in flight, the existing promise is returned instead of firing a second network call.

```js
const key = url + (config.params ? JSON.stringify(config.params) : '')

if (apiPromisesCache.has(key)) {
  return apiPromisesCache.get(key)
}

const promise = apiCallerInstance.get(url, config)
apiPromisesCache.set(key, promise)
promise.finally(() => apiPromisesCache.delete(key))
```

This matters when several components mount at once and each asks for data it needs — a common source of duplicate calls. It's the same idea libraries like TanStack Query implement; here it's about 15 lines in the API plugin.

**Trade-off:** this deduplicates concurrent requests only, and intentionally doesn't cache responses. Market data goes stale fast, so a completed request is dropped from the map immediately. Caching results would need a staleness policy, which this project doesn't have.

### A layered API client, not scattered `axios` calls

Requests go through three layers: a `services/api` module that describes the endpoints, an `apiCaller` that handles URL normalization and deduplication, and a Nuxt plugin that injects the whole thing as `$api`.

Components never touch `axios` directly. Swapping the HTTP client, adding interceptors, or changing the base URL happens in one place. The `apiCaller` also supports multiple axios instances, so a second API with different auth or base URL can be added without touching call sites.

### Shared component layer

`CTable`, `CSkeleton`, `CTabs`, `CIcon`, and `DataLoader` are built as a small reusable set rather than one-off markup.

`CTable` is the one worth looking at: every column renders through a named scoped slot, so the table stays presentational and callers control formatting completely. Column alignment, sticky headers, empty states, and a separate mobile card layout are all handled through the same API.

`DataLoader` wraps the loading/loaded branch so skeleton states stay consistent across pages instead of every component inventing its own.

This is a small version of the design system work I do at my day job — components with a variant API, not components with twenty props.

### Rendering long lists

The coin list renders 20 rows initially and appends the next 20 as the user reaches the bottom of the scroll container. Search bypasses the windowing and filters the full set, since a filtered result is normally short.

Skeleton placeholders match the height of the real rows, so content doesn't jump when data arrives.

### Chart integration

Price history is rendered with Chart.js on a `canvas`. Third-party libraries that own their own DOM need to be kept outside the framework's reactivity — the chart instance is held on the component and configured once, not rebuilt on re-render.

---

## Tech stack

| | |
|---|---|
| Framework | Nuxt.js 2 (universal mode) |
| Styling | Tailwind CSS |
| Charts | Chart.js |
| HTTP | Axios, wrapped in a custom API layer |
| State | Vuex |
| Images | `@nuxt/image` |
| Data source | CoinGecko public API |
| Deployment | Vercel, statically generated (`nuxt generate`) |
| Tooling | ESLint, Prettier, EditorConfig |

---

## Architecture

```
services/api/     endpoint definitions, grouped by domain
plugins/api.js    axios instances, URL normalization, request dedup
store/            Vuex modules — server data and loading flags
components/
  shared/         reusable primitives (CTable, CSkeleton, CTabs, CIcon)
  ...             feature components
pages/            file-based routes
utils/helpers.js  formatting and debounce
```

Server data lives in Vuex; view state (search term, how many rows are shown) stays local to the page that owns it.

The list page fetches through `asyncData`, so the initial markup is rendered with data already in place rather than showing an empty shell and filling it in on the client.

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Set the API base URL:

```bash
API_BASE_URL=https://api.coingecko.com/api/v3
```

```bash
npm run build      # static build
npm run lint
```

---

## What I'd do differently

Worth being explicit about the gaps, since they're deliberate rather than overlooked:

- **Error handling is not user-facing.** Failed requests are logged to the console and the UI shows an empty state. It should surface a real error message with a retry action.
- **No tests.** Given the scope this was a conscious trade-off, but `getCoinChangeData` and `insertComma` are pure functions with edge cases and are exactly what unit tests are for.
- **Nuxt 2 / Vue 2.** The project predates my move to Nuxt 3; the API layer would port with almost no changes.
- **Windowing is append-only.** Rows are added but never removed, so the DOM grows without bound on a long scroll. For a list this size it's fine; for thousands of rows it would need real virtualization.
- **No caching policy.** Deduplication handles concurrent calls, but there's no stale-while-revalidate layer, so navigating back to the list always refetches.

---

## License

MIT
