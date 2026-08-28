# Vocab Builder

Cross-platform mobile vocabulary builder with a chat-like LLM interface and Leitner-based spaced repetition flashcards.

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Stack

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

## Verification

- After code change, verify with below commands:
  - `npm run lint`
  - `npm run ios`
  - `npm run web`
  - `npm run android`
- Fix the lint and issues until all the above commands runs successfully.

## Conventions

- All features should run properly in web, ios & android.
- Styling: CSS via `nativewind` + React Native Stylesheet where needed.
- Platform-specific files use `.web.tsx` / `.ios.tsx` / `.android.tsx` suffixes.
- Component filenames are kebab-case (e.g. `themed-text.tsx`).
- UI library: `@expo/ui` for built-in components.
- Navigation: expo-router file-based routing — add screens as files in `src/app/`.

## Key Docs

- `docs/project.md` — Product spec, core user flow, technical constraints, and decisions.
- `docs/flashcard-implementation.md` — Leitner box system data model, progression logic, and edge cases.
