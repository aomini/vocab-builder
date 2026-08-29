# Expo Router API Routes (SDK 57)

Server-side endpoints defined alongside your app routes using the `+api.ts` file suffix.

Canonical docs: https://docs.expo.dev/router/web/api-routes/

## Prerequisites

`app.json` must set server output (replaces any existing `"output": "static"`):

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

## File Convention

API routes live in the `app/` directory with a `+api.ts` suffix. The file path maps to the URL path.

```
src/app/api/chat+api.ts       → /api/chat
src/app/api/users/[id]+api.ts → /api/users/:id
```

Platform-specific extensions (`.web.ts`, `.ios.ts`) are NOT allowed on `+api.ts` files.

## Handler Pattern

Export named functions matching HTTP methods. Uses standard Web API `Request`/`Response` — no custom types.

```ts
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ message: "ok" });
}

export async function GET(request: Request) {
  return Response.json({ status: "healthy" });
}
```

Supported exports: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.
Unhandled methods return 405 automatically.

## Route Parameters

Dynamic segments come as the second argument:

```ts
// src/app/api/users/[id]+api.ts
export async function GET(request: Request, { id }: Record<string, string>) {
  return Response.json({ userId: id });
}
```

## Environment Variables

API routes have access to ALL `process.env` variables — not just `EXPO_PUBLIC_` prefixed ones. Secrets in `+api.ts` files are NOT included in client bundles. This is the primary reason to use API routes for LLM/third-party API calls.

```ts
// Safe — this code only runs server-side
const API_KEY = process.env.OPENAI_API_KEY;
```

Note: `expo-server` does NOT load `.env` files automatically. The hosting provider or local dev environment must inject them.

## Runtime Helpers (expo-server, SDK 54+)

```ts
import { StatusError, origin, environment, runTask, deferTask, setResponseHeaders } from "expo-server";
```

- `StatusError` — throw HTTP errors: `throw new StatusError(404, "Not found")`
- `origin()` — get server origin URL
- `environment()` — detect staging/prod
- `runTask()` / `deferTask()` — background/deferred tasks
- `setResponseHeaders()` — modify response headers

## Client-Side Usage

From app code, call the route with `fetch()` using a relative path:

```ts
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});
const data = await response.json();
```

## Dev Server

`npx expo` starts the dev server. Test API routes with:

```sh
curl http://localhost:8081/api/chat
```

## Deployment

- `npx expo export --platform web` then `eas deploy` (EAS Hosting)
- Adapters available for Express, Bun, Vercel, Netlify

## Limitations

1. No dynamic imports or native binary dependencies (e.g., `sharp`)
2. ESM transpiled to CommonJS
3. `.env` files not auto-loaded — hosting provider must inject env vars
4. No platform-specific extensions on API routes
