# Flashcard System: Leitner-Based Spaced Repetition

Technical spec for the MVP flashcard review system.

---

## 1. Data Model

```
Flashcard {
  id:               string (UUID)
  user_id:          string (FK)
  word:             string
  definition:       string
  example_sentence: string | null
  box:              integer (1-5, default 1)
  last_review_date: date | null
  next_review_date: date (defaults to creation date)
  created_at:       timestamp
  updated_at:       timestamp
}
```

Notes:
- `box` is the only spaced-repetition state needed. No ease factor, no interval history.
- `next_review_date` is precomputed on each review so the query for due cards is a simple date comparison.
- `last_review_date` is null until the card is reviewed for the first time.

---

## 2. Leitner Box System

| Box | Meaning | Review Interval | Typical state |
|-----|---------|-----------------|---------------|
| 1 | Learning | Every 1 day | New or recently failed cards |
| 2 | Short-term | Every 3 days | Recalled once correctly |
| 3 | Medium-term | Every 7 days | Building retention |
| 4 | Long-term | Every 14 days | Solidifying |
| 5 | Mastered | Every 30 days | Maintenance review |

Interval constants (days):

```
BOX_INTERVALS = {1: 1, 2: 3, 3: 7, 4: 14, 5: 30}
```

---

## 3. Card Progression Logic

- **Correct answer**: Promote card to `min(current_box + 1, 5)`.
- **Incorrect answer**: Demote card to Box 1.
- **At max box (5), correct**: Stay in Box 5; reset interval to 30 days from today.

No partial promotions. No "skip one box" mechanics. Binary outcome per review.

---

## 4. Review Queue

**Fetching due cards:**

```sql
SELECT * FROM flashcards
WHERE user_id = :uid
  AND next_review_date <= CURRENT_DATE
ORDER BY box ASC, next_review_date ASC
```

Ordering rationale:
1. Lower boxes first (these are the weakest cards).
2. Within the same box, oldest due date first (most overdue).

**Session limits (MVP):**
- No hard daily cap. All due cards are surfaced.
- UI can paginate in batches of 20 if the queue is large.
- Future: configurable daily limit per user preference.

---

## 5. State Transitions

| Current Box | Action | New Box | next_review_date |
|-------------|--------|---------|------------------|
| 1 | Correct | 2 | today + 3 days |
| 2 | Correct | 3 | today + 7 days |
| 3 | Correct | 4 | today + 14 days |
| 4 | Correct | 5 | today + 30 days |
| 5 | Correct | 5 | today + 30 days |
| 1 | Incorrect | 1 | today + 1 day |
| 2 | Incorrect | 1 | today + 1 day |
| 3 | Incorrect | 1 | today + 1 day |
| 4 | Incorrect | 1 | today + 1 day |
| 5 | Incorrect | 1 | today + 1 day |

On every transition, set `last_review_date = today` and `updated_at = now()`.

---

## 6. Edge Cases

| Scenario | Behavior |
|----------|----------|
| New card created | Starts in Box 1, `next_review_date` = creation date (immediately due) |
| Box 1, answered wrong | Stays in Box 1, `next_review_date` = today + 1 day |
| Box 5, answered correct | Stays in Box 5, `next_review_date` = today + 30 days |
| User misses review days | Card remains due. No penalty, no extra demotion. Just shows up in queue. |
| Card due for 10+ days (long absence) | Same as above. No compounding penalty. Treated normally on next session. |
| User deletes and re-saves same word | New card, new UUID, starts at Box 1. Old card is gone. |
| Review submitted twice (race condition) | Use optimistic locking on `updated_at`. Second write fails, client retries with fresh state. |

---

## 7. MVP Scope vs Future

**Included in MVP:**
- 5-box Leitner system
- Binary correct/incorrect grading
- Precomputed next review date
- Simple due-card queue ordered by box then date
- Card creation from chat-saved definitions

**Deferred to future iterations:**

| Feature | Rationale for deferral |
|---------|----------------------|
| SM-2 algorithm | Requires ease factor, repetition count, more complex state. Leitner is sufficient for MVP retention curves. |
| Per-card difficulty | Adds UI complexity (user must rate difficulty). Leitner's binary outcome is simpler. |
| Streak tracking | Nice-to-have gamification. Not core to learning. |
| Analytics (retention rate, cards/day) | Requires event logging infrastructure. Add after core loop is validated. |
| Reverse cards (definition -> word) | Doubles card count. Add as user preference later. |
| Custom intervals | Power-user feature. Fixed intervals work for most learners. |
| Bulk import/export | Not needed when cards come from chat interaction. |
