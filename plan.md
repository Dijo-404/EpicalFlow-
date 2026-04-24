# EpicalFlow — Development Plan
**Team Horizon | EPIC Build-A-Thon | Demo Day: 14 May 2026**

---

## Timeline Overview

| Phase | Dates | Goal |
|---|---|---|
| 0 — Setup | Apr 26–27 | Repo, env, boilerplate |
| 1 — Core MERN | Apr 28–May 2 | Auth, netlist parser, layout viewer |
| 2 — Arena Engine | May 3–7 | Socket.io rooms, DRC conflict flow |
| 3 — ML Layer | May 8–10 | Matchmaking, AI routing suggestions |
| 4 — Add-ons + Polish | May 11–12 | ELO, PDF analytics, UI polish |
| 5 — Demo Prep | May 13–14 | Dry run, bug fixes, deploy |

---

## Phase 0 — Project Setup (Apr 26–27)

### Repo Structure
```
epicalflow/
├── client/          # React frontend
├── server/          # Node.js + Express backend
├── ml/              # Python/PyTorch ML service
├── docs/            # Architecture diagrams
└── docker-compose.yml
```

### Tasks
- [ ] Init GitHub repo, add all team members as collaborators
- [ ] Set up branch strategy: `main` → protected, work on `dev`, feature branches per module
- [ ] `client/` — Create React app (Vite), install dependencies: `socket.io-client`, `axios`, `react-router-dom`, `konva` (canvas rendering)
- [ ] `server/` — Init Express app, install: `mongoose`, `socket.io`, `passport-google-oauth20`, `express-session`, `cors`
- [ ] `ml/` — Python venv, install: `torch`, `scikit-learn`, `fastapi`, `uvicorn`
- [ ] MongoDB Atlas — create project, get connection string, add to `.env`
- [ ] Google Cloud Console — create OAuth 2.0 credentials, get `CLIENT_ID` + `CLIENT_SECRET`
- [ ] `.env.example` committed, actual `.env` gitignored

### Owner: Dijo (repo + backend scaffold), Barath (React scaffold), Yathish (ML scaffold)

---

## Phase 1 — Core MERN Foundation (Apr 28–May 2)

### 1A — Google OAuth 2.0 Auth (Day 1–2)

**Backend (`server/`)**
- [ ] `passport.js` config with `GoogleStrategy`
- [ ] Routes: `GET /auth/google`, `GET /auth/google/callback`, `GET /auth/logout`, `GET /auth/me`
- [ ] Session middleware with `express-session` + MongoDB session store
- [ ] User model in MongoDB: `{ googleId, name, email, avatar, role, eloScore, createdAt }`
- [ ] Role enum: `engineer | designer | manager`

**Frontend (`client/`)**
- [ ] Login page — centered Google OAuth button, EpicalFlow branding
- [ ] `AuthContext` — wraps app, stores user state
- [ ] Protected route HOC — redirects to login if unauthenticated
- [ ] Role selector on first login (engineer / designer / manager)

**Test checkpoint:** Login with Google → redirected to dashboard → role stored in DB

---

### 1B — Netlist Parser + Auto-Placement (Day 2–4)

**What a netlist looks like (SPICE-style, simplified):**
```
M1 vout vin vss vss NMOS W=2u L=0.18u
M2 vout vin vdd vdd PMOS W=4u L=0.18u
R1 vin vbias 10k
C1 vout gnd 100f
```

**Backend**
- [ ] `POST /api/netlists/upload` — accepts `.sp` or `.txt` file, stores raw in MongoDB
- [ ] Netlist parser utility: regex-based tokenizer → extracts components (type, name, pins, params)
- [ ] Auto-placement algorithm: group matched pairs (NMOS/PMOS), assign grid coordinates (column/row), output JSON placement map
- [ ] Netlist model: `{ projectId, rawContent, components[], placementMap, drcErrors[], status, createdAt }`
- [ ] `GET /api/netlists/:id` — returns parsed + placed data

**Frontend**
- [ ] Upload page — drag-and-drop `.sp` file, progress indicator
- [ ] Dashboard — list of uploaded netlists with status badges (`placed` / `drc_error` / `resolved`)
- [ ] Arena Queue widget — shows netlists with `drc_error` status, "Enter Arena" CTA

**Test checkpoint:** Upload a sample SPICE netlist → see parsed components and grid placement returned

---

### 1C — Layout Viewer + DRC Flags (Day 4–5)

**Frontend (using Konva.js canvas)**
- [ ] `LayoutCanvas` component — renders components as colored rectangles on a grid
- [ ] Component color coding: NMOS (blue), PMOS (red), Resistor (gray), Capacitor (green)
- [ ] DRC flag overlay — red highlight + warning icon on conflicting component pairs
- [ ] Tooltip on hover — shows component name, type, dimensions
- [ ] "Enter Arena to Resolve" button appears when DRC error is selected

