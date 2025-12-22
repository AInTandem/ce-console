#!/usr/bin/env bash
set -euo pipefail
ENV_FILE=".env.local"
: "${AUTO_DEFAULTS:=0}"

prompt() {
  local key="$1"; local def="$2"; local val
  if [[ "$AUTO_DEFAULTS" == "1" ]]; then
    echo "$key=$def" >> "$ENV_FILE"
    echo "set $key (default)"
  else
    read -p "$key [$def]: " val || true
    val=${val:-$def}
    echo "$key=$val" >> "$ENV_FILE"
  fi
}

rm -f "$ENV_FILE" && touch "$ENV_FILE"
prompt "VITE_APP_ENV" "development"
prompt "VITE_API_BASE_URL" "http://localhost:9900"
echo "Generated $ENV_FILE"
