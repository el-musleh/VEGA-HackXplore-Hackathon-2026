# 🌳 Vegas La Vega — The Urban Forestry Ecosystem

[![Hackathon](https://img.shields.io/badge/Event-VEGA%20HackXplore%20Hackathon%20Karlsruhe-blue)](https://hacklabs.beehiiv.com/)
[![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)](.)
[![Team](https://img.shields.io/badge/Team-Vegas%20La%20Vega-green)](.)
[![Hardware](https://img.shields.io/badge/Hardware-ESP32%20%2B%20Capacitive%20Soil%20Sensor-orange)](firmware/esp32/main.ino)

> **Mission:** The B2G2C smart canopy platform: Leveraging ground-truth soil data to optimize city logistics and ignite targeted citizen engagement.
>
> **Hardware:** [ESP32 DevKit](firmware/esp32/main.ino) — low-cost microcontroller with a capacitive soil moisture sensor (v2.0) and GPIO-gated power control.

---

## 🏆 Challenge

| | |
|---|---|
| **Event** | VEGA-HackXplore Hackathon 2026 (Karlsruhe) |
| **Track** | VEGA Challenge — Smart Watering for Urban Trees |
| **Theme** | Sustainability, Smart Cities, Climate Change, Digitalization, IoT |
| **Deliverables** | Solution concept/story, Technical concept, Prototype/mock-up, 3-minute pitch |
| **Hardware Stack** | ESP32 DevKit + Capacitive Soil Sensor v2.0 + GPIO Power Gate (MOSFET) |
| **Software Stack** | React.js 19 (frontend) + Flask (backend REST API) + SQLite (data store) |
| **Strategy** | Target critical dry trees first using ground-truth soil moisture sensors, combine with 48h weather forecasts (Open-Meteo), and gamify watering for citizens. |

---

## 🚀 Quick Start

The project consists of a React 19 + Vite 8 frontend, a Flask backend API, and ESP32 node firmware. You can manage development using the custom `./start.sh` wrapper script or Casey's `just` runner.

### 1. Connect & Install Prerequisites
Ensure you have **Node.js (v18+)** and **Python 3.11+** installed.

### 2. First-Time Setup
Run the startup script with the `install` argument to set up both npm and Python dependencies:
```bash
./start.sh install
```

### 3. Start the Frontend Dev Server
Run the startup script with no arguments (or `dev`) to launch the Vite dev server:
```bash
./start.sh
# Opens at http://localhost:5173
```
*Alternatively, using just:* `just dev`

### 4. Start the Backend API Server
Launch the Flask development server on port 5000:
```bash
./start.sh backend
# API base: http://localhost:5000/api
```
*Alternatively, using just:* `just backend`

### 5. Parse Tree Data (Optional)
If you have the public trees PDF in `tools/data/karlsruhe.pdf`, run the parser script:
```bash
./start.sh parse
```
*Alternatively, using just:* `just parse`

---

## 🔄 Developer Workflow

This is how the team works during the hackathon:

### Step 1: Initialize Database
Before starting the backend or testing, initialize the database schema:
```bash
curl -X POST http://localhost:5000/api/init
```

### Step 2: Work on Frontend Components
All frontend React pages live in `src/pages/` and are routed via `src/App.jsx`.
Check which view you are building based on the user flows:

| Route / View | Path | Purpose |
|--------------|------|---------|
| **Citizen View** | [CitizenMap.jsx](file:///home/steve/Desktop/VEGA-HackXplore%20Hackathon%202026/src/pages/CitizenMap.jsx) | Urgency-colored map markers (Leaflet.js) to adopt and water trees. |
| **Citizen Leaderboard** | [CitizenLeaderboard.jsx](file:///home/steve/Desktop/VEGA-HackXplore%20Hackathon%202026/src/pages/CitizenLeaderboard.jsx) | Gamified scoring system & civic engagement tracker. |
| **City Dashboard** | [AdminOverview.jsx](file:///home/steve/Desktop/VEGA-HackXplore%20Hackathon%202026/src/pages/AdminOverview.jsx) | Municipal overview of tree canopy health & status panels. |
| **Truck Routing** | [AdminRoutes.jsx](file:///home/steve/Desktop/VEGA-HackXplore%20Hackathon%202026/src/pages/AdminRoutes.jsx) | Optimal routes for water trucks prioritizing critical dry trees. |
| **Field Worker** | [EnterpriseDashboard.jsx](file:///home/steve/Desktop/VEGA-HackXplore%20Hackathon%202026/src/pages/EnterpriseDashboard.jsx) | Tablet UI for drivers: target volume, next stop, sensor spike verification. |

### Step 3: Run Verification & Tests
Ensure that your Python code matches formatting and type rules, and the tests pass:
```bash
./start.sh check
```
*Alternatively, using just:* `just check`

This executes:
- `ruff check .` (Linter)
- `mypy backend/` (Type-checking)
- `pytest tests/` (Test suite)

### Step 4: Commit Changes
Ensure you are using standard git commands but targeting specific files to avoid leaking credentials (do **not** stage all with `git add -A`):
```bash
git status && git diff
git add backend/routes.py
git commit -m "feat: add Flask REST endpoint for citizen watering event"
```

---

## 📁 Project Structure

```
vegas-la-vega/
├── README.md                    # This file
├── AGENTS.md                    # AI agent guidelines & project boundaries
├── LICENSE                      # License details
├── pyproject.toml               # Python project configuration (ruff, mypy, pytest)
├── requirements.txt             # Python production dependencies
├── requirements-dev.txt         # Python developer/test dependencies
├── .pre-commit-config.yaml      # Git pre-commit hooks
├── justfile                     # Task runner
├── start.sh                     # Custom developer startup & dev server script
│
├── src/                         # ⚛️ React 19 + Vite 8 frontend
│   ├── App.jsx                  # Main React component & router
│   ├── main.jsx                 # Frontend entry point
│   ├── index.css                # Global styling (Tailwind CSS 4 setup)
│   ├── components/              # Shared layout shells (Admin, Citizen, Enterprise)
│   ├── pages/                   # Route-level views (CitizenMap, AdminRoutes, etc.)
│   ├── hooks/                   # Custom React hooks
│   ├── data/                    # Generated datasets (e.g., parsed trees.json)
│   └── utils/                   # Pure utility functions
│
├── backend/                     # 🐍 Flask REST API & Core logic
│   ├── main.py                  # API entry point & app factory
│   ├── models.py                # Database connection & schema setup
│   ├── routes.py                # REST endpoints (telemetry, trees, water, route)
│   ├── urgency.py               # Urgency engine (moisture levels → status tier)
│   └── route_optimizer.py       # Greedy critical-first routing for trucks
│
├── firmware/                    # 🔌 ESP32 Arduino/PlatformIO code
│   └── esp32/
│       └── main.ino             # Node firmware (ADC sampling, deep sleep, WiFi TX)
│
├── tools/                       # 🛠️ Development & data parsing scripts
│   ├── scripts/                 # One-off developer scripts (parse.py)
│   └── data/                    # Raw source datasets (gitignored)
│
├── docs/                        # 📄 Project documentation
│   ├── system-architecture.md   # Systems detail (API, hardware, topologies)
│   ├── ONBOARDING.md            # Onboarding checklist for new developers
│   ├── ai-project-structure.md  # Standard layout & import rules
│   └── pitch/
│       └── deck.md              # Slide deck content
│
└── tests/                       # ✅ Pytest validation suite
    ├── conftest.py              # Test configurations & fixtures
    └── test_main.py             # Backend entry point tests
```

---

## 🧠 System Architecture

```mermaid
flowchart TD
    %% Nodes
    Edge["Edge Node (ESP32 + Capacitive Soil Sensor)"]
    Network["KA-WLAN / WiFi Access Point"]
    Backend["Flask REST API Backend (Python)"]
    DB[(SQLite Database)]
    Weather["Open-Meteo API (48h Forecast)"]
    Frontend["React 19 Frontend (Vite)"]
    
    %% Flows
    Edge -->|1. Deep Sleep Wake & Sample Medians| Edge
    Edge -->|2. Transmit Telemetry (JSON POST)| Network
    Network -->|3. Route Payload| Backend
    Backend -->|4. Store Telemetry Rows| DB
    Backend -->|5. Recalculate Urgency Status| Backend
    Backend <-->|6. Fetch weather forecast| Weather
    
    Frontend <-->|7. GET /api/trees & /api/route| Backend
    Frontend -->|8. POST /api/trees/:id/water (Citizen watering)| Backend
```

---

## 🛠️ Setup & Hardware Config

### Hardware: ESP32 Edge Node
| Component | Specification | Description |
|-----------|---------------|-------------|
| **Controller** | ESP32 DevKit | Dual-core Tensilica processor, 2.4GHz Wi-Fi / Bluetooth. |
| **Moisture Sensor** | Capacitive Soil Moisture Sensor v2.0 | Corrosion-free capacitive measurement (A0 to GPIO34). |
| **Power Controller**| MOSFET / GPIO25 gate | Connects/disconnects sensor VCC to prevent drainage during deep sleep. |
| **Voltage Divider** | 100kΩ / 100kΩ (Vbat/2 to GPIO35) | Measures battery health while safeguarding the ADC pin. |
| **Power Supply** | 4× AA battery pack or Li-Ion pack | Configured for maximum battery life (6+ months) via deep sleep cycles. |

### Node Calibration
Ensure the raw ADC limits in `firmware/esp32/main.ino` match your sensor:
```cpp
// Map 0–4095 to 0–100% (adjust 1200 [wet] and 3500 [dry] per sensor)
float pct = map(median, 1200, 3500, 0, 100);
```

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.11
- GCC/make & build-essential (for Python venv setup)

---

## ▶️ How to Run & Test

### Option 1: Run Lints & Type Checks
Run all static check suites:
```bash
./start.sh check
```
This runs `ruff`, `mypy`, and `pytest` consecutively.

### Option 2: Run Backend Tests
Run the backend test suite directly:
```bash
python3 -m pytest tests/ -v
```

### Option 3: Run Frontend Development Server
Start the frontend with local hot-reloading:
```bash
./start.sh dev
# View the application at http://localhost:5173
```

### Option 4: Run Flask REST API Backend
Launch the server to handle telemetry data and route optimization:
```bash
./start.sh backend
# Listens at http://localhost:5000
```

---

## 👥 Team & Responsibilities

| Name | Role | Module | Primary Responsibility |
|------|------|--------|------------------------|
| **Khaled Salama** | Hardware / Embedded | `firmware/` | ESP32 DevKit setup, MOSFET power gating, ADC calibration, Wi-Fi/MQTT logic. |
| **Mohammad El-Musleh** | Backend / Data | `backend/` | Flask REST API, SQLite models, Urgency Engine, Route Optimizer. |
| **Ragini Mishra** | Frontend / UX | `src/` | Leaflet.js interactive citizen map, leaderboard, municipal dashboard, worker UI. |
| **Vamsi Tungala** | Pitch / Business Model | `docs/pitch/` | Business concept, municipal slide deck, pitch script preparation. |

---

## ✅ TODO / Progress

### Phase 1: Edge Node & Data Ingestion (Completed)
- [x] Write ESP32 deep-sleep firmware (`firmware/esp32/main.ino`)
- [x] Configure median-filtered ADC sampling
- [x] Implement MOSFET power gating for sensor longevity
- [x] Build Flask API endpoints for telemetry collection (`backend/routes.py`)

### Phase 2: Core Processing & Urgency Engine (In Progress)
- [x] Implement SQLite database model (`backend/models.py`)
- [x] Build Urgency Engine classifying trees by moisture levels (`backend/urgency.py`)
- [ ] Connect weather forecasts to adjust urgency levels pre-emptively (Open-Meteo fusion)
- [x] Build water truck routing logic (`backend/route_optimizer.py`)

### Phase 3: Frontend Portals (In Progress)
- [x] Design Citizen portal with map and adopted trees (`src/pages/CitizenMap.jsx`)
- [x] Design City supervisor dashboard showing hot spots (`src/pages/AdminOverview.jsx`)
- [x] Design Field worker navigation and watering verification (`src/pages/AdminRoutes.jsx`)
- [x] Implement points/rewards and civic leaderboard (`src/pages/CitizenLeaderboard.jsx`)

### Phase 4: Integration & Optimization (Pending)
- [ ] Tune ADC mapping values for various soil types
- [ ] Run full integration run with hardware nodes
- [ ] Test the route optimizer under dynamic updates
- [ ] Finalize Pitch Deck and record a backup video demo

---

## 🎯 MVP Definition

Before extending features, the project must verify:
1. ESP32 successfully boots, samples soil, and transmits telemetry.
2. Backend ingests telemetry and updates the tree status in SQLite.
3. React frontend renders the map with correct color markers (Green/Yellow/Orange/Red).
4. Citizen/Worker logs a watering event, updating status to Green.

---

## 🔮 Future Work & Roadmap

Based on the Vegas La Vega long-term concept, the future development roadmap includes:

- **Karlsruhe Baumkataster API Integration (Month 2):** Connect directly to the municipal open data catalog to automatically populate tree metadata, species info, and ages.
- **LoRaWAN / Helium Network Transition (Month 4):** Swap out 2.4GHz WiFi radio for LoRaWAN connectivity, extending battery lifetime past 1 year and improving signal range to cover public forests.
- **Permanent Solar-Harvesting Enclosure:** Design an IP65 outdoor enclosure containing a small solar panel and Li-Ion power harvester to avoid battery replacement entirely.
- **Open-Meteo Weather Fusion (Phase 2 core):** Connect live 48h forecasts to adjust urgency status dynamically (e.g. holding off on alerts if rain is incoming).
- **Gamified Local Rewards:** Partner with the city of Karlsruhe to offer actual rewards (such as KVV tram tickets or public pool vouchers) for high-scoring tree guardians on the leaderboard.
- **Enterprise Fleet Auto-Dispatch:** Connect municipal water truck dashboards directly to the routing engine API for automated, paperless dispatch.

---

## ⚠️ Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sensor corrosion | Low | High | Use capacitive sensors rather than cheap resistive ones. |
| Battery exhaustion | Medium | Medium | Power-gate the sensor using a MOSFET, sample only once an hour, and use deep sleep. |
| Inaccurate ADC values | High | Medium | Calibrate each sensor in local soil; run median filtering on samples. |
| Public Wi-Fi range/auth | High | High | Fallback to KA-WLAN / public citizen hotspots or cache telemetry offline. |
| Low citizen engagement | Medium | High | Integrate gamified rewards, leaderboards, and tree adoption profiles. |

---

## 📚 Resources

- [Vegas Challenge Page](docs/research/challange/VEGA%20Challenge.md) — Challenge specifications and expected deliverables
- [System Architecture](docs/system-architecture.md) — Hardware wiring & detailed sequences
- [Vite JS](https://vite.dev) — React bundler documentation
- [Flask REST](https://flask.palletsprojects.com/) — Backend framework guide
- [ESP32 Deep Sleep Guide](https://randomnerdtutorials.com/esp32-deep-sleep-tensorflow/) — Low power sleep patterns

---

## 📝 Git Workflow

We use a default-deny staging policy. Never use `git add -A` or `git add .` to avoid committing build artifacts or keys.

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature

# 2. Develop and check guidelines (AGENTS.md)
./start.sh check

# 3. Stage specifically
git status
git add src/pages/CitizenMap.jsx

# 4. Commit and push
git commit -m "feat: render interactive Leaflet map markers"
git push origin feature/your-feature
```

---
*Event:* VEGA-HackXplore Hackathon 2026 — Karlsruhe  
*Team:* Vegas La Vega  
*Last updated:* June 28, 2026 (Hackathon Active Development)
