#!/bin/bash
# Run modular-sticky from Source on macOS
# Ports: DEV=63599, DEVTOOLS=55060, IPC=59493

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status()  { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
print_success() { echo -e "${GREEN}[$(date +'%H:%M:%S')] ✔${NC} $1"; }
print_error()   { echo -e "${RED}[$(date +'%H:%M:%S')] ✗${NC} $1"; }
print_warn()    { echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠${NC} $1"; }

# macOS-only check
if [ "$(uname)" != "Darwin" ]; then
    print_error "This script is for macOS only"
    exit 1
fi

# Change to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Starting modular-sticky from source (macOS)..."

# Port definitions
DEV_PORT=63599
DEVTOOLS_PORT=55060
IPC_PORT=59493

# Check for required commands
for cmd in node npm; do
    if ! command -v "$cmd" &>/dev/null; then
        print_error "$cmd is not installed. Install via Homebrew: brew install node"
        exit 1
    fi
done

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Handle --dev flag
DEV_MODE=0
for arg in "$@"; do
    if [ "$arg" = "--dev" ]; then
        DEV_MODE=1
    fi
done

print_status "Ports: DEV=$DEV_PORT | DEVTOOLS=$DEVTOOLS_PORT | IPC=$IPC_PORT"

if [ "$DEV_MODE" -eq 1 ]; then
    print_status "Launching in DEV mode..."
    npx electron . --dev --remote-debugging-port="$DEVTOOLS_PORT"
else
    print_status "Launching in production mode..."
    npx electron .
fi

print_success "Application session ended."
