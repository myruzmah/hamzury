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
