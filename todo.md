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

## Phase 13 — Homepage Rebuild & Chat Redesign
- [ ] Homepage: replace department cards with 4 outcome-focused "What We Build" service statements
- [ ] Homepage: replace RIDI section with 5-step client journey (Enquire → Brief → Match → Build → Deliver)
- [ ] Homepage: add Bizdoc as a visible section (where RIDI was)
- [ ] Homepage: remove extra "Start a Project" from nav, keep only one CTA
- [ ] Rebuild AI chat as compact WhatsApp-style widget (small bubble, opens to chat thread)
- [ ] Chat: full project intake flow inside the chat (dept selection → questions → submission)
- [ ] Department pages: add department-specific intake forms
- [ ] Build dedicated event/ticket form page at /form/:slug

## Phase 14 — Nav, Homepage & Full Site Audit
- [ ] Nav: Add RIDI and Bizdoc as direct nav links alongside Services and Portal, remove "Start a Project" button from header
- [ ] Rename "What we build" section to "Our Services"
- [ ] Replace Bizdoc section below services with the 5-step client journey ("How it works")
- [ ] Rewrite all homepage copy with full HAMZURY brand wisdom
- [ ] Audit and fix Services index, department pages, Portal, footer for consistency

## Phase 15 — Department Pages Polish + New Site Pages
- [x] Rebuild Innovation Hub: programme cards with branched chat forms, cohort gallery (placeholders), hackathon results section, next cohort banner, PDF guide download
- [x] Polish Studios: clickable service cards each opening focused chat form, past work gallery (placeholders), outcome section per service
- [x] Polish Systems: clickable service cards with focused chat forms, "How we build" process section, "What you own at the end" section
- [x] Upgrade /track to milestone tracker with visual progress bar (5 stages)
- [x] Build Policies page (/policies): Privacy, Terms of Engagement, Refund Policy
- [x] Build Team page (/team): department leads only, name + title + department cards
- [x] Update Services index with problem-solution comparison table

## Phase 16 — Services Page Visual Redesign
- [x] Redesign Services index page to match department page style (dark brand hero, card grid, consistent typography)

## Phase 17 — Bizdoc & RIDI Page Rebuild
- [x] Rebuild Bizdoc as standalone department page (service cards, brief forms, no external link)
- [x] Redesign RIDI page to match department page visual style (dark hero, sections, consistent typography)
- [x] Remove Bizdoc external link from Services page

## Phase 18 — Pre-Launch Audit & Fixes
- [x] Fix Home.tsx: remove Bizdoc external link, all nav/footer links now internal
- [x] Add Team and Policies to Home footer nav
- [x] Add owner notification on every new intake submission
- [x] Add /contact link to footer nav
- [x] Wire Contact page form to tRPC (now calls contact.send mutation, notifies owner)

## Phase 19 — Staff Onboarding Fixes
- [x] Fix portal login routing (each role goes to correct dashboard)
- [x] Add file upload to task detail view (staff attach deliverables)
- [x] Add Lead weekly report form to lead-dashboard
- [x] Wire intake-to-task auto-pipeline (new intake creates task for Lead)
- [x] Add password change form to staff dashboards
- [x] Add staff notification when Lead assigns a task

## Phase 20 — Full Portal Upgrade + New Features

### 20A — Dashboard Fixes (all roles)
- [x] Wire file upload panel to task detail view in my-tasks (backend ready)
- [x] Wire notification bell to all dashboards — staff, lead, CEO, founder (backend ready)
- [x] Wire password change form to my-tasks and lead dashboard (backend ready)
- [x] Add lead weekly report tab to lead dashboard (backend ready)
- [x] Add HR onboarding tab to People Lead dashboard (create staff with temp password)
- [x] Add staff directory tab to People Lead dashboard (deactivate, reset password)
- [x] Add lead reports view to CEO and Founder dashboards
- [x] Add intake queue tab to CEO dashboard with CLT-ID

### 20B — /start Chat + Back Navigation
- [x] Add back/previous button to every step of the /start intake form
- [x] After submission: show reference number as downloadable PDF with instructions
- [x] Response time messaging: "We respond fast — usually within the hour"

