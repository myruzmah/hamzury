# Raven & Finch Platform TODO

## Phase 1: Foundation
- [x] Database schema: users with roles (staff, client, agent), tasks, clients, agents, referrals
- [x] Global styles: Inter font, dark green #1B4D3E palette, minimal luxury CSS variables
- [x] App routing structure for all portals

## Phase 2: Public Pages
- [x] Homepage hero section ("Build an institution that lasts.")
- [x] Services overview grid (Systems, Studios, Bizdoc, Innovation Hub)
- [x] RIDI soul statement section
- [x] Footer with portal links
- [x] Portal entry/login page with three role options
- [x] Staff login form (email/password)
- [x] Client access form (reference number + token)
- [x] Agent login form (email/password)
- [x] RIDI impact page (static)

## Phase 3: Backend & Authentication
- [x] JWT-based auth system with role-based access control
- [x] Staff/agent email+password authentication
- [x] Client unique token generation and validation
- [x] Google Sheets API integration (read Central Master Tracker)
- [x] Google Sheets write endpoint (task status updates)
- [x] Google Drive integration for deliverable URLs
- [x] tRPC routers: auth, staff, client, agent, sheets

## Phase 4: Staff Dashboard
- [x] Staff dashboard layout with sidebar navigation
- [x] Active tasks table (Task ID, Project, Description, Deadline, Status)
- [x] Task status update (dropdown → writes back to Google Sheets)
- [x] Overdue task highlighting (soft red)
- [x] Personal KPI cards (tasks completed, on-time rate, QA pass rate)
- [x] Upcoming deadlines list (next 7 days)
- [x] Recent deliverables section with links
- [x] Training progress section (optional)
- [x] Department tracker summary view

## Phase 5: Client & Agent Portals
- [x] Client project view (unique URL /client/:id)
- [x] Client project overview (package, start date, deadline, status)
- [x] Progress timeline (Inquiry → Proposal → Active → Delivery)
- [x] Deliverables list with download links
- [x] Communications log display
- [x] Invoice status display (no exact amounts)
- [x] Agent dashboard layout
- [x] Agent referrals list (client name, date, stage, commission estimate)
- [x] Commission summary cards (earned, pending, paid)
- [x] Agent resources section

## Phase 6: Polish & Tests
- [x] Responsive design (desktop, tablet, mobile)
- [x] Error states and loading skeletons
- [x] Vitest unit tests for auth and API procedures (11 tests passing)
- [x] Final route wiring and navigation review
- [x] Checkpoint save

## Phase 3 — Full Specification Build (March 2026)

- [x] Upload HAMZURY logo and BizDoc logo to CDN and integrate across all pages
- [x] Update password system to accept hamzury2026
- [x] All 11 department pages (CSO, Systems, Studios, Bizdoc, Innovation Hub, BizDev, HR, Finance, CEO, Founder, RIDI)
- [x] Homepage services grid updated to show all 11 departments with taglines
- [x] Department Resource Hub in staff dashboard sidebar
- [x] CEO dashboard (cross-department health, approvals, revenue, risk register)
- [x] Founder dashboard (strategic read-only view)
- [x] Department Lead sub-admin view (team management, analytics, approvals)
- [x] AI Diagnosis Tool page (/diagnosis) with multi-step questionnaire
- [x] WhatsApp chat widget (bottom-right, all pages)
- [x] Contact page (/contact)
- [x] Privacy Policy page (/privacy)
- [x] Terms of Service page (/terms)
- [x] Founder page (/founder)
- [x] CEO page (/ceo)
- [x] Services overview page (/services)
- [x] Update footer with correct emails (info@hamzury.com, innovation@hamzury.com)

## Phase 4 — Design Red Flag Fixes + Copy Update (March 2026)

- [ ] Fix green overuse — restrict brand green to accent-only (buttons, rules, active states)
- [ ] Fix typography hierarchy — 3-level system: display (48–64px), body (14–16px), label (11–12px uppercase)
- [ ] Fix logo size — increase to 40px+ with breathing room in nav
- [ ] Add mobile navigation (hamburger menu)
- [ ] Add subtle grain/texture to hero section
- [ ] Reduce homepage departments to 5 featured + "View all" link
- [ ] Update homepage copy with new minimal institutional text
- [ ] Update all 11 department taglines and descriptions with new copy
- [ ] Update RIDI statement with new copy
- [ ] Update About HAMZURY with new copy
- [ ] Update portal welcome messages with new copy
- [ ] Update footer copy with new text

## Bug Fixes
- [x] Fix 404 on /staff/dashboard/admin route

## Phase 5 — Admin & Operations (March 2026)
- [ ] Update WhatsApp number to 2349130700056
- [ ] Build Admin Panel (/admin) — protected, admin-only
- [ ] Admin: create/edit/deactivate staff accounts with department and role
- [ ] Admin: generate client access URLs and manage client records
- [ ] Admin: register agents and view referral summary
- [ ] Admin: post communications log entries for clients
- [ ] Admin: view all tasks across all staff
