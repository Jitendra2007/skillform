# SkillConnect — Design Specification

## 1. Project Overview

**Project name:** SkillConnect  
**Full title:** Smart Community Labour Networking Platform

SkillConnect is a web platform that connects customers who need work done with skilled local workers. Customers can search for workers, review profiles, request quotations, book jobs, and track completed work. Workers can register their skills, receive booking requests, provide quotations, and manage their jobs. Administrators verify workers and oversee users, bookings, payments, complaints, and platform activity.

### Goals
- Make it easy to find skilled workers in a local area.
- Help customers compare worker skills, ratings, and availability.
- Give workers a simple way to advertise their services and manage jobs.
- Improve trust through worker verification, reviews, and transparent quotations.
- Provide administrative tools to keep the platform safe and organized.

## 2. Target Users

### Customer
A person who needs a service such as plumbing, electrical work, painting, masonry, carpentry, cleaning, moving, or gardening.

### Worker
A skilled person who wants to list their services, receive job requests, submit quotations, and manage work.

### Administrator
An authorized platform manager who verifies workers, manages accounts and complaints, and reviews booking and payment records.

## 3. Visual Design

### Design direction
Use a clean, welcoming, modern interface with generous whitespace, rounded cards, thin borders, and subtle shadows. The overall appearance should feel light and trustworthy, not dark or crowded.

### Color palette

| Purpose | Color | Hex |
|---|---|---|
| Primary green | Soft green | `#72C99A` |
| Light page/hero background | Mint white | `#F0FAF4` |
| Main text and headings | Dark navy | `#10213F` |
| Cards and main surfaces | White | `#FFFFFF` |
| Soft green highlight | Pale green | `#E3F4E9` |
| Secondary text | Muted grey | `#647084` |

Use dark navy for readable text and soft green for primary actions and highlights. Keep contrast strong enough for comfortable reading. Avoid using dark green as the dominant background.

### Typography
- Use a clean sans-serif font.
- Use large, bold headings and short supporting paragraphs.
- Keep labels and form instructions clear and beginner-friendly.
- Maintain consistent spacing, button heights, and border radii.

### Components
- White navigation bar with subtle bottom border.
- Rounded cards with thin borders and soft shadows.
- Green primary buttons and quiet secondary buttons.
- Clear form labels, helpful validation messages, and visible focus states.
- Responsive layouts for desktop, tablet, and mobile.

## 4. Navigation and Access

### Public navigation
- Home
- Find Workers
- Categories
- How It Works
- About Us
- Contact
- Language selector: English / తెలుగు
- Login
- Register

The brand area should show **Smart Community Labour Networking Platform** with **SkillConnect** as the product name or compact logo.

### Role-based access
- Public login and registration should present Customer and Worker options.
- The Admin login must not be advertised as a normal public login option.
- Administrators should use a separate protected admin route and authorized accounts.
- Protect customer, worker, and admin pages so each role can access only the appropriate features.

### Language
Provide an English / Telugu language selector. Switching languages should update the visible interface consistently, including navigation, buttons, labels, validation messages, dashboards, and booking statuses. Telugu translations should be reviewed before release.

## 5. Pages and Features

The design includes the following nine core page areas.

### 5.1 Home Page
- Hero heading: **“Find Skilled Workers for Any Job, Anytime”**
- Short supporting text explaining that users can find trusted local workers.
- Light mint-green hero background.
- A relevant image showing skilled trades or workers.
- Search form with:
  - Skill or category
  - Location (example: Vijayawada)
  - Work date
- Primary call to action: **Find Workers**
- Popular service categories:
  - Masonry
  - Plumbing
  - Carpentry
  - Electrical
  - Painting
  - Cleaning
  - Moving
  - Gardening
- Top-rated worker cards containing photo, name, verification badge when verified, rating, location, skills, indicative daily wage if supplied, and View Profile action.
- Benefits section: Easy Booking, Verified Workers, Secure Payment, and 24/7 Support. Only claim services such as secure payment or 24/7 support once they are actually implemented.
- Footer with About, Contact, Help, Privacy Policy, and Terms links.

### 5.2 Worker Search Page
- Search by skill/category and location.
- Optional filters for rating, verification status, availability, and price range when the data is available.
- Worker result cards with profile link and relevant details.
- Helpful empty state when no workers match.
- Keep search and filter controls usable on mobile.

### 5.3 Worker Profile Page
- Worker photo, name, verification status, skills, service area, experience, rating, reviews, and availability.
- A clear **Request Booking / Get Quotation** action.
- Display pricing as **“Based on the work — quotation required”** until the worker inspects or understands the job and submits a quotation.
- Never display a price as confirmed until the worker submits it and the customer accepts it.
- Do not display private identity documents or full Aadhaar numbers on a public profile.

### 5.4 Worker Registration Page
- Basic information: name, phone, email if available, and service area.
- Skills/categories and experience.
- Profile photo and optional supporting details.
- Aadhaar proof upload for verification, if required by the project.
- Explain why the document is collected and who can access it.
- Store identity documents in private storage with restricted access; never expose them through public URLs.
- Mask Aadhaar wherever possible and never display the full number publicly.
- Show submission status such as Pending Verification, Approved, or Rejected.
- Include consent and privacy information before document upload.

### 5.5 Customer Dashboard
- Profile and contact details.
- Create and view booking requests.
- Review worker quotations and accept or decline them.
- View current job status, scheduled work, past bookings, and cancellations.
- Confirm completion after the worker marks a job complete.
- View payment status and submit a rating/review after completion.
- Submit a complaint or support request when needed.