**Backend**
- [ ] Basic DRC checker: spacing rule violations (components too close), unmatched device pairs
- [ ] `POST /api/netlists/:id/run-drc` — runs checker, updates `drcErrors[]` in DB, returns conflicts

**Test checkpoint:** View auto-placed layout → see DRC error highlighted in red → button appears

---

## Phase 2 — Arena Engine (May 3–7)

### 2A — Socket.io Server Setup (Day 1)

**Backend**
- [ ] Socket.io attached to Express HTTP server
- [ ] Namespace: `/arena`
- [ ] Events to implement:
  - `arena:join` — user joins conflict queue for a netlist
  - `arena:matched` — server emits when two users paired
  - `arena:message` — real-time chat between paired engineers
  - `arena:timer_tick` — server-side countdown, emits every second
  - `arena:propose_fix` — engineer proposes a routing fix
  - `arena:vote` — manager casts approval vote
  - `arena:resolved` — emits when consensus or vote finalizes
  - `arena:timeout` — emits when 2-min window expires without resolution

- [ ] Arena room isolation: each conflict gets a unique `roomId = netlistId + conflictIndex`
- [ ] Room model in MongoDB: `{ roomId, netlists, participants[], messages[], status, resolution, createdAt }`

### 2B — Arena UI (Day 2–4)

**Frontend**
- [ ] Arena workspace layout:
  - Left panel: contested layout block (Konva canvas, zoomed to conflict zone)
  - Center: real-time chat panel (Socket.io messages)
  - Right: countdown timer (2:00 → 0:00, red when < 30s) + proposed fixes list
  - Bottom: "Propose Fix" input + "Agree" / "Disagree" buttons
- [ ] Manager view: same layout + "Approve Layout" voting widget (visible only to `role: manager`)
- [ ] Live spectator mode: others can watch the Arena room (read-only), see audience count
- [ ] Notification system: toast alert when DRC error triggers and Arena room is ready

### 2C — Resolution Flow (Day 5)

- [ ] If both engineers click "Agree" on same fix → `arena:resolved` → layout block marked `approved`
- [ ] If timer hits 0 → escalate to manager vote → majority wins → `arena:resolved`
- [ ] Resolution saves: winning fix, full chat transcript, resolution method (consensus / manager vote), timestamp
- [ ] Layout viewer updates: resolved block goes green, DRC flag removed

**Test checkpoint:** Two browser tabs simulate two engineers → pair in Arena → exchange messages → one proposes fix → both agree → status updates to resolved

---

## Phase 3 — ML Layer (May 8–10)

### 3A — ML Matchmaking Service (Day 1–2)

**Python FastAPI service (`ml/`)**

`POST /match` — given a conflict + list of available engineers, returns best pairing

**Algorithm:**
1. Each engineer has an `eloScore` (starts at 1000)
2. Filter engineers by `availability: true` (set via dashboard toggle)
3. Score each candidate: `matchScore = eloProximity * 0.6 + domainMatch * 0.4`
   - `eloProximity`: how close their ELO is to the conflict's estimated difficulty
   - `domainMatch`: tag overlap between engineer's resolved conflicts and current conflict type
4. Return top 2 candidates (one per role: layout engineer + circuit designer)

**Backend integration:**
- [ ] When DRC conflict is flagged, call ML service via `axios` → get matched pair
- [ ] Emit `arena:matched` to both matched users via Socket.io
- [ ] Fallback: if ML service down, fall back to random available engineer selection

### 3B — AI Routing Suggestions (Day 2–3)

**What it does:** When engineers are in the Arena, suggest 2–3 possible metal routing fixes for the flagged DRC violation.

**Implementation (keep it simple and demo-able):**
- [ ] Rule-based suggestions for common DRC types:
  - Spacing violation → suggest rerouting component B 2λ to the right
  - Width violation → suggest increasing metal width to minimum DRC rule
  - Overlap → suggest shifting one component to adjacent grid cell
- [ ] Lightweight PyTorch model (optional, if time allows): trained on synthetic netlist conflict data, predicts best routing direction
- [ ] `POST /suggest` endpoint returns: `[{ fix_description, affected_component, new_coords, confidence }]`
- [ ] Frontend shows suggestions as clickable cards in Arena — clicking one auto-populates the "Propose Fix" field

**Test checkpoint:** Arena active → 2–3 AI suggestions appear in sidebar → engineer clicks one → fix is proposed in chat

---

## Phase 4 — Add-ons + Polish (May 11–12)

### 4A — ELO Gamification

- [ ] ELO update logic: winner of Arena resolution (whose fix was accepted) gains +16, loser loses -16
- [ ] Tie (manager override): no ELO change
- [ ] Leaderboard page: top engineers by ELO, filterable by role
- [ ] Profile page: ELO score, win/loss record, resolved conflicts history

