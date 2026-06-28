# AI Agent Onboarding Checklist

> **Run this checklist immediately after scaffolding a new project.**
> It ensures the project is properly customized before the first commit.

## Step 0: Verify Scaffolding Result

- [ ] `new-project.sh` completed without errors
- [x] All placeholders replaced (Vegas La Vega description, React.js/ESP32/Python stack, 2026)
- [ ] `.gitkeep` files cleaned up (done automatically by `new-project.sh`)
- [ ] `git init` succeeded

## Step 1: Project Identity Consistency

Verify the same name, description, and stack appear everywhere:

| File | Fields to check |
|------|-----------------|
| `AGENTS.md` | `## Project Identity` block |
| `README.md` | Title, first paragraph |
| `pyproject.toml` | `[project]` `name`, `description` |
| `LICENSE` | Copyright line |
| `src/main.py` | Any hardcoded strings |

**Action**: If anything still says "A new project based on the Claude Code template", replace it.

## Step 2: Technology Stack Configuration

- [ ] `pyproject.toml` `requires-python` matches your target version (e.g. `>=3.11`)
- [ ] `pyproject.toml` `[tool.ruff]` `target-version` matches your target version
- [ ] `pyproject.toml` `[tool.mypy]` `python_version` matches your target version
- [ ] `requirements.txt` lists all production dependencies
- [ ] `requirements-dev.txt` has everything needed (it should already)
- [ ] `.pre-commit-config.yaml` hooks are appropriate for the stack (already configured for Python)

## Step 3: CI/CD Tailoring

- [ ] `.github/workflows/ci.yml` triggers on the correct branches (`main`, `master`)
- [ ] CI matrix matches target Python versions
- [ ] CI steps cover `just check` or `make check`
- [ ] Add deployment steps if applicable (PyPI, Docker, etc.)

## Step 4: Scaffold the First Domain Module

Do **not** create `src/` folders manually. Use the scaffold tool:

```bash
just scaffold <module_name> --description "<what this module does>"
```

This creates:
- `src/<module_name>/__init__.py`
- `src/<module_name>/CLAUDE.md`
- `tests/test_<module_name>.py`

Then:
- [ ] Write a meaningful function in `src/<module_name>/__init__.py`
- [ ] Write a real test in `tests/test_<module_name>.py`
- [ ] Update `src/<module_name>/CLAUDE.md` with module-specific guidelines

## Step 5: Documentation

- [ ] Replace `README.md` template content with project-specific description, features, and usage
- [ ] Update `docs/architecture.md` with the actual architecture (data flow, module map, key decisions)
- [ ] Add the first ADR to `docs/decisions/` if you made a structural choice (e.g. "Why FastAPI?", "Why SQLite?")
- [ ] Add operational runbooks to `docs/runbooks/` if needed (e.g. "How to deploy", "How to run migrations")

## Step 6: Quality Gates

Run these before every commit:

```bash
just check
```

Or individually:

```bash
just lint          # ruff + mypy
just test          # pytest + structure check
just format        # auto-format if needed
```

- [x] No placeholder text remaining (`grep -r "{{.*}}" . --include="*.md" --include="*.py" --include="*.toml"`)
- [ ] No stray `.md` or `.py` files in root (run `python .claude/hooks/pre-commit-check.py`)
- [ ] Python imports use `backend.` prefix (React uses standard relative imports)
- [ ] Tests pass

## Step 7: Initial Commit

```bash
git add -A
git commit -m "Initial commit: Vegas La Vega project scaffold"
```

- [ ] Meaningful commit message (not "initial commit" or "wip")
- [ ] All files staged (check `git status`)
- [ ] If a remote exists: `git push -u origin main`

## Post-Commit: Set Up Continuously

- [ ] `pre-commit install` (so hooks run automatically)
- [ ] Add the project-specific `.claude/skills/` if this project type repeats
- [ ] Update `AGENTS.md` if you discover new conventions during development

---

**Remember**: After onboarding, every AI agent session starts with reading `AGENTS.md` and the relevant module `CLAUDE.md`. This checklist only runs once per project.
