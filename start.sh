#!/usr/bin/env bash
# =============================================================================
#  IoTrees (VEGA HackXplore 2026) — Developer Startup Script
# =============================================================================
#  Usage:
#    ./start.sh              # auto-detects setup needs, then starts frontend
#    ./start.sh install      # install/refresh all dependencies (npm + pip)
#    ./start.sh backend      # start the Flask API server
#    ./start.sh build        # build frontend for production
#    ./start.sh preview      # preview the production build
#    ./start.sh parse        # regenerate src/data/trees.json from PDF
#    ./start.sh check        # run lint + tests
#    ./start.sh help         # show this help message
# =============================================================================

set -euo pipefail

# ── Resolve project root (so script works from any directory) ─────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colors ────────────────────────────────────────────────────────────────────
RESET='\033[0m'
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
DIM='\033[2m'
MAGENTA='\033[0;35m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}${BOLD}[IoTrees]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[✔]${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[!]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[✗]${RESET} $*" >&2; exit 1; }
step()    { echo -e "\n${BOLD}${DIM}──────────────────────────────────────${RESET}"; echo -e "  ${BOLD}$*${RESET}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
print_banner() {
  echo ""
  echo -e "${CYAN}${BOLD}"
  echo -e "  ██╗ ██████╗ ████████╗██████╗ ███████╗███████╗███████╗"
  echo -e "  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔════╝██╔════╝██╔════╝"
  echo -e "  ██║██║   ██║   ██║   ██████╔╝█████╗  █████╗  ███████╗"
  echo -e "  ██║██║   ██║   ██║   ██╔══██╗██╔══╝  ██╔══╝  ╚════██║"
  echo -e "  ██║╚██████╔╝   ██║   ██║  ██║███████╗███████╗███████║"
  echo -e "  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝"
  echo -e "${RESET}${DIM}  Smart Watering for Urban Trees · Karlsruhe · VEGA HackXplore 2026${RESET}"
  echo ""
}

# ── Prerequisite checks ───────────────────────────────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    error "Node.js is not installed. Please install v18+ from https://nodejs.org"
  fi
  NODE_VER=$(node -v 2>/dev/null || echo "unknown")
  # Extract major version number (strip leading 'v')
  NODE_MAJOR="${NODE_VER#v}"
  NODE_MAJOR="${NODE_MAJOR%%.*}"
  if [[ "$NODE_MAJOR" =~ ^[0-9]+$ ]] && [ "$NODE_MAJOR" -lt 18 ]; then
    warn "Node.js $NODE_VER detected — v18+ is recommended."
  else
    success "Node.js $NODE_VER"
  fi
}

check_npm() {
  if ! command -v npm &>/dev/null; then
    error "npm is not installed. It ships with Node.js."
  fi
  NPM_VER=$(npm -v 2>/dev/null || echo "unknown")
  success "npm v$NPM_VER"
}

check_python() {
  if ! command -v python3 &>/dev/null; then
    error "Python 3 is not installed. Please install Python 3.11+ from https://python.org"
  fi
  PY_VER=$(python3 --version 2>&1 | awk '{print $2}')
  success "Python $PY_VER"
}

# ── Node dependency install ───────────────────────────────────────────────────
install_npm_deps() {
  if [ -f package-lock.json ]; then
    info "package-lock.json found — using 'npm ci' for reproducible install..."
    npm ci
  else
    npm install
  fi
  success "npm dependencies installed"
}

maybe_install_npm() {
  if [ ! -d node_modules ]; then
    warn "node_modules not found — installing npm dependencies..."
    install_npm_deps
  else
    success "npm dependencies already present"
  fi
}

# ── Python venv + pip install ─────────────────────────────────────────────────
setup_venv() {
  if [ ! -d venv ]; then
    info "Creating Python virtual environment in ./venv ..."
    python3 -m venv venv
    success "venv created"
  else
    success "Python venv already present"
  fi
}

activate_venv() {
  # shellcheck disable=SC1091
  source venv/bin/activate
}

install_pip_deps() {
  setup_venv
  activate_venv
  info "Installing Python dependencies..."
  pip install --quiet --upgrade pip
  pip install --quiet -r requirements.txt
  pip install --quiet -r requirements-dev.txt
  success "Python dependencies installed"
}

maybe_install_pip() {
  if [ ! -d venv ]; then
    warn "Python venv not found — installing Python dependencies..."
    install_pip_deps
  else
    success "Python venv already present"
  fi
}

# ── Commands ──────────────────────────────────────────────────────────────────
cmd_dev() {
  step "Starting frontend dev server"
  info "Stack: React 19 · Vite 8 · Tailwind CSS 4 · React Router · Leaflet · deck.gl"
  info "URL:   http://localhost:5173"
  info "Press Ctrl+C to stop"
  echo ""
  npm run dev
}

