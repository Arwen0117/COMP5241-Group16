# Member 4 learning-records UI prototype

## Problem Statement

The learning platform needs a coherent Member 4 experience for identity, course access, enrollment state, learner progress, and instructor analytics. The current application has a basic sign-in page and isolated learning-event/progress routes, but it does not yet provide a role-aware experience or a shared boundary that other members can consume safely.

The first delivery must stay focused on the visible product experience while the real persistence and authentication work is deferred. Without a typed boundary, a UI-only prototype would create behavior that later diverges from the central learning-record service.

## Solution

Build a role-aware Member 4 dashboard UI backed by a typed `Member4Service` contract and a representative mock implementation. The prototype will show learner and instructor views, course visibility, enrollment status, progress, score summary, active learning time, invitations, roster information, and the required loading and access states.

The mock service is an adapter, not the domain model. It must expose the same shape that a future persisted Member 4 service will implement, so the UI can later switch from mock data to real APIs without changing the user-facing contract.

## User Stories

1. As a learner, I want to sign in to a recognizable learning-space shell, so that I know which account is active.
2. As an instructor, I want to sign in to the same application shell, so that role-specific capabilities remain part of one coherent product.
3. As a learner, I want to see my canonical learner identity and role, so that the application does not confuse learners with instructors or legacy “student” terminology.
4. As an instructor, I want to see my canonical instructor identity and role, so that I can distinguish teaching tools from learner tools.
5. As a learner, I want navigation that exposes learner-relevant destinations, so that I am not presented with instructor-only actions.
6. As an instructor, I want navigation that exposes instructor-relevant destinations, so that I can manage my teaching experience efficiently.
7. As a learner, I want unauthorized content and actions hidden or blocked, so that another role’s capabilities are not accidentally exposed.
8. As a learner, I want to see published courses available to me, so that I can understand which content is publicly readable.
9. As a learner, I want private course content to remain unavailable unless I have active enrollment, so that course access follows the agreed privacy boundary.
10. As a learner, I want to see my active enrollment, so that I can continue the course where I left off.
11. As a learner, I want to see my progress as a percentage of required learning units completed, so that I can understand my current position in the course.
12. As a learner, I want to see the latest valid score summary, so that my current performance is understandable without exposing every historical attempt in the overview.
13. As a learner, I want to see bounded active learning time, so that the time summary represents authenticated learning activity rather than an arbitrary client total.
14. As a learner, I want to continue my active course from the dashboard, so that returning to learning requires minimal navigation.
15. As a learner, I want to see completed-unit counts alongside percentage progress, so that the progress indicator has concrete meaning.
16. As a learner, I want a useful empty state when I have no active enrollment, so that the dashboard tells me how to begin rather than appearing broken.
17. As a learner, I want to see when an enrollment has been revoked, so that I understand why access is unavailable.
18. As a learner, I want historical progress from a revoked enrollment to remain visible as retained history, so that revocation does not erase my learning record.
19. As a learner, I want expired invitations to be clearly marked, so that I do not mistake them for invitations I can still accept.
20. As a learner, I want invitations to be associated with a specific course, so that I know which course the invitation concerns.
21. As an instructor, I want to see my owned courses, so that I can monitor the courses for which I am responsible.
22. As an instructor, I want published and private courses visibly distinguished, so that I understand each course’s access posture.
23. As an instructor, I want learner counts per course, so that I can assess the size of each learning community.
24. As an instructor, I want required-unit counts per course, so that I can understand the scope of each course.
25. As an instructor, I want a total learner summary, so that I can understand my overall teaching reach.
26. As an instructor, I want average progress and participation summaries, so that I can identify the health of my learning community.
27. As an instructor, I want a recent-activity pulse, so that I can see whether learners have been active recently.
28. As an instructor, I want a learner-roster entry point, so that future enrollment and roster workflows have an obvious place in the experience.
29. As an instructor, I want course creation to have a visible entry point, so that the dashboard supports the broader course-authoring workflow owned by Member 1.
30. As a learner, I want a loading state while my dashboard is being retrieved, so that delayed data access is understandable.
31. As a learner, I want an unauthorized state when the service rejects my identity, so that access failures are explicit rather than silently empty.
32. As a learner, I want validation and access states to use the same service contract as successful states, so that the UI can later consume real API errors consistently.
33. As a learner, I want representative demo data with varied progress, score, and active time, so that the prototype demonstrates meaningful records rather than a single happy path.
34. As an instructor, I want representative published and private courses, so that the prototype demonstrates both visibility states.
35. As a learner, I want the prototype to demonstrate active, revoked, and expired access states, so that the most important enrollment boundaries are visible before real persistence is added.
36. As a future Member 2 or Member 3 integrator, I want a typed Member 4 service boundary, so that I can send or consume learning records without directly accessing Member 4’s persistence.
37. As a future Member 4 implementer, I want the mock contract to use learner, instructor, enrollment, invitation, learning event, progress, active learning time, and score summary consistently, so that replacing the mock does not require terminology changes.
38. As a future maintainer, I want the UI to preserve the idempotent-learning-event decision, so that later persistence derives summaries from retained event facts rather than accepting arbitrary totals.

