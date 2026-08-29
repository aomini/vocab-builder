# Vocab Builder

Cross-platform mobile vocabulary builder with a chat-like LLM interface and Leitner-based spaced repetition flashcards.

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Startup Workflow

Before writing Code:

- Read feature_list.json and choose the highest-priority unfinished feature.
- Review recent commits with git log --oneline -5.

## Working Rules

- Work on one feature at a moment.
- Do not mark a feature complete just because code was added.
- Prefer durable repo artifacts over chat summaries.
- Do not silently change verification rules during implementation.
- Do not remove or weaken tests just to make the task look complete.
- NEVER read `.env` or `.env.local` files. These contain secrets and must not be accessed by any agent.

## Definition Of Done

A feature is done only when all of the following are true:

- the target behavior is implemented
- the required verification actually ran
- evidence is recorded in `feature_list.json` with status passing
- the repository remains restartable from the standard startup path

## End Of Session

Before ending a session:

1. Update `feature_list.json`.
2. Record any unresolved risk or blocker.
3. Commit with a descriptive message once the work is in a safe state.
4. Leave the repo clean enough for the next session to run
   immediately.

## Stack

Expo SDK 57, React Native 0.86, React 19, TypeScript 6, expo-router v57 (file-based routing).

Managed workflow — no bare native code. Config lives in `app.json`.

Experiments enabled: `typedRoutes`, `reactCompiler`.

## Commands

- `npm start` — dev server (Expo Go or dev client)
- `npm run ios` — start on iOS simulator
- `npm run android` — start on Android emulator
- `npm run web` — start web
- `npm run lint` — eslint via `expo lint`

## Structure

```
src/
  app/          — file-based routes (expo-router)
  components/   — shared UI components
  components/ui/ — low-level reusable primitives
  constants/    — theme, config values
  hooks/        — custom React hooks
assets/         — images, fonts, icons
```

## Conventions

- Environment variables can only be accessed with process.env in expo api routes and in app ui env variables should be prefixed with EXPO_PUBLIC_.
- All features should run properly in web, ios & android.
- Styling: CSS via `nativewind` + React Native Stylesheet where needed.
- Platform-specific files use `.web.tsx` / `.ios.tsx` / `.android.tsx` suffixes.
- Component filenames are kebab-case (e.g. `themed-text.tsx`).
- UI library: `@expo/ui` for built-in components.
- Always prefer type over interfaces when creating types.
- Class Interpolation: use the `src/app/utils/cn.ts` to resolve classnames. Also, use `{'active': true}` conditional approach.
- Navigation: expo-router file-based routing — add screens as files in `src/app/`.<D-s>

## Dependencies

- Ask permission before adding new dependency.

## Verification

- After code change, verify with below commands:
  - `npm run lint`
  - `npm run ios`
  - `npm run web`
  - `npm run android`
- Fix the lint and issues until all the above commands runs successfully.
- For iOS simulator UI verification, follow `docs/ios-simulator-verification.md` (use screenshots + deep links, not tap commands).

## Key Docs

- `docs/project.md` — Product spec, core user flow, technical constraints, and decisions.
- `docs/flashcard-implementation.md` — Leitner box system data model, progression logic, and edge cases.
- `docs/expo-api-routes.md` — Expo Router API routes reference (file conventions, handler pattern, env vars, deployment).
- `docs/ios-simulator-verification.md` — CLI steps for verifying UI on iOS simulator (screenshots, deep links, gotchas).
