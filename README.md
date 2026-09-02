# 🚑 MediRush

### Real-Time Emergency Healthcare Response Platform

**Press SOS. Get matched with hospitals in seconds. Save the golden hour.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Powered by Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/status-active%20development-orange)]()

[Live Demo](#) · [Report Bug](#) · [Request Feature](#) · [Documentation](#)

</div>

---

## 🩺 Why MediRush Exists

In a medical emergency, every second counts — but the reality of getting help is broken.

Right now, when something goes wrong, a panicking person or bystander has to:

- 📞 Manually call one hospital at a time
- ⏳ Wait on hold, explain the situation, wait again
- ❌ Get told "no beds available" — and start the process over
- 🗺️ Have no idea which nearby hospital can actually help
- 😰 Lose precious minutes during the **golden hour**, when timely care is the difference between life and death

Hospitals face the same problem in reverse — no unified channel to receive, triage, and respond to incoming emergencies in real time.

**MediRush turns a chaotic, sequential process into a single, parallel, real-time broadcast.**

One SOS button. Every nearby hospital notified at once. A live 30-second response window. The user picks the hospital that said yes — and that hospital starts preparing before the patient even arrives.

This isn't a chat app with a medical skin. It's an **event-driven emergency dispatch system**, built to work the way emergencies actually unfold — fast, parallel, and time-boxed.

---

## 📚 Table of Contents

- [Why MediRush Exists](#-why-medirush-exists)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [System Architecture](#-system-architecture)
- [Emergency Workflow](#-emergency-workflow)
- [Tech Stack](#-tech-stack)
- [Socket Events](#-socket-events)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Overview](#-database-overview)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contributors](#-contributors)

---

## ✨ Features


### 🆘 Instant SOS Dispatch
One tap creates an emergency request and broadcasts it to every nearby hospital simultaneously — no sequential calling.


### 📡 Real-Time Everything
Built on Socket.IO. Hospital responses, selections, and cancellations propagate to every connected client instantly.


### ⏱️ 30-Second Response Window
Hospitals get a hard, transparent time-box to accept or reject — no emergency sits in limbo.


### 🏥 Live Hospital Dashboard
Hospitals see incoming emergencies, patient details, and can accept/reject with a single click.


### 🗺️ Nearby Hospital Search
Geo-aware matching via Leaflet + OpenStreetMap surfaces only hospitals within a realistic response radius.



### 🛏️ Bed Availability Checks
Real-time bed-status queries so users know capacity before they commit to a hospital.



### 🔐 Role-Based Authentication
JWT-secured sessions separate patient/user flows from hospital-staff flows.


### 🚦 Automatic No-Response Handling
Hospitals that miss the response window are automatically marked `NO_RESPONSE` — no manual bookkeeping.


### 🧭 One-Tap Hospital Selection
The user picks from the hospitals that accepted; the rest are notified of cancellation instantly.



### 📦 Preparation Trigger
The selected hospital receives full emergency details immediately and can start prepping resources.



**Planned:** QR-based admission · Payments · AI-powered hospital ranking

---

## 🖼️ Screenshots

<div align="center">

| Home / SOS Screen | Hospital Search |
|:---:|:---:|
| ![Home](images/home.png) | ![Search](images/search.png) |

| Hospital Dashboard | Live Map View |
|:---:|:---:|
| ![Dashboard](images/dashboard.png) | ![Map](images/map.png) |

</div>

---

## 🏗️ System Architecture

MediRush follows a **REST + WebSocket hybrid architecture** — REST handles standard CRUD and auth, while Socket.IO drives everything time-sensitive.

```
┌─────────────────────┐
│      User App        │   React · Vite · Tailwind
│  (Patient / Bystander)│
└──────────┬───────────┘
           │  REST (Axios) + WebSocket
           ▼
┌───────────────────────────────────────────┐
│               Backend (Node.js)             │
│  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │ Controllers│→│  Services  │→│  Utils  │ │
│  └───────────┘  └───────────┘  └─────────┘ │
│         │              │                    │
│  ┌───────────┐  ┌───────────────────────┐  │
│  │ Middleware │  │   Socket Layer (I/O)   │  │
│  │  (JWT auth)│  │  Event-driven broker   │  │
│  └───────────┘  └───────────┬────────────┘  │
└──────────────────────────────┼──────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                    ▼
   ┌─────────────────────┐            ┌──────────────────────┐
   │   PostgreSQL + Prisma │            │  Hospital Dashboard   │
   │  Users · Hospitals    │◄──────────►│  React · Socket.IO    │
   │  Emergencies · Beds   │   Realtime  │  Accept / Reject UI   │
   └─────────────────────┘            └──────────────────────┘
```

**Design principles:**
- **Service-layer separation** — controllers stay thin, business logic lives in services
- **Event-driven core** — the socket layer is the nervous system of the app, not an afterthought
- **Stateless REST + stateful sockets** — auth and data fetch over REST, everything time-critical over WebSocket

---

## 🔄 Emergency Workflow

```
   👤 User Login
        │
        ▼
   📝 Create Emergency
        │
        ▼
   🆘 Press SOS
        │
        ▼
   📡 Broadcast to Nearby Hospitals   ──────► search_started
        │
        ▼
   🏥 Hospitals Respond (Accept / Reject)
        │
        ▼
   ⏱️  30-Second Response Window Closes  ──► unresponsive hospitals → NO_RESPONSE
        │
        ▼
   ✅ User Selects a Hospital           ──────► selection_success
        │
        ├──────────────► Selected hospital: user_selected (full patient details)
        │
        └──────────────► All others: request_cancelled
        │
        ▼
   🧰 Hospital Preparation Begins
        │
        ▼
   🚑 Patient Arrival
```

---

## 🧰 Tech Stack

<table>
<tr>
<td valign="top" width="25%">

**Frontend**
- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🔗 Axios
- 🔌 Socket.IO Client

</td>
<td valign="top" width="25%">

**Backend**
- 🟩 Node.js
- 🚂 Express.js
- 🔌 Socket.IO
- 🔑 JWT Auth
- 🌐 REST APIs

</td>
<td valign="top" width="25%">

**Database**
- 🐘 PostgreSQL
- ▲ Prisma ORM

</td>
<td valign="top" width="25%">

**Maps & Security**
- 🗺️ Leaflet
- 🌍 OpenStreetMap
- 🔐 JWT
- 🧂 bcrypt

</td>
</tr>
</table>

**Architecture style:** Service Layer · Event-Driven · REST + WebSocket Hybrid

---

## 📡 Socket Events

MediRush's real-time layer is the backbone of the entire product. Every emergency lifecycle stage maps to a socket event.

#### `User → Server`

| Event | Description |
|---|---|
| `sos_trigger` | User presses SOS; creates and broadcasts a new emergency |
| `check_bed` | User queries live bed availability at a hospital |
| `sos_cancel` | User cancels an active emergency request |

#### `Hospital → Server`

| Event | Description |
|---|---|
| `hospital_join` | Hospital dashboard connects and joins its socket room |
| `accept_request` | Hospital accepts an incoming emergency |
| `reject_request` | Hospital explicitly rejects an incoming emergency |

#### `Server → User`

| Event | Description |
|---|---|
| `search_started` | Nearby hospital search has begun |
| `search_completed` | Search finished; candidate hospitals returned |
| `hospital_response` | A hospital accepted or rejected — pushed live to the user |
| `selection_success` | Confirms the user's hospital selection |
| `bed_response` | Returns live bed availability data |

#### `Server → Hospital`

| Event | Description |
|---|---|
| `new_emergency` | New emergency broadcast to the hospital dashboard |
| `user_selected` | This hospital was selected — full patient details delivered |
| `request_cancelled` | This hospital was **not** selected — the request is closed for them |
| `emergency_closed` | The 30-second window has ended |

---

## 📁 Folder Structure

```
medirush/
├── apps/
│   ├── user-app/               # Patient / bystander-facing React app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   └── sockets/
│   │   └── package.json
│   │
│   └── hospital-dashboard/     # Hospital-facing React app
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   └── sockets/
│       └── package.json
│
├── server/                     # Backend (Node.js + Express)
│   ├── controllers/            # Route handlers — thin, delegate to services
│   ├── services/                # Core business logic
│   ├── routes/                  # REST route definitions
│   ├── sockets/                 # Socket.IO event handlers & namespaces
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── middleware/              # Auth guards, error handlers
│   ├── workers/                 # Timers (30s window), background jobs
│   ├── utils/                    # Geo calculations, helpers
│   ├── config/                   # Env, DB, socket config
│   └── server.js
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- PostgreSQL `>= 14`
- npm or pnpm

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/medirush.git
cd medirush
```

### 2️⃣ Install dependencies

```bash
# Backend
cd server && npm install

# User App
cd ../apps/user-app && npm install

# Hospital Dashboard
cd ../hospital-dashboard && npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file inside `server/` based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medirush"

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Socket
SOCKET_CORS_ORIGIN=http://localhost:5173

# Emergency Config
SOS_RESPONSE_WINDOW_SECONDS=30
SEARCH_RADIUS_KM=10
```

### 4️⃣ Set up the database with Prisma

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### 5️⃣ Run the backend

```bash
cd server
npm run dev
```

### 6️⃣ Run the User App

```bash
cd apps/user-app
npm run dev
```

### 7️⃣ Run the Hospital Dashboard

```bash
cd apps/hospital-dashboard
npm run dev
```

> 🎉 Backend on `http://localhost:5000`, User App on `http://localhost:5173`, Hospital Dashboard on `http://localhost:5174`

---

## 🔌 API Reference

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user or hospital | ❌ |
| `POST` | `/api/auth/login` | Login and receive a JWT | ❌ |
| `GET` | `/api/auth/me` | Get current authenticated profile | ✅ |

### Emergencies

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/emergency` | Create a new emergency request | ✅ |
| `GET` | `/api/emergency/:id` | Get emergency details by ID | ✅ |
| `PATCH` | `/api/emergency/:id/select` | Select a hospital for an emergency | ✅ |
| `PATCH` | `/api/emergency/:id/cancel` | Cancel an active emergency | ✅ |
| `GET` | `/api/emergency/history` | Get user's emergency history | ✅ |

### Hospitals

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/hospitals/nearby` | Search hospitals within radius | ✅ |
| `GET` | `/api/hospitals/:id` | Get hospital profile & bed status | ✅ |
| `PATCH` | `/api/hospitals/:id/beds` | Update live bed availability | ✅ (Hospital) |
| `GET` | `/api/hospitals/:id/requests` | Get incoming emergency requests | ✅ (Hospital) |

#### Example — Create Emergency

```bash
curl -X POST http://localhost:5000/api/emergency \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 27.4924,
    "longitude": 77.6737,
    "type": "cardiac",
    "notes": "Patient is conscious but in severe chest pain"
  }'
```

```json
{
  "success": true,
  "data": {
    "emergencyId": "em_8f2c1a",
    "status": "SEARCHING",
    "nearbyHospitals": 6,
    "responseWindow": 30
  }
}
```

---

## 🗄️ Database Overview

| Table | Purpose |
|---|---|
| `users` | Patient/bystander accounts, auth credentials, profile data |
| `hospitals` | Hospital accounts, location, capacity, verification status |
| `emergency_requests` | Core emergency record — status, location, timestamps, selected hospital |
| `hospital_responses` | Per-hospital response log for each emergency (`ACCEPTED`, `REJECTED`, `NO_RESPONSE`) |
| `payments` | *(Planned)* Transaction records for paid services |
| `qr_admissions` | *(Planned)* QR-based fast-track admission records |
| `notifications` | Delivery log for real-time and push notifications |

```
users ──┐
        ├──< emergency_requests >──┐
hospitals ──┘                      ├──< hospital_responses
                                    └──< notifications
```

---

## 🗺️ Roadmap

- [ ] 🧠 AI-based emergency triage & severity scoring
- [ ] 🎙️ Voice-activated SOS ("Hey MediRush, emergency")
- [ ] 🚑 Live ambulance tracking
- [ ] 📍 Real-time GPS trail sharing with hospitals
- [ ] 🩸 Blood bank inventory integration
- [ ] 🔔 Push notifications (mobile + web)
- [ ] 📴 Offline-first mode for low-connectivity areas
- [ ] ⌚ Wearable device integration (fall/heart-rate detection)
- [ ] 💳 In-app payments
- [ ] 🎫 QR-based hospital admission

---

## 🤝 Contributing

Contributions are what make hackathon projects turn into real products. Any contribution is **greatly appreciated**.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👥 Contributors

<div align="center">

Built with ⚡ and a lot of coffee for a hackathon that demanded a real solution, not a demo.

<a href="https://github.com/<your-username>/medirush/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=<your-username>/medirush" />
</a>

</div>

---

<div align="center">

**MediRush** — because in an emergency, you shouldn't be the one making phone calls.

⭐ Star this repo if you believe emergency response deserves better software.

</div>
