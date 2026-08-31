# Project Overview

A cross-platform (React Native / Flutter) mobile vocabulary builder. Users ask about a word or phrase in a chat-like interface, powered by an LLM. Definitions are optimized for retention via flashcards using spaced repetition.

_Core loop: Ask → Get definition/explanation → Save to flashcard deck → Review on schedule._

## Core User Flow

1. User opens app, types a word/phrase/sentence.
2. LLM returns a definition scoped.
3. User can save the result as a flashcard.
4. User reviews due flashcards (spaced repetition).

## Technical Constraints

- **Token limits**: user is capped at 20k tokens/day and 100k tokens/week
- **Context window**: session context capped at 20k tokens. New session should be requested.
- **LLM scope enforcement**: system prompt (and optionally a lightweight classifier) restricts the model to vocab/meaning queries only.
- **Definition source**: LLM-generated.

## Decisions

- **Flashcard algorithm — Leitner vs SM-2**: Chose Leitner for MVP.
  SM-2 gives better long-term retention via per-card ease factors, but
  requires more state (ease factor, iterval, repetition count) and a
  more involved update formula. Leitner needs only a box number + last
  review date, matching MVP simplicity goals. Revisit SM-2 once there's
  real usage data justifying the added complexity.
- **Requesting LLM - LLM api request is only allowed to be made from api/**: This allows a level of abstraction and system prompts should live in api/.

# Features

- Users should be able to ask questions related to vocabs or understand meaning.
- User should be able to create new chat windows & delete old ones.
- User should be able to view chat history.
- User should be able to read through flashcards, reviewed on a spaced-repetition schedule.
- App should figure out longer unsure questions and looks up meaning for that.
- The LLM streamed response should be properly displayed parsing the markdown.
- User should be able to stop llm response.

# Design System

@docs/design-system.yaml
