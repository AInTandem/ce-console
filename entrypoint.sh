#!/bin/sh
set -eu

# Generate runtime config from environment variables
cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.__KAI_CONFIG__ = {
  apiBaseUrl: "${API_BASE_URL:-}"
};
EOF

# Start Nginx in the foreground
exec nginx -g 'daemon off;'

