# AI Project Structure Design Document

> **Reference this document when creating or reviewing project structure.**
> This doc encodes the full Claude Code Project Structure to prevent AI agent drift.
>
> **Note for Vegas La Vega:** This is a multi-stack project. The React frontend lives in `src/`;
> Python backend modules live in `backend/` (substitute `src.` → `backend.` for imports).

## Directory Tree

```
vegas-la-vega/
|
|-- AGENTS.md
|-- README.md
|-- LICENSE
|
|-- docs/
|   |-- ai-project-structure.md   <-- This file
|   |-- architecture.md
|   |-- decisions/
|   |-- runbooks/
|
|-- .claude/
|   |-- settings.json
|   |-- hooks/
|   |   |-- pre-commit-check.py
|   |-- skills/
|   |   |-- code-review/
|   |   |   |-- SKILL.md
|   |   |-- refactor/
|   |   |   |-- SKILL.md
|   |   |-- release/
|   |   |   |-- SKILL.md
|
|-- tools/
|   |-- scripts/
|   |-- prompts/
|
|-- src/
|   |-- api/
|   |   |-- CLAUDE.md
|   |   |-- __init__.py
|   |-- core/
|   |   |-- CLAUDE.md
|   |   |-- __init__.py
|   |-- persistence/
|   |   |-- CLAUDE.md
|   |   |-- __init__.py
|   |-- utils/
|   |   |-- CLAUDE.md
|   |   |-- __init__.py
|   |-- main.py
|   |-- scaffold.py
|   |-- __init__.py
|
|-- tests/
|   |-- __init__.py
|   |-- conftest.py
|   |-- test_main.py
|
|-- notebooks/
|
|-- .github/
|   |-- workflows/
|       |-- ci.yml
|
|-- .vscode/
|   |-- extensions.json
|   |-- settings.json
|
|-- .windsurf/
|   |-- workflows/
|       |-- organize-files.md
|
|-- .gitignore
|-- pyproject.toml
|-- requirements.txt
|-- requirements-dev.txt
|-- .pre-commit-config.yaml
|-- justfile
|-- Makefile
```

## File-Type Placement Rules

| File type | Where it goes | Root exceptions |
|-----------|---------------|-----------------|
| `.md` | `docs/` | `README.md`, `LICENSE`, `AGENTS.md` |
| `.py` | `src/` | None |
| `.ipynb` | `notebooks/` | None |
| Config (`.toml`, `.yaml`, `.ini`, `.sh`, `.cfg`, `.txt`) | Root | — |
| Tests (`.py`) | `tests/` | — |

## Import Convention

Always prefix imports with `src.`:

```python
from src.core.module import ExampleClass
from src.api.routes import router
from src.persistence.models import User
from src.utils.helpers import some_function
```

Never use bare module imports like `from core.module import ExampleClass` — they will break.

## Module Responsibilities

| Module | Responsibility | May depend on |
|--------|----------------|-------------|
| `src/core/` | Business logic, domain models, use cases | `src.utils` |
| `src/api/` | HTTP endpoints, schemas, routing | `src.core`, `src.utils` |
| `src/persistence/` | DB models, repositories, storage | `src.utils` |
| `src/utils/` | Shared helpers, constants, formatting | Nothing (or other `src.utils`) |

### Module Scaffolding

To add a new `src/` module, use the scaffold tool instead of creating files manually:

```bash
just scaffold <module_name> [--description "..."]
```

This creates:
- `src/<module_name>/__init__.py`
- `src/<module_name>/CLAUDE.md`
- `tests/test_<module_name>.py`

## AI Agent Anti-Drift Checklist

Before creating any file, verify:

1. **Structure First**: Read `AGENTS.md` and this document.
2. **No Root Clutter**: Do not create `.md` or `.py` files in root unless explicitly allowed.
3. **Module Context**: Each `src/` submodule has its own `CLAUDE.md`. Read it before editing that module.
4. **Use Skills**: For repeated tasks (code review, refactoring, releases), use `.claude/skills/`.
5. **Check Hooks**: Run `pre-commit run --all-files` or relevant `.claude/hooks/` before committing.
6. **Test Discipline**: Add or update tests before major implementation work.

## Pre-Finish Verification

- [ ] No stray `.md` or `.py` files in root (except allowed)
- [ ] All imports use `src.` prefix
- [ ] Tests pass: `just test` or `python -m pytest tests/`
- [ ] Linting passes: `just lint` or `ruff check . && mypy src/`
- [ ] Relevant module `CLAUDE.md` files consulted
- [ ] Directory tree matches this document