### 20C — Department PDF Downloads
- [x] Add downloadable PDF section to each department page (Studios, Systems, Bizdoc, Innovation Hub)
- [x] Each PDF explains the department's services, process, and what clients receive

### 20D — RIDI Donate + Rural Application
- [x] Add Donate button to RIDI page with donation form (name, amount, message, payment method placeholder)
- [x] Add "Apply for Scholarship" form for rural applicants (name, state, LGA, age, gender, area of interest, brief story)
- [x] Scholarship applications saved to database, visible to RIDI Lead on her dashboard
- [x] Donor submissions saved to database, visible to RIDI Lead and Founder

### 20E — Innovation Hub Full Rebuild
- [ ] Rebuild Innovation Hub public page: Academy (skills training, entrepreneurship, robotics) + HALS LMS + Hackathon + Ventures + Alumni
- [ ] HALS section: online student access link/embed
- [ ] Ibrahim Hassan's lead dashboard: cohort tracker, hackathon management, ventures pipeline, alumni directory, ideas backlog
- [ ] CEO can assign tasks to Ibrahim directly

### 20F — Quality Gate
- [x] Add gate_pending and gate_approved stages to taskLifecycle schema
- [x] Ahmad Lawal (Growth Lead) gets Quality Gate Queue tab on his dashboard
- [x] Approve or Return with comment — every action logged

### 20G — Task Comment Thread
- [x] Add comment thread to every task detail view
- [x] Staff and leads can post text comments inside a task
- [x] Every comment timestamped and attributed — replaces WhatsApp for task communication

## Phase 21 — Luxury Brand Copy & UX Standard (Apple-tier)
- [x] Home: add proof statement above fold, upgrade How It Works step copy, apply brand voice rules
- [x] /start: rewrite headline to "Let's understand what you're building.", apply 3-step form audit, rewrite confirmation message
- [ ] /track: add human microcopy "Your project has a dedicated lead. Here's where things stand."
- [ ] Services: each card follows Problem → Solution → Outcome + "Who this is for:"
- [ ] Footer: rewrite to "© 2026 HAMZURY. Built to last." + warm email microcopy
- [x] Studios: apply brand copy standard — problem/solution/outcome per service
- [x] Systems: apply brand copy standard — problem/solution/outcome per service
- [x] Bizdoc: apply brand copy standard — problem/solution/outcome per service
- [x] Innovation Hub: apply brand copy standard — problem/solution/outcome per programme
- [ ] RIDI: apply brand copy standard
- [ ] Remove all exclamation marks, "amazing", "passionate", "dedicated", "solutions" sitewide
- [ ] All CTAs: "Start your project" / "Continue when ready" — never "Submit" / "Send"

## Phase 22 — Final Complete Build (All Remaining Modules)

### 22A — Staff Roster Correction
- [x] Verify/update staff seed with correct names and roles
- [x] Add Amina Ibrahim Musa as CSO Lead
- [x] Run updated seed against database

### 22B — Schema Additions
- [x] Add taskComments table
- [x] Add invoices table
- [x] Add expenses table with approval chain
- [x] Add uccForms table
- [x] Add clientPipelineStatus to clientIntake
- [x] Run pnpm db:push

### 22C — CSO Dashboard
- [x] Build /cso-dashboard for Amina Ibrahim Musa
- [x] Pipeline view, UCC Form tab, Nurture tab

### 22D — Finance Dashboard
- [x] Build /finance-dashboard for Muhammad Ismail Adam
- [x] Invoices, expenses, RIDI 10%, commissions

### 22E — RIDI Lead Dashboard
- [x] Build /ridi-dashboard for Zainab Umar
- [x] Scholarship, donations, programmes, impact tabs

### 22F — Innovation Hub Lead Dashboard
- [x] Build /innovation-dashboard for Habiba Shuaibu Dajot
- [x] Enrolments, cohorts, interns, Hackathon/Ventures/Alumni placeholders

### 22G — Task Comment Thread
- [x] Add comment thread to all task detail views

### 22H — Expense Approval Workflow
- [x] Expense submission on all dashboards
- [x] Tiered approval: Lead/CEO/Founder

### 22I — UCC Form
- [x] UCC form on CSO dashboard, generates Client ID

### 22J — AI Agents
- [x] Reporting Agent, Lead Qualification Agent, Clarity Report Agent

