# AGENTS.md — Project Instructions

> **Read this file before making any changes to the Vegas La Vega project.**

## Project Identity

- **Name**: Vegas La Vega
- **Description**: Vegas La Vega — Smart Watering for Urban Trees. Ground-truth sensors + citizen gamification + city routing engine for Karlsruhe's urban canopy.
- **Tech Stack**: React.js, ESP32/Arduino, Python (Flask/SQLite optional backend)

## Quick Reference

| File type | Where it goes | Root exceptions |
|-----------|---------------|-----------------|
| `.md` | `docs/` | `README.md`, `LICENSE`, `AGENTS.md`, `tools/README.md` |
| `.py` | `backend/` or `tools/scripts/` | None |
| `.jsx` / `.js` | `src/` | `vite.config.js` |
| `.ino` / `.cpp` | `firmware/` | None |
| Config (`.toml`, `.yaml`, `.ini`, `.sh`, `.cfg`, `.txt`) | Root | — |
| Data (`.pdf`, `.csv`, `.json` source files) | `tools/data/` | — |
| Tests (`.py`) | `tests/` | — |

## Import Convention

For **Python** modules, always prefix imports with `backend.`:

```python
from backend.models import Tree
from backend.urgency import calculate_urgency
```

For **JavaScript/JSX** modules, use standard relative imports:

```javascript
import CitizenMap from './pages/CitizenMap';
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | React frontend (pages, components, assets, data) |
| `src/config/` | App-level config files (e.g. `carto_style.json`) |
| `src/hooks/` | Custom React hooks |
| `src/utils/` | Pure utility functions |
| `backend/` | Flask REST API, SQLite models, urgency engine, route optimizer |
| `firmware/` | ESP32 Arduino/PlatformIO code |
| `tools/scripts/` | One-off developer scripts (parse.py, parse.cjs) |
| `tools/data/` | Raw source data files — **gitignored**, store locally only |
| `tests/` | Pytest test suite |
| `docs/` | All documentation (pitch, research, architecture) |
| `.claude/skills/` | Reusable AI workflows |
| `.claude/hooks/` | Automation checks |
| `.windsurf/workflows/` | IDE-specific workflows |
| `.github/workflows/` | CI/CD pipelines |
| `.vscode/` | VS Code settings and extensions |

## AI Agent Guardrails

1. **Structure First**: Always consult this file and `docs/system-architecture.md` before creating files.
2. **No Root Clutter**: Do not create `.md` or `.py` files in root unless explicitly allowed above.
3. **Use Skills**: For repeated tasks (code review, refactoring, releases), use `.claude/skills/`.
4. **Check Hooks**: Run `pre-commit run --all-files` or relevant `.claude/hooks/` before committing changes.
5. **Module Context**: Each backend submodule has its own `CLAUDE.md`. Read it before editing that module.
6. **Test Discipline**: Add or update tests before major implementation work. Never delete tests without explicit direction.

## Before You Finish

- [ ] No stray `.md` or `.py` files in root (except allowed)
- [ ] Python imports use `backend.` prefix
- [ ] Tests pass: `just test` or `python -m pytest tests/`
- [ ] Linting passes: `just lint` or `ruff check . && mypy backend/`
- [ ] Relevant module `CLAUDE.md` files consulted
