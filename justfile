# justfile — Task runner for IoTrees (Vegas La Vega)
# Install `just` from https://github.com/casey/just

# Default recipe — show available commands
default:
    @just --list

# ── Development ──────────────────────────────────────────────────────────────

# Run the Vite frontend dev server
dev:
    npm run dev

# Run the Flask backend API server
backend:
    python -m backend.main

# ── Data Pipeline ─────────────────────────────────────────────────────────────

# Parse Karlsruhe PDF → src/data/trees.json  (Python version)
parse:
    python tools/scripts/parse.py

# Parse Karlsruhe PDF → src/data/trees.json  (Node.js version)
parse-js:
    node tools/scripts/parse.cjs

# ── Quality ──────────────────────────────────────────────────────────────────

# Run the full test suite
test:
    python -m pytest tests/ -v
    python .claude/hooks/pre-commit-check.py

# Run linters
lint:
    ruff check .
    mypy backend/

# Auto-format code
format:
    ruff check . --fix
    ruff format .

# Run all checks (lint + test)
check: lint test

# ── Housekeeping ─────────────────────────────────────────────────────────────

# Remove build artifacts and caches
clean:
    rm -rf dist dist-ssr .vite
    find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true

# Install pre-commit hooks
install-hooks:
    pre-commit install

# Run pre-commit on all files
run-hooks:
    pre-commit run --all-files

