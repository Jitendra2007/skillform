# SkillConnect — Firebase Backend Schema

## Technology decision

Use **Firebase** instead of Supabase:
- Firebase Authentication for sign-in and account identity.
- Cloud Firestore as the document database.
- Cloud Storage for Firebase for profile images and private verification documents.
- Firebase Security Rules for database and file access.
- Firebase Hosting is optional; Vercel can host the React frontend.
- Git and GitHub for version control and source hosting.

This document supersedes the earlier Supabase-specific backend plan for implementation. The old document is preserved only for reference. Do not use Supabase in the new application.

## Collections and document shapes

All timestamps should use Firestore `Timestamp` values in the live database. IDs shown below are examples, not real accounts.

### `users/{uid}`
One document per Firebase Authentication user.
```js
{
  uid: "Firebase Auth UID",
  role: "customer", // customer | worker | admin
  fullName: "Demo Person",
  phone: "+91...", // optional; fictional in demo data
  email: "demo@example.test",
  avatarPath: "profile-images/{uid}/avatar.jpg", // Storage path, not secret URL
  preferredLanguage: "en", // en | te
  accountStatus: "active", // active | suspended
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
Never let users choose or update their own `admin` role. Assign admin roles only from a trusted Admin SDK environment or another secure operator-only process.

### `workerProfiles/{uid}`
Document ID should match the worker's Firebase Auth UID.
```js
{
  uid: "Firebase Auth UID",
  bio: "Demo description",
  experienceYears: 5,
  serviceArea: "Vijayawada",
  availabilityStatus: "available", // available | busy | unavailable
  verificationStatus: "pending", // pending | verified | rejected
  skillIds: ["plumbing", "electrical"],
  indicativeDailyWageINR: 700, // UI hint only; not a guaranteed quote
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
Public worker cards should only expose safe profile fields. Do not put identity document numbers or private file URLs here.

### `skills/{skillId}`
Use stable IDs such as `masonry`, `plumbing`, `carpentry`, `electrical`, `painting`, `cleaning`, `moving`, `gardening`, `mechanic`, `other-services`.
```js
{
  nameEn: "Plumbing",
  nameTe: "ప్లంబింగ్",
  isActive: true,
  sortOrder: 2
}
```

### `verificationSubmissions/{submissionId}`
```js
{
  workerUid: "Firebase Auth UID",
  documentType: "aadhaar_masked", // or other
  storagePath: "verification-private/{uid}/{fileName}",
  status: "pending", // pending | approved | rejected
  reviewNote: "Do not include full identity numbers here",
  reviewedBy: null, // admin UID
  submittedAt: Timestamp,
  reviewedAt: null
}
```
Store only a private Storage path, not a public download URL. Use private Storage rules. Prefer masked Aadhaar or an appropriate alternative; never display full Aadhaar numbers publicly.

### `bookings/{bookingId}`
```js
{
  customerUid: "Firebase Auth UID",
  workerUid: "Firebase Auth UID or null until assigned",
  skillId: "plumbing",
  title: "Repair leaking tap",
  description: "Fictional demo request",
  serviceAddress: "Private address visible only to involved parties",
  serviceArea: "Vijayawada",
  requestedDate: Timestamp,
  status: "requested",
  acceptedQuotationId: null,
  completionConfirmedAt: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```
Allowed statuses: `requested`, `accepted_by_worker`, `quoted`, `quote_accepted`, `scheduled`, `in_progress`, `worker_completed`, `completed`, `cancelled`, `disputed`.

Do not expose exact service addresses in public worker search results.

### `quotations/{quotationId}`
```js
{
  bookingId: "booking document ID",
  workerUid: "Firebase Auth UID",
  amount: 700,
  currency: "INR",
  workScope: "Repair tap; materials not included",
  materialsIncluded: false,
  estimatedDuration: "1 day",
  status: "submitted", // submitted | accepted | declined | withdrawn | superseded
  validUntil: Timestamp,
  createdAt: Timestamp,
  respondedAt: null
}
```
The UI must say **“Based on the work — quotation required”** before a quote is submitted. Only a customer involved in the booking can accept/decline a quote. Use trusted transaction/Cloud Function logic to ensure only one quote is accepted.

### `bookingStatusHistory/{eventId}`
```js
{
  bookingId: "booking document ID",
  changedByUid: "Firebase Auth UID",
  oldStatus: "requested",
  newStatus: "quoted",
  note: "Demo status change",
  createdAt: Timestamp
}
```
For sensitive transitions, use a trusted Cloud Function or transaction that validates allowed transitions and writes history atomically.

### `paymentRecords/{paymentId}`
```js
{
  bookingId: "booking document ID",
  payerUid: "Firebase Auth UID",
  amount: 700,
  currency: "INR",
  paymentType: "final", // advance | final | refund
  status: "pending", // pending | paid | failed | refunded | cancelled
  paymentMethod: "demo_cash",
  providerReference: "DEMO-PAY-001",
  paidAt: null,
  createdAt: Timestamp
}
```
This records payment status; it does not itself process online payments. Never store card numbers, CVVs, or banking credentials. Any advance must be explicitly agreed by both parties.

### `reviews/{reviewId}`
```js
{
  bookingId: "booking document ID",
  customerUid: "Firebase Auth UID",
  workerUid: "Firebase Auth UID",
  rating: 5, // integer 1..5
  comment: "Fictional demo review",
  createdAt: Timestamp
}
```
Only the booking's customer may submit one review after completion is confirmed. Enforce uniqueness per booking in trusted code.

### `complaints/{complaintId}`
```js
{
  bookingId: "booking document ID or null",
  submittedByUid: "Firebase Auth UID",
  againstUid: "Firebase Auth UID or null",
  subject: "Demo complaint",
  description: "Fictional demo complaint",
  status: "open", // open | under_review | resolved | rejected
  adminNote: null,
  resolvedByUid: null,
  createdAt: Timestamp,
  resolvedAt: null
}
```

### `adminActivityLogs/{logId}`
```js
{
  adminUid: "Admin Firebase Auth UID",
  action: "worker_approved",
  targetType: "verificationSubmissions",
  targetId: "submission ID",
  details: {}, // minimal non-sensitive metadata only
  createdAt: Timestamp
}
```
Never log passwords, tokens, identity document contents, full Aadhaar numbers, or payment secrets.

## Storage paths

- `profile-images/{uid}/...` — profile photos only.
- `verification-private/{uid}/...` — private worker verification documents.
- `booking-attachments/{bookingId}/{uid}/...` — optional job photos, restricted to booking participants and authorized admins.

Do not make the verification bucket public. Validate file type and size. Use Storage Rules to restrict read/write access.

## Important access rules

- Public visitors can read active skill categories and safe fields for verified workers.
- Signed-in users can read/update only their own permitted user profile fields.
- Workers can edit their own worker profile, but cannot set themselves to verified.
- Customers can create booking requests as themselves and read bookings where they are the customer.
- Assigned workers can read bookings assigned to them and perform only allowed status transitions.
- Quotations are readable only by the customer and worker involved in the booking, plus authorized admins.
- Verification documents are accessible only to the owner and authorized admins.
- Payment records, complaints, and status history are restricted to involved parties and admins as appropriate.
- Only admins can approve/reject verification, suspend accounts, resolve complaints, or access admin reports.
- Admin role must be set using Firebase Admin SDK in a trusted environment (custom claims recommended). Never rely on a client-editable role field alone.
- Firestore Security Rules are not filters: queries must be designed so all returned documents satisfy the rules.
- Do not deploy until Firestore and Storage Rules have been tested with customer, worker, and admin test accounts.

## Suggested Firestore indexes

Create composite indexes as prompted by Firebase during development. Likely queries include:
- `workerProfiles`: `verificationStatus + serviceArea`
- `workerProfiles`: `verificationStatus + availabilityStatus + serviceArea`
- `bookings`: `customerUid + createdAt desc`
- `bookings`: `workerUid + status + createdAt desc`
- `quotations`: `bookingId + createdAt desc`
- `verificationSubmissions`: `status + submittedAt`
- `paymentRecords`: `bookingId + createdAt desc`
- `reviews`: `workerUid + createdAt desc`
- `complaints`: `status + createdAt desc`

Review indexes against actual queries; do not create every possible index without need.
