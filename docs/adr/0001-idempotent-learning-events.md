---
status: accepted
---

# Record learning events as idempotent facts

Member 4 will receive typed, timestamped learning events identified by a client idempotency key, retain the event history, and derive progress, active learning time, and score summaries from those records. This preserves a trustworthy history across retries and multiple attempts while keeping Members 2 and 3 independent from the learning-record persistence model; invalid events and conflicting key reuse are rejected instead of being silently coerced.
