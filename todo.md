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

## Super Admin
- [x] Create hidden unguessable super admin login URL
- [x] Dedicated super admin credentials (not on public portal)
- [x] Direct redirect to /admin after super admin login

## Bug Fixes (Continued)
- [x] Fix Admin Panel showing Access Restricted to logged-in admin users
- [x] Fix JWT payload missing openId and appId fields
- [x] Fix users not upserted to DB on custom portal login

## Phase 7 — Role Hierarchy & SOP Task Lifecycle System
- [ ] Generate SOP checklists for all 11 departments
- [ ] Database schema: staff_role (lead/staff), sop_templates, task_checklist_items, task_lifecycle_stage
- [ ] Department Lead dashboard (team tasks, KPIs, approvals, SOP management)
- [ ] Individual staff dashboard (own tasks only, 3-stage lifecycle, personal KPIs)
- [ ] Task card with Pre-Task / In-Progress / Post-Task checklist tabs
- [ ] Completion gate (cannot advance stage until checklist complete)
- [ ] Audit trail (every tick timestamped with staff name)
- [ ] Department Lead can assign tasks to team members
- [ ] Role-based routing (lead → /dept/dashboard, staff → /staff/my-tasks)
- [ ] Update navigation for all three staff sub-roles

## Phase 8 — Full Institutional Operating System
- [x] DB schema: staffMembers, sopTemplates, taskLifecycle, checklistItems, auditTrail, founderNotes tables
- [x] Seed real staff accounts: Haruna Muhammad (Founder), Idris Ibrahim (CEO/Lead-Systems), Aisha Musa (Lead-Studios), Fatima Yusuf (Lead-Bizdoc), Ahmad Lawal (Lead-Growth), Maryam Sani (Lead-People), Umar Abdullahi (Lead-Ledger), Ibrahim Hassan (Lead-Innovation), Zainab Umar (Lead-RIDI), Suleiman Ahmad Bashir (Staff-Studios/Bizdoc), Abubakar Bashir (Staff-Studios)
- [x] CEO dashboard at /ceo-access-7x9m4 — command centre view (all depts, staff KPIs, client pipeline, task assignment)
- [x] Founder dashboard at /founder-access-k8p1q — boardroom view (dept health, team overview, private notes, task assignment)
- [x] Department Lead dashboard at /lead-dashboard — team tasks, approvals queue, assign task to staff
- [x] Individual staff My Tasks dashboard at /my-tasks — personal tasks only, 3-stage SOP checklist
- [x] Task Card with Pre-Task / During-Task / Post-Task tabs and completion gates
- [x] Audit trail — every checklist tick timestamped with staff name
- [x] Task assignment flow: CEO/Founder/Lead → Staff
- [x] Approvals queue for Lead (review → approve / return for revision)
- [x] Role-based routing: founder → /founder-access-k8p1q, ceo → /ceo-access-7x9m4, lead → /lead-dashboard, staff → /my-tasks
- [x] Staff Login page at /staff-login with automatic role-based redirect
- [x] All routes wired in App.tsx
- [x] Staff seed script successfully executed — all 11 accounts active in database

## Phase 9 — Full Platform Completion from INFO.pdf
- [x] Expand Bizdoc SOP: CAC registration, business name, incorporation, annual returns, tax registration, PENCOM, industry licensing, compliance advisory
- [x] Expand Studios SOP: brand identity, social media management, content strategy, podcast production, event media coverage, faceless channel creation
- [x] Expand Systems SOP: business websites, web applications, client dashboards, automation systems, AI workflows, CRM systems
- [x] Expand Innovation Hub SOP: executive training, robotics training, internship programs, digital skills training
- [x] Expand BizDev SOP: lead generation, partnerships, grant applications, campaign management, market research
- [x] Expand Finance SOP: bookkeeping, financial reporting, commission processing, expense management
- [x] Expand HR SOP: recruitment, staff onboarding, performance reviews, attendance tracking
- [x] Expand RIDI SOP: digital skills program, climate education, entrepreneurship training, community partnership
- [x] Expand CSO SOP: client onboarding, clarity review, package recommendation, client relationship management
- [x] Build Friday CEO Report form in CEO dashboard (3 wins, 3 watches, 1 key info, key numbers)
- [x] Build Founder weekly report inbox in Founder dashboard (receives CEO Friday report)
- [x] Add approval limits display to CEO and Founder dashboards (₦50k/₦200k thresholds)
- [x] Add RIDI impact tracker (beneficiaries, programs, stories, referrals)
- [x] Produce branded HAMZURY Internal Operations Manual PDF

## Phase 10 — The 10 Priorities (Full Execution)
- [x] Fix WhatsApp number to 2349130700056 (confirmed, notification-only mode)
- [x] Promote Amina Ahmad Musa to CSO Lead role
- [x] Build frictionless client intake at /start: guided multi-step form, auto-reference, email+WhatsApp notification
- [x] Build project tracker at /track: reference code lookup, status timeline
- [x] Build internal AI chat widget (HamzuryChat, replaces WhatsApp popup, brand-trained)
- [x] Complete department pages: all CTAs updated to /start, department descriptions updated
- [x] Brand language audit: all /diagnosis references replaced with /start and /track, HAMZURY voice applied
- [x] Produce 14 staff onboarding documents (branded PDF per person, HAMZURY-Staff-Onboarding-Pack.zip)
- [x] Seed 7 demo tasks across all departments (63 checklist items, realistic client names)
- [x] Build CSO AI Agent in Lead dashboard (drafts client messages, qualifies leads)
- [x] Build Bizdoc AI Agent in Lead dashboard (compliance research, CAC/tax/PENCOM guidance)
- [x] Staff list corrected to 14 real staff members with accurate names, roles, departments

## Phase 11 — Public Experience Rebuild
- [ ] Homepage: show only 4 departments (Innovation Hub, Studios, Systems, Bizdoc)
- [ ] Nav: update department links to only 4 visible departments
- [ ] Bizdoc: rename to "Bizdoc" (not "HAMZURY Bizdoc"), link to bizdoc.hamzury.com
- [ ] AI chat: Apple-style redesign — welcome screen + 4 department cards with outcome statements
- [ ] AI chat: Innovation Hub flow — list all services, luxury no-direct-enrol message, AI programme matching
- [ ] AI chat: Studios flow — service selection, project brief questions, AI recommendation
- [ ] AI chat: Systems flow — service selection, requirements questions, AI recommendation
- [ ] AI chat: General Business Checkup flow — diagnostic questions, AI analysis report
- [ ] AI chat: each flow ends with "Learn More" PDF trigger per department
- [ ] Service sub-pages: clickable individual service pages for all 4 departments
- [ ] Remove client login from portal — portal shows Staff and Agent only
- [ ] Department landing pages: full content with case study placeholders

## Phase 12 — Brand Language & Public Site Rebuild
- [ ] Rewrite AI chat: 4 public depts only, outcome-focused copy, remove CSO/internal depts
- [ ] Rewrite homepage: outcome-first dept cards, HAMZURY voice, remove generic phrases
- [ ] Clean navigation: remove Contact link, keep Services + Partner Portal
- [ ] Build /departments index page: all 4 depts with full features, direct to /start
- [ ] Build /departments/innovation-hub page
- [ ] Build /departments/studios page
- [ ] Build /departments/systems page
- [ ] Build /departments/bizdoc page (with external link to bizdoc.hamzury.com)
- [ ] Remove client portal login, simplify portal to Staff and Agent only