### 22K — Brand Copy Completions
- [ ] Footer, /track, RIDI copy, remove exclamation marks

## Phase 23 — Platform Bible v6.0 Complete Build

### 23A — Phase 1: Missing Public Pages
- [x] /ask — AI Knowledge Search & Chat page (generative AI answers, intent recognition, conversion path)
- [x] /affiliates — Affiliate landing page (program intro, commission structure, invite-only sign-up)
- [x] /careers — Careers page (job listings linked to HR)
- [x] /press — Press page (media kit)
- [x] /privacy — Privacy Policy page
- [x] /terms — Terms of Service page
- [x] /affiliate-terms — Affiliate Terms page
- [x] /refund — Refund Policy page
- [x] /cookies — Cookie Policy page
- [x] Mobile bottom nav bar (Home, Search, Track, Affiliates, Menu)
- [x] Update desktop nav: add Ask, Track, Affiliates links

### 23B — Phase 2: Chat-First Conversion System
- [x] /chat — Chat conversion engine with department decision trees
- [x] Department trees: Bizdoc, Studios, Systems, Innovation Hub
- [x] AI answering + guided conversion (intent recognition)
- [x] Payment link generation (Paystack placeholder)
- [x] Reference number generation: HZR-YYMMDD-XXX
- [x] PWA tracker prompt after payment

### 23C — Phase 3: Client & Affiliate Platforms
- [x] /track upgrade — deliverables download, subscription status
- [x] /affiliate/dashboard — Affiliate dashboard
- [x] Commission tracking v3.0 (Lead Gen 12.5%, Conversion 12.5%, Execution 40%, Lead 10%, Support 20%, Facilities 5%)
- [x] 30-day cookie referral tracking
- [x] Affiliate payout history, marketing resources

### 23D — Phase 4: Agentic AI Dashboard
- [x] /os/ai — Staff-facing AI agent grid (11 agents)
- [x] Research Agent
- [x] Lead Generation Agent (CSV export)
- [x] Copywriting Agent
- [x] Creative Director Agent
- [x] Design Assistant Agent
- [x] Video Editing Agent
- [x] QA Agent
- [x] Publishing Agent
- [x] Strategist Agent
- [x] Client Follow-Up Agent
- [x] Agent conversation history saved per user
- [x] Output save to task / send to department

### 23E — Phase 5: Dashboard Enhancements
- [x] Lead Dashboard: Kanban drag-and-drop pipeline
- [x] Lead Dashboard: Client workspaces view
- [x] Lead Dashboard: Approvals queue tab
- [x] Lead Dashboard: Calendar tab
- [x] Staff Dashboard: Calendar tab
- [x] Staff Dashboard: Communication log
- [x] Staff Dashboard: Templates & SOPs tab
- [x] CSO Dashboard: Affiliate-tagged leads view
- [x] CSO Dashboard: KPIs (response time, tickets, satisfaction)
- [x] CEO Dashboard: Cross-department workload, KPI comparisons, blockers
- [x] HR Dashboard: Staff accounts management (create/deactivate/roles)
- [x] HR Dashboard: Onboarding status tracker
- [x] HR Dashboard: Access audit log
- [x] HR Dashboard: Affiliate application approvals
- [x] Finance Dashboard: Payment reconciliation, budget vs actual, subscription revenue
- [x] Facilities Dashboard: NEW — maintenance log, requests from staff
- [x] All dashboards: in-dashboard notifications

### 23F — Phase 6: AI Agent Network
- [x] Research repository (knowledge_base table + UI)
- [x] AI Content Engine pipeline (Studios: Idea → Strategist → Research → Copy → Creative → Design → QA → Publishing)
- [x] AI Client Communication System (CSO drafts, follow-ups, surveys)
- [x] Automation workflows (monthly compliance, content calendar triggers)
- [x] Agent governance logs (90-day retention, audit trail)

### 23G — Phase 7: Integrations
- [x] Paystack webhook handler (payment → auto task creation)
- [x] Google Maps on contact page
- [x] Notification triggers (lead created, task assigned, status changed, deliverable ready, payment received)