## Implementation Decisions

- The first implementation is a UI-focused vertical slice backed by a mock service; it does not add real Member 4 persistence.
- The highest integration seam is the typed `Member4Service` interface. The dashboard depends on this interface rather than importing mock fixtures directly.
- The service exposes dashboard retrieval and demo-user switching. Both learner and instructor dashboards use the same top-level result shape.
- Roles are exactly `learner` and `instructor`. The legacy `student` term is not used in the new Member 4 contract.
- The dashboard supports the following UI states: loading, empty, success, validation error, unauthorized, revoked enrollment, and expired invitation.
- Course visibility is `published` or `private`. Published course content is readable by authenticated learners without enrollment, while learner-specific records require active enrollment. Private courses require access through the appropriate course relationship.
- Enrollment status is `active` or `revoked`. Revocation removes current access but retains historical records for display and later analytics.
- Invitations are associated with one course and can be active, expired, or revoked. The prototype renders the expired state; accepting, revoking, and expiry enforcement remain future service behavior.
- A learner dashboard presents the active course, progress percentage, latest score summary, bounded active learning time, completed-unit count, revoked enrollment, and expired invitation.
- An instructor dashboard presents owned courses, publication state, learner counts, required-unit counts, aggregate learner metrics, recent activity, and a roster entry point.
- Mock data includes one learner, one instructor, one published course, one private course, an active enrollment, a revoked enrollment, varied learning metrics, and an expired invitation.
- The accepted ADR on idempotent learning events remains authoritative for the future persisted service: typed, timestamped events have client idempotency keys, are retained, and are used to derive summaries. Invalid events and conflicting key reuse are rejected.
- Real authentication provisioning, authorization enforcement, database persistence, and API routes are not changed by this UI prototype.

## Testing Decisions

- Tests verify externally visible behavior through the browser/UI using the typed `Member4Service` boundary. They do not assert mock fixture internals, CSS implementation details, or React component structure.
- The primary scenarios cover learner dashboard rendering, instructor dashboard rendering, role-based navigation, demo-user switching, loading state, empty state, unauthorized state, revoked enrollment, expired invitation, course visibility, progress, score, and active-time summaries.
- Narrow contract tests may be added for unauthorized service results and invalid service responses where the UI must distinguish an access failure from an empty dashboard.
- The test seam is intentionally higher than the mock implementation: the same UI scenarios should remain valid when the mock adapter is replaced by a real Member 4 API adapter.
- No existing browser test suite was found in the repository; the prototype’s browser tests establish the initial prior art for this feature.
- Real persistence tests for role/access checks, enrollment transitions, event idempotency, event rejection, progress derivation, score summaries, active-time bounds, and unauthorized data isolation are deferred to the implementation that replaces the mock service.

## Out of Scope

- Persisted learner and instructor accounts.
- Google OAuth user provisioning and production authentication changes.
- Password registration or password login.
- Real Prisma enrollment, invitation, learning-event, or analytics models.
- Real Member 4 APIs or direct integration with Members 2 and 3.
- Excel learner import, per-row validation, duplicate handling, and learner-account creation.
- Invitation creation, acceptance, revocation, expiry enforcement, and email delivery.
- CSV export and detailed filtered analytics reports.
- Full course authoring, lesson editing, activity authoring, learner tutoring, or personalized learning paths.
- Administrator roles or self-service instructor promotion.
- Historical attempt drill-down, trend charts, and detailed lesson/activity analytics.
- Replacing unrelated pre-existing API lint warnings.

## Further Notes

- The domain terms in this specification follow the project [GLOSSARY](../../GLOSSARY.md).
- The future persisted implementation must follow the accepted [idempotent learning events ADR](../adr/0001-idempotent-learning-events.md).
- The prototype should be treated as a contract-driven UI reference, not as evidence that access control or learning records are production-ready.
