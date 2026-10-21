# Antigravity Master Prompt — SkillConnect (Firebase + GitHub)

You are the lead engineer helping a beginner build the **SkillConnect — Smart Community Labour Networking Platform** college project. Preserve its purpose and the supplied nine-page screenshot. Work incrementally; do not generate an uncontrolled one-shot application.

## Before coding
Inspect:
- `docs/Design.md`
- `docs/Firebase_Backend_Schema.md`
- `reference-images/nine-page-ui-reference.jpg`
- `reference-images/system-architecture-reference.png`
- `data/SkillConnect_Full_Demo_Seed.json`
- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase/firestore.indexes.json`
- all existing source files, if any

`docs/Backend_Schema_Previous_Supabase_Version.md` is retained only as historical context. The implementation backend decision is **Firebase, not Supabase**. Do not introduce Supabase.

First report your understanding, current workspace state, proposed file structure, route plan, Firebase collection plan, GitHub workflow, risks, and phased plan. Start with inspection and planning only. Do not make major edits until the plan is presented.

## Product requirements
Build these nine page areas:
1. Home
2. Worker Search
3. Worker Profile
4. Worker Registration
5. Customer Dashboard
6. Worker Dashboard
7. Admin Dashboard
8. Login/Signup
9. Browse by Category and Bookings/History views

Use React + Vite, React Router, CSS, Lucide React, Firebase Authentication, Cloud Firestore, Cloud Storage for Firebase, and Git/GitHub. Vercel may host the frontend; Firebase Hosting is also possible, but do not set up two deployment paths without explaining the choice.

Use the supplied mint/green visual direction:
`#72C99A`, `#F0FAF4`, `#E3F4E9`, `#10213F`, `#FFFFFF`, `#647084`.
Match the supplied screenshot and use shared components and responsive styling.

## Roles
`customer`, `worker`, `admin`. Public signup offers Customer and Worker only. Admin access is separate and protected. Never allow a client to assign itself admin. Prefer Firebase custom claims set by a trusted Admin SDK process for admin authorization.

## Required workflows
Customer: search → profile → booking request → worker quotation → customer accepts → work scheduled/in progress → worker marks complete → customer confirms → payment record → review.
Worker: registration → skills/profile → private verification upload → admin review → approved/rejected → bookings → quotation → work status → history.
Admin: protected login → review verification → manage users/bookings → complaints → payment records → reports.

Before a quote, display “Based on the work — quotation required.” Payment records do not imply an integrated payment gateway. Any advance needs agreement from both parties. Never expose full Aadhaar numbers or verification documents publicly.

## Firebase data
Use the collection/document shapes in `docs/Firebase_Backend_Schema.md`. Use `data/SkillConnect_Full_Demo_Seed.json` for clearly fictional UI demo data. It does not create Firebase Authentication accounts; do not claim it creates working logins. If a seed script is needed, make it explicitly development-only and use a trusted Admin SDK environment, never browser code.

Review the starter security rules critically. Do not claim production security is complete just because rules files exist. Tighten and test rules for ownership, role permissions, booking transitions, quote acceptance, review eligibility, payment records, and storage access. Do not put Firebase Admin service-account credentials in the frontend or GitHub.

## Phases
0. Inspect and plan.
1. Set up React/Vite, routing, design tokens, shared layout.
2. Build all page UIs using demo data.
3. Connect demo JSON to cards and dashboards.
4. Configure Firebase Auth, Firestore, Storage, environment example, rules and indexes.
5. Implement booking/quotation/verification/completion/payment/review/complaint workflows.
6. Implement protected admin dashboard and reports.
7. Test build, routes, responsive UI, role permissions and error/loading states.
8. Document GitHub version control and deployment steps.

At each phase, report files changed, commands to run, expected results, configuration I must perform, tests actually run, limitations, and next step. Do not skip phases or claim unrun tests passed.

## GitHub and safety
Check whether the folder is already a Git repository before initializing it. Never overwrite an existing `.git` history or push to a remote without explaining the target and getting my approval. Add `.gitignore` for `node_modules`, build output, `.env*` except `.env.example`, Firebase service-account JSON, and other secrets. Do not commit real identity documents, secrets, or production user data.

I am a beginner. Give exact commands and paths and explain where to run them. Preserve the project goal and the supplied design as the source of truth. Start with Phase 0 only.
