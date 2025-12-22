#!/usr/bin/env bash
set -euo pipefail

# Read config from architecture file
PREVIEW_PORT=$(grep 'preview_port:' ../docs/ARCHITECTURE-Frontend.md | awk '{print $2}')
BASE_URL="http://localhost:$PREVIEW_PORT"
PROBE_PATH="/"

# Create reports directory
DATETIME=$(date +%Y%m%d-%H%M%S)
REPORT_DIR="../.reports/deploy-frontend/$DATETIME"
mkdir -p "$REPORT_DIR"
echo "preview" > "$REPORT_DIR/mode.txt"

# Start the preview server in the background
echo "Starting preview server..." > "$REPORT_DIR/startup.log"
pnpm run preview -- --port "$PREVIEW_PORT" --strictPort >> "$REPORT_DIR/startup.log" 2>&1 &
SERVER_PID=$!

# Function to clean up background process on exit
cleanup() {
  echo "Cleaning up preview server (PID: $SERVER_PID)..."
  kill "$SERVER_PID" 2>/dev/null || true
  echo "Preview server stopped."
}
trap cleanup EXIT

# Wait for the server to start
echo "Waiting for preview server to start on port $PREVIEW_PORT..."
for i in {1..30}; do
  if curl -sSf "$BASE_URL$PROBE_PATH" >/dev/null; then
    echo "Preview server is ready at $BASE_URL"
    # Probe and save response
    curl -I -sS "$BASE_URL$PROBE_PATH" | head -n 20 > "$REPORT_DIR/probe.response.txt"
    curl -sS "$BASE_URL$PROBE_PATH" | head -c 1024 >> "$REPORT_DIR/probe.response.txt"
    echo "Probe successful. Report saved to $REPORT_DIR"
    exit 0
  fi
  echo -n "."
  sleep 1
done

echo "\nError: Preview server did not start within 30 seconds."
exit 1
