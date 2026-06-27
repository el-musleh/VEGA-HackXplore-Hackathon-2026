#!/usr/bin/env python3
"""Pre-commit hook: verify structure and imports before commits.

Place in .claude/hooks/ and reference from AGENTS.md.
"""

import os
import subprocess
import sys

ROOT_FILES_ALLOWED = {
    "AGENTS.md",
    "README.md",
    "LICENSE",
    "setup.py",
    "setup.cfg",
    "setup.sh",
    "config.yaml",
    "config.sh",
    "config.ini",
    "config.txt",
    "requirements.txt",
    "requirements-dev.txt",
    ".gitignore",
    "pytest.ini",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "start.sh",
    "justfile",
    "Makefile",
}


def check_root_files() -> list[str]:
    """Check for stray files in repository root."""
    errors = []
    for item in os.listdir("."):
        if os.path.isfile(item):
            if item.endswith(".md") and item not in ROOT_FILES_ALLOWED:
                errors.append(f"Unexpected .md in root: {item}")
            if item.endswith(".py") and item not in ROOT_FILES_ALLOWED:
                errors.append(f"Unexpected .py in root: {item}")
    return errors


def check_tests() -> list[str]:
    """Run the test suite and report failures."""
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "tests/", "-q"],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            return ["Tests failed. Run `python -m pytest tests/` for details."]
    except FileNotFoundError:
        return ["pytest not found, skipping test check."]
    except Exception as e:
        return [f"Test check error: {e}"]
    return []


def main() -> None:
    """Run all pre-commit checks."""
    errors = check_root_files()
    # Uncomment to enforce tests before commits:
    # errors.extend(check_tests())
    if errors:
        print("Pre-commit check failed:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    print("Pre-commit check passed.")
    sys.exit(0)


if __name__ == "__main__":
    main()
