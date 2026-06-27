#!/usr/bin/env bash
# =============================================================================
#  VEGA HackXplore 2026 — Developer Startup Script
# =============================================================================
#  Usage:
#    ./start.sh          # auto-detects setup needs, then starts dev server
#    ./start.sh install  # force reinstall of dependencies
#    ./start.sh build    # build for production
#    ./start.sh preview  # preview the production build
#    ./start.sh help     # show this help message
# =============================================================================

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RESET='\033[0m'
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
DIM='\033[2m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}${BOLD}[VEGA]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[✔]${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[!]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[✗]${RESET} $*" >&2; exit 1; }
step()    { echo -e "\n${BOLD}${DIM}──────────────────────────────────────${RESET}"; echo -e "  ${BOLD}$*${RESET}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
print_banner() {
  echo -e ""
  echo -e "${CYAN}${BOLD}"
  echo -e "  ██╗   ██╗███████╗ ██████╗  █████╗ "
  echo -e "  ██║   ██║██╔════╝██╔════╝ ██╔══██╗"
  echo -e "  ██║   ██║█████╗  ██║  ███╗███████║"
  echo -e "  ╚██╗ ██╔╝██╔══╝  ██║   ██║██╔══██║"
  echo -e "   ╚████╔╝ ███████╗╚██████╔╝██║  ██║"
  echo -e "    ╚═══╝  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝"
  echo -e "${RESET}${DIM}  HackXplore 2026 · React + Vite · Karlsruhe${RESET}"
  echo -e ""
}

# ── Checks ────────────────────────────────────────────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    error "Node.js is not installed. Please install it from https://nodejs.org (v18+ recommended)."
  fi
  NODE_VER=$(node -v)
  success "Node.js $NODE_VER found"
}

check_npm() {
  if ! command -v npm &>/dev/null; then
    error "npm is not installed. It usually ships with Node.js."
  fi
  NPM_VER=$(npm -v)
  success "npm v$NPM_VER found"
}

# ── Install ───────────────────────────────────────────────────────────────────
install_deps() {
  step "Installing dependencies"
  if [ -d node_modules ] && [ -f package-lock.json ]; then
    info "node_modules already present — running 'npm ci' for clean install..."
    npm ci
  else
    npm install
  fi
  success "Dependencies installed"
}

maybe_install() {
  if [ ! -d node_modules ]; then
    warn "node_modules not found — installing dependencies first..."
    install_deps
  else
    success "Dependencies already installed"
  fi
}

# ── Commands ──────────────────────────────────────────────────────────────────
cmd_dev() {
  step "Starting development server"
  info "Stack: React 19 · Vite 8 · Tailwind CSS 4 · React Router · Leaflet · Recharts"
  info "Press Ctrl+C to stop the server"
  echo ""
  npm run dev
}

cmd_build() {
  step "Building for production"
  npm run build
  success "Build complete → ./dist/"
}

cmd_preview() {
  step "Previewing production build"
  if [ ! -d dist ]; then
    warn "No dist/ folder found. Building first..."
    cmd_build
  fi
  npm run preview
}

cmd_help() {
  print_banner
  echo -e "${BOLD}Usage:${RESET}"
  echo -e "  ${CYAN}./start.sh${RESET}           Auto-setup + start the dev server"
  echo -e "  ${CYAN}./start.sh install${RESET}   Force reinstall all npm dependencies"
  echo -e "  ${CYAN}./start.sh build${RESET}     Build the production bundle"
  echo -e "  ${CYAN}./start.sh preview${RESET}   Preview the production build locally"
  echo -e "  ${CYAN}./start.sh help${RESET}      Show this help message"
  echo ""
  echo -e "${BOLD}Project structure:${RESET}"
  echo -e "  ${DIM}src/pages/${RESET}      Route-level page components"
  echo -e "  ${DIM}src/components/${RESET} Shared layout components (Admin, Citizen, Enterprise)"
  echo -e "  ${DIM}src/data/${RESET}       Static data / mock datasets"
  echo -e "  ${DIM}src/assets/${RESET}     Static assets (images, icons)"
  echo ""
  echo -e "${BOLD}User roles available in-app:${RESET}"
  echo -e "  ${DIM}Admin · Citizen · Enterprise · Homeowner${RESET}"
  echo ""
}

# ── Entry point ───────────────────────────────────────────────────────────────
COMMAND="${1:-dev}"

print_banner
check_node
check_npm

case "$COMMAND" in
  dev|"")
    maybe_install
    cmd_dev
    ;;
  install)
    install_deps
    ;;
  build)
    maybe_install
    cmd_build
    ;;
  preview)
    maybe_install
    cmd_preview
    ;;
  help|--help|-h)
    cmd_help
    ;;
  *)
    error "Unknown command: '$COMMAND'. Run './start.sh help' for usage."
    ;;
esac
