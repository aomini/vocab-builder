# Vocab Builder

A cross-platform mobile vocabulary builder. Users ask about a word or phrase in a chat-like interface, powered by an LLM. Definitions are optimized for retention via flashcards using spaced repetition.

**Core loop:** Ask → Get definition/explanation → Save to flashcard deck → Review on schedule.

## Core User Flow

1. User opens app, types a word/phrase/sentence.
2. LLM returns a scoped definition.
3. User can save the result as a flashcard.
4. User reviews due flashcards (spaced repetition).

## Technical Constraints

- **Token limits**: user is capped at 20k tokens/day and 100k tokens/week.
- **Context window**: session context capped at 20k tokens. New session should be requested.
- **LLM scope enforcement**: system prompt restricts the model to vocab/meaning queries only.
- **Definition source**: LLM-generated.

## Decisions

- **Flashcard algorithm — Leitner vs SM-2**: Chose Leitner for MVP. SM-2 gives better long-term retention via per-card ease factors, but requires more state. Leitner needs only a box number + last review date, matching MVP simplicity goals.
- **LLM API requests restricted to `api/`**: Provides a level of abstraction; system prompts live in `api/`.