### 4B — Post-Match Analytics PDF

- [ ] Use `pdfkit` (Node.js) to generate PDF after each Arena resolution
- [ ] PDF contents: conflict summary, component names, DRC error type, chat transcript, resolution method, engineers involved, time taken, ELO changes
- [ ] `GET /api/arena/:roomId/report` — generates and returns PDF
- [ ] Dashboard: "Download Report" button per resolved conflict

### 4C — UI Polish

- [ ] Consistent design system: color palette, font (Inter), spacing
- [ ] Loading skeletons for layout canvas and Arena queue
- [ ] Responsive layout (at least usable on 1280px+)
- [ ] Error states: netlist parse failure, Arena disconnection, ML service timeout
- [ ] Animations: Arena countdown pulses red in last 10 seconds, resolved state plays green flash

---

## Phase 5 — Demo Day Prep (May 13–14)

### May 13 — Full Dry Run

- [ ] Deploy: frontend on Vercel, backend on Render (free tier), MongoDB Atlas, ML service on Render (Python)
- [ ] Demo script rehearsed end-to-end:
  1. Login with Google (30s)
  2. Upload sample netlist (30s)
  3. Show auto-placement + DRC error flagged (1min)
  4. Enter Arena — two windows simulating two engineers (2min)
  5. AI routing suggestions appear, engineer proposes fix (1min)
  6. Manager approves (30s)
  7. Layout resolves, ELO updates, PDF report downloaded (1min)
  8. Leaderboard shown (30s)
- [ ] Prepare 2–3 sample netlists with pre-seeded DRC errors for reliable demo
- [ ] Test all flows on demo machine (not just dev laptops)

### May 14 — Demo Day

- [ ] Keep ML service warm (ping every 5 min to avoid cold start)
- [ ] Have a backup: pre-recorded video of full flow in case of network issues
- [ ] Each team member knows which part of the demo they're explaining

---

## MongoDB Schema Summary

```js
// User
{ googleId, name, email, avatar, role, eloScore, wins, losses, availability }

// Netlist
{ projectId, ownerId, filename, rawContent, components[], placementMap, drcErrors[], status }

// ArenaRoom
{ roomId, netlists[], participants[], messages[], proposals[], resolution, transcript, duration }

// EloHistory
{ userId, change, reason, roomId, timestamp }
```

---

## API Routes Summary

```
Auth
  GET  /auth/google
  GET  /auth/google/callback
  GET  /auth/me
  GET  /auth/logout

Netlists
  POST /api/netlists/upload
  GET  /api/netlists/
  GET  /api/netlists/:id
  POST /api/netlists/:id/run-drc

Arena
  GET  /api/arena/queue
  POST /api/arena/create
  GET  /api/arena/:roomId
  GET  /api/arena/:roomId/report   (PDF)

Users
  GET  /api/users/leaderboard
  GET  /api/users/:id/profile
  PUT  /api/users/:id/availability

ML Service (Python/FastAPI)
  POST /match
  POST /suggest
```

---

## Team Assignment

| Module | Owner | Support |
|---|---|---|
| Backend + Auth + DB | Dijo | — |
| React Frontend + Konva canvas | Barath | Hemhalatha |
| Socket.io Arena Engine | Dijo | Gokul |
| ML Matchmaking + AI Routing | Yathish | Divesh |
| UI/UX + Design System | Sirija Meenakshi | Hemhalatha |
| PDF Reports + ELO logic | Gokul | Divesh |
| Deploy + DevOps | Dijo | — |

---

## Stack Summary

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Konva.js, Socket.io-client, Axios |
| Backend | Node.js, Express.js, Socket.io, Passport.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | Google OAuth 2.0 (via Passport) |
| Real-time | Socket.io (bi-directional, isolated rooms) |
| ML Service | Python, FastAPI, PyTorch, scikit-learn |
| PDF | pdfkit (Node.js) |
| Deploy | Vercel (client), Render (server + ML), MongoDB Atlas |

---

## Sample Netlist for Testing

Save as `test_opamp.sp`:
```spice
* Two-stage Op-Amp
M1 vout1 vin+ vs vss NMOS W=10u L=0.5u
M2 vout1 vin- vs vss NMOS W=10u L=0.5u
M3 vdd vout1 vdd vdd PMOS W=20u L=0.5u
M4 vout vout1 vdd vdd PMOS W=20u L=0.5u
M5 vs vbias vss vss NMOS W=5u L=0.5u
M6 vout vout vss vss NMOS W=15u L=0.5u
CC vout1 vout 3p
R1 vbias vss 50k
```

Pre-inject DRC error: set M1 and M2 spacing to 0 (overlap) → triggers conflict → Arena activates.

---

*Plan version 1.0 — generated 25 April 2026*