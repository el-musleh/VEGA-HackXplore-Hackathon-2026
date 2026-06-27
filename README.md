# Vegas La Vega

IoTrees — Smart Watering for Urban Trees. Ground-truth sensors, citizen gamification, and a city routing engine for Karlsruhe's urban canopy.

## Quick Start

**Frontend (React + Vite):**

```bash
./start.sh           # auto-setup + start the dev server
./start.sh build     # build for production
./start.sh preview   # preview the production build
```

**Backend (Flask — optional):**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r ../requirements.txt
flask --app main run
```

## Project Structure

- `src/` — React 19 + Vite 8 frontend (Citizen, Enterprise, Admin, Homeowner flows)
- `backend/` — Flask REST API + SQLite (telemetry, trees, routing)
- `firmware/` — ESP32 Arduino/PlatformIO code
- `docs/` — Pitch deck, research, system architecture
- `tests/` — Test suite

See [AGENTS.md](AGENTS.md) for the full structure guide and AI agent instructions.

## Security

See [docs/SECURITY.md](docs/SECURITY.md) for the security policy.

## Documentation

- [System Architecture](docs/system-architecture.md)
- [Pitch Deck](docs/pitch/deck.md)