cmd_backend() {
  step "Starting Flask API server"
  check_python
  maybe_install_pip
  activate_venv
  info "API: http://localhost:5000/api"
  info "Press Ctrl+C to stop"
  echo ""
  python3 -m backend.main
}

cmd_install() {
  step "Installing all dependencies"
  check_node
  check_npm
  check_python
  install_npm_deps
  install_pip_deps
  echo ""
  success "All dependencies installed and ready"
}

cmd_build() {
  step "Building frontend for production"
  npm run build
  success "Build complete → ./dist/"
}

cmd_preview() {
  step "Previewing production build"
  if [ ! -d dist ]; then
    warn "No dist/ found — building first..."
    cmd_build
  fi
  npm run preview
}

cmd_parse() {
  step "Generating tree data from Karlsruhe PDF"
  check_python
  maybe_install_pip
  activate_venv
  if [ ! -f tools/data/karlsruhe.pdf ]; then
    error "tools/data/karlsruhe.pdf not found. Add the source PDF and try again."
  fi
  info "Parsing tools/data/karlsruhe.pdf → src/data/trees.json ..."
  python3 tools/scripts/parse.py
  success "Tree data regenerated at src/data/trees.json"
}

cmd_check() {
  step "Running lint + tests"
  check_python
  maybe_install_pip
  activate_venv
  info "Linting with ruff..."
  ruff check . || warn "ruff found issues (see above)"
  info "Type-checking with mypy..."
  mypy backend/ || warn "mypy found issues (see above)"
  info "Running pytest..."
  python3 -m pytest tests/ -v
  success "All checks complete"
}

cmd_help() {
  echo ""
  echo -e "${BOLD}Usage:${RESET}"
  echo -e "  ${CYAN}./start.sh${RESET}            Auto-setup + start the frontend dev server"
  echo -e "  ${CYAN}./start.sh install${RESET}    Install / refresh all npm + Python dependencies"
  echo -e "  ${CYAN}./start.sh backend${RESET}    Start the Flask API server (port 5000)"
  echo -e "  ${CYAN}./start.sh build${RESET}      Build the frontend production bundle"
  echo -e "  ${CYAN}./start.sh preview${RESET}    Preview the production build locally"
  echo -e "  ${CYAN}./start.sh parse${RESET}      Regenerate src/data/trees.json from PDF"
  echo -e "  ${CYAN}./start.sh check${RESET}      Run ruff lint + mypy + pytest"
  echo -e "  ${CYAN}./start.sh help${RESET}       Show this help message"
  echo ""
  echo -e "${BOLD}Project structure:${RESET}"
  echo -e "  ${MAGENTA}src/pages/${RESET}        Route-level page components"
  echo -e "  ${MAGENTA}src/components/${RESET}   Layout shells (Admin, Citizen, Enterprise)"
  echo -e "  ${MAGENTA}src/config/${RESET}       App-level config (carto_style.json)"
  echo -e "  ${MAGENTA}src/hooks/${RESET}        Custom React hooks"
  echo -e "  ${MAGENTA}src/utils/${RESET}        Utility functions"
  echo -e "  ${MAGENTA}src/data/${RESET}         Generated datasets (gitignored)"
  echo -e "  ${MAGENTA}src/assets/${RESET}       Static assets (images)"
  echo -e "  ${MAGENTA}backend/${RESET}          Flask REST API (Python)"
  echo -e "  ${MAGENTA}firmware/${RESET}         ESP32 Arduino code"
  echo -e "  ${MAGENTA}tools/scripts/${RESET}    Developer one-off scripts (parse.*)"
  echo -e "  ${MAGENTA}tools/data/${RESET}       Raw source data (gitignored)"
  echo -e "  ${MAGENTA}docs/${RESET}             Architecture, pitch, research"
  echo ""
  echo -e "${BOLD}User roles:${RESET}"
  echo -e "  ${DIM}Citizen · Enterprise · Admin · Homeowner${RESET}"
  echo ""
  echo -e "${BOLD}Quick start:${RESET}"
  echo -e "  ${DIM}./start.sh install   # first time setup"
  echo -e "  ./start.sh           # frontend (tab 1)"
  echo -e "  ./start.sh backend   # Flask API (tab 2)${RESET}"
  echo ""
}

# ── Entry point ───────────────────────────────────────────────────────────────
COMMAND="${1:-dev}"

# Show help without running node/npm checks
case "$COMMAND" in
  help|--help|-h)
    print_banner
    cmd_help
    exit 0
    ;;
esac

print_banner
check_node
check_npm

case "$COMMAND" in
  dev)
    maybe_install_npm
    cmd_dev
    ;;
  backend)
    cmd_backend
    ;;
  install)
    cmd_install
    ;;
  build)
    maybe_install_npm
    cmd_build
    ;;
  preview)
    maybe_install_npm
    cmd_preview
    ;;
  parse)
    cmd_parse
    ;;
  check)
    cmd_check
    ;;
  *)
    error "Unknown command: '$COMMAND'. Run './start.sh help' for usage."
    ;;
esac