### 5.6 Worker Dashboard
- Edit profile, skills, service area, and availability.
- View incoming booking requests.
- Accept or decline requests.
- Submit a quotation after understanding or inspecting the work.
- Track quotation status and job progress.
- Mark work as completed and wait for customer confirmation.
- View completed jobs, ratings, and reviews.

### 5.7 Admin Dashboard
- Summary cards for total customers, workers, pending verifications, bookings, completed projects, complaints, and recorded payments.
- Verify or reject worker applications.
- Manage customer and worker accounts.
- Review booking history and status.
- View completed projects per worker.
- Review payment records and complaint reports.
- Moderate ratings/reviews when policy permits.
- View basic reports and activity logs.
- Keep admin access protected and record important administrative actions.

### 5.8 Login and Registration
- Clear role selection for Customer or Worker.
- Login and registration forms with validation.
- Password reset flow.
- Show useful error messages without exposing sensitive system details.
- Admin sign-in is separate from the public role selection.
- Use a secure authentication provider rather than storing plain-text passwords.

### 5.9 Bookings and History
- List bookings with date, customer, worker, category, quotation, and status.
- Filters for current, completed, cancelled, and pending bookings.
- Keep a clear status history for each job.
- Suggested job lifecycle:
  1. Customer submits a work request.
  2. Worker reviews the request and may inspect the job.
  3. Worker submits a quotation.
  4. Customer accepts or declines the quotation.
  5. The job is scheduled and work begins.
  6. Worker marks the job complete.
  7. Customer confirms completion.
  8. Payment is recorded according to the agreed terms.
  9. Customer may leave a rating/review.

## 6. Quotation and Payment Rules

- Before a worker provides a quotation, show **“Based on the work”** rather than a fixed or guaranteed price.
- The worker should explain the quotation and any included work or materials.
- The customer must accept the quotation before the job proceeds, except for a clearly recorded mutually agreed change.
- Payment is due after completion and customer confirmation, according to the agreed terms.
- If an advance payment is allowed, both parties must explicitly agree to the amount and timing and the agreement must be recorded.
- Do not label payments “secure” or claim online payment processing unless a real payment provider has been integrated and tested.
- Store payment status and reference information safely; do not store card details directly.

## 7. Main Workflows

### Customer workflow
Register/login → search by skill and location → view worker profile → request booking → receive quotation → accept quotation → work is completed → confirm completion → payment record → rating/review.

### Worker workflow
Register → add skills and service area → submit verification documents → await admin review → receive booking request → submit quotation → complete job → mark completed → customer confirms → view job history and reviews.

### Administrator workflow
Protected admin login → review worker verification requests → approve/reject → monitor users and bookings → review complaints and payment records → review reports and completed-job counts.

## 8. Data and Privacy Requirements

Suggested core data entities:
- Users and roles
- Worker profiles and skills
- Worker verification submissions
- Customer profiles
- Booking requests
- Quotations
- Booking status history
- Payment records
- Reviews and ratings
- Complaints/support requests
- Administrative activity logs

Privacy and security requirements:
- Use role-based access control and server-side/database policies.
- Keep Aadhaar and other identity documents in private storage.
- Limit access to identity documents to authorized verification staff.
- Never put private document URLs or full Aadhaar numbers on public pages or in client-side logs.
- Collect only information required for the project and explain its purpose.
- Validate uploaded file types and sizes.
- Use environment variables for service keys; never commit secrets to source control.
- Do not rely only on hiding buttons or pages for security; enforce permissions in the backend.

## 9. Responsive Design and Accessibility

- Support desktop, tablet, and mobile widths.
- Use readable text, consistent spacing, and clear form labels.
- Provide keyboard focus indicators.
- Use descriptive alternative text for meaningful images.
- Do not rely on color alone to communicate verification or booking status.
- Ensure buttons and form controls are comfortably tappable on mobile.
- Show loading, success, validation, and error states.

## 10. Suggested Technology Stack

- **Frontend:** React with Vite
- **Routing:** React Router
- **Icons:** Lucide React
- **Styling:** CSS
- **Authentication, database, and private file storage:** Supabase
- **Source control:** Git and GitHub
- **Deployment:** Vercel (after local development and testing)

Build the frontend first, then connect authentication, database tables, access policies, and private storage. Test each role and workflow before deploying publicly.

## 11. Initial Development Milestones

1. Install Node.js LTS and Visual Studio Code.
2. Create the React + Vite project.
3. Build the responsive layout and homepage using sample data.
4. Add routing for the nine core page areas.
5. Add English/Telugu language switching.
6. Build customer and worker registration/login screens.
7. Configure Supabase authentication and database.
8. Add worker verification with private document storage and admin review.
9. Implement booking requests, quotations, completion confirmation, payment records, and reviews.
10. Build the protected admin dashboard and reports.
11. Test validation, permissions, mobile layouts, and error states.
12. Publish only after privacy and security checks.

## 12. Acceptance Checklist

- [ ] The homepage matches the light mint/soft green visual direction.
- [ ] All nine core page areas are represented and navigable.
- [ ] English/Telugu switching updates the full interface.
- [ ] Customers and workers have separate dashboards.
- [ ] Admin access is separate and protected.
- [ ] Worker verification documents are private.
- [ ] Prices remain “Based on the work” until a quotation is submitted.
- [ ] Customers can accept quotations and confirm completion.
- [ ] Booking history, completed-job counts, payment records, complaints, and reviews are available to authorized users.
- [ ] The layout works on mobile, tablet, and desktop.
- [ ] Secrets are not committed, and backend access policies are tested.

---

**Document status:** Initial design specification for the SkillConnect college project. Implementation details may be refined as the project is built.
