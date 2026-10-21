# SkillConnect Starter Pack

This folder is prepared to give Antigravity the design, architecture, backend plan, and demo data before it starts coding.

## Contents
- `ANTIGRAVITY_MASTER_PROMPT.md` — paste this into Antigravity after opening this folder as the workspace.
- `docs/Design.md` — visual and feature specification.
- `docs/Firebase_Backend_Schema.md` — updated Firebase/Firestore data model.
- `docs/Backend_Schema_Previous_Supabase_Version.md` — old Supabase draft kept only for reference; do not implement it.
- `reference-images/nine-page-ui-reference.jpg` — your nine-screen UI reference.
- `reference-images/system-architecture-reference.png` — system architecture reference diagram.
- `data/SkillConnect_Full_Demo_Seed.json` — fictional demo records for UI development.
- `data/SkillConnect_Demo_People_30.csv` — spreadsheet-friendly 30-person dataset.
- `firebase/firestore.rules` — starter Firestore rules for review/testing.
- `firebase/storage.rules` — starter Storage rules for review/testing.
- `firebase/firestore.indexes.json` — suggested composite indexes.
- `firebase/.env.example` — placeholder Firebase web configuration.

## How to start
1. Extract this folder.
2. Open the extracted `SkillConnect_Starter_Pack` folder in Antigravity as the project workspace.
3. Review the files.
4. Copy/paste `ANTIGRAVITY_MASTER_PROMPT.md` into Antigravity.
5. Let it do Phase 0 (inspect and plan) first. Review the plan before authorizing code changes.
6. Use Git locally and GitHub for version control. Do not upload secrets.

## Firebase notes
- Create a Firebase project and enable Authentication, Firestore, and Storage when you reach the backend phase.
- `.env.example` contains placeholders, not working credentials. Copy to `.env.local` only after getting your project's web configuration.
- Do not commit `.env.local` or Firebase Admin service-account JSON.
- Demo JSON is not a set of Firebase Auth accounts. It is for display/demo data unless a safe Admin SDK seed script is deliberately built.
- The rules files are starter drafts and must be reviewed and tested before real data or deployment. In particular, booking status changes, quotation acceptance, review eligibility, and payment records should use trusted transaction/Cloud Function logic.
- No actual Firebase project or GitHub repository has been created by this package; those steps happen in your own accounts.
