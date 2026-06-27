# justfile — Task runner for Vegas La Vega
# Install `just` from https://github.com/casey/just

# Default recipe — show available commands
default:
    @just --list

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

# Install pre-commit hooks
install-hooks:
    pre-commit install

# Run pre-commit on all files
run-hooks:
    pre-commit run --all-files