### 23H — Phase 8: SEO & Polish
- [x] Meta tags per page (title, description, og:image)
- [x] sitemap.xml
- [x] robots.txt
- [x] PWA manifest (for /track offline access)
- [x] Mobile audit (bottom nav, thumb-friendly buttons)
- [x] Remove remaining exclamation marks sitewide
- [x] /track: add human microcopy
- [x] RIDI: apply brand copy standard
- [x] Footer: rewrite to brand standard

## Phase 24 — Paystack DVA (Bank Transfer) Payment Flow
- [ ] Replace Paystack card checkout with Dedicated Virtual Account (DVA) bank transfer flow
- [ ] Generate unique virtual account number per invoice via Paystack DVA API
- [ ] Show bank name, account number, account name, and amount on PayInvoice page
- [ ] Confirm payment automatically via Paystack webhook on transfer received
- [ ] Update invoice status to paid in database on webhook confirmation

## Phase 24 — Final Enhancements Before Launch

### 24A — Navigation Updates
- [x] Remove Bizdoc from top navigation; replace with About Us
- [x] Rename "Services" to "Our Services" in nav
- [x] Add green border around Portal nav link
- [x] Simplify footer: keep only Privacy, Terms, Affiliate Terms, Careers, Press, Contact
- [x] Add /about page

### 24B — Homepage Updates
- [x] Remove standalone About Us section from homepage
- [x] Update How It Works steps to reflect actual pipeline (chat → ticket → execute → track → deliver)

### 24C — Chat System Overhaul (Faiza Abiola)
- [x] Generate Faiza Abiola avatar image (realistic African lady with hijab)
- [x] Replace "HAMZURY Advisor" header with Faiza Abiola name, avatar, and blue verification badge
- [x] Add full-screen mobile chat mode (back button to return)
- [x] Add free-text input always visible (not just for open-ended questions)
- [x] Add context retention across session (all messages persist)
- [x] Add upsell message at end of conversation
- [x] Add appointment booking option ("Book a call" button)
- [x] Add language switcher (English active, Hausa/Pidgin coming soon)
- [x] Any service CTA click opens chat with contextual prompt

### 24D — Payment Overhaul
- [x] Remove Paystack DVA integration from PayInvoice.tsx
- [x] Replace with manual bank transfer display (HAMZURY bank details)
- [x] Add receipt upload field (client uploads proof of transfer)
- [x] Add international payment link field (finance team sets per invoice)
- [x] Update Finance dashboard to set payment link per invoice
- [x] Update webhook/confirmation to manual (finance marks as paid)

### 24E — Branded Invoice & Delivery Dossier
- [x] Add invoice PDF generation endpoint (HAMZURY-branded with logo, Paid stamp)
- [x] Add delivery dossier PDF generation (client name, deliverables, founder note)
- [x] Finance dashboard: download branded invoice PDF button
- [x] Finance dashboard: generate delivery dossier button

### 24F — Dashboard Enhancements
- [x] HR dashboard: assign staff to departments, manage roles, view all staff
- [x] CSO dashboard: assign tasks to team leads only (not directly to staff)
- [x] Lead dashboard: assign tasks to their team members
- [x] CEO dashboard: super admin powers (assign anyone, edit tasks, change passwords, override)
- [x] Add calendar widget to all dashboards
- [x] AI agent network: display as table with stats (name, role, tasks, success rate, workload, status)
- [x] AI agent network: add performance graph (tasks per week)

### 24G — Back Buttons & Page Cleanup
- [x] Add back button to all non-homepage pages
- [x] Remove unnecessary/duplicate pages
- [x] Services page: redesign as collapsible cards (mobile-friendly)
- [x] Remove Quick Reference section from Services page

## Phase 25 — CSO Dashboard (Full Rebuild)

- [x] CSO Login page (/cso/login) with mock auth (localStorage)
- [x] CSO Dashboard layout with sidebar (desktop) + bottom nav (mobile)
- [x] Overview section: 4 KPI cards, quick actions, activity feed
- [x] Lead Pipeline section: table with filters (source, service, status)
- [x] Assignments section: table + create assignment modal
- [x] Department Updates section: structured log
- [x] Attendance section: today's attendance + check-in/out
- [x] KPIs & Analytics section: bar/line/pie charts
- [x] Quick Access section: shortcut cards
- [x] Add /cso/login and /cso/dashboard routes to App.tsx
