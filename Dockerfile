# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm i -g pnpm@9 && pnpm i --frozen-lockfile || npm ci || yarn install --frozen-lockfile
COPY . .
RUN pnpm build || npm run build || yarn build

FROM nginx:1.27-alpine
RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# 單頁應用 SPA fallback + API proxy
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  \n\
  # Disable caching for runtime config (dynamically generated at container startup)\n\
  location = /runtime-config.js {\n\
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\n\
    add_header Pragma "no-cache";\n\
    add_header Expires "0";\n\
    try_files $uri =404;\n\
  }\n\
  \n\
  # Proxy API requests to backend\n\
  location /api/ {\n\
    proxy_pass http://kai-backend:9900;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    proxy_set_header Host $host;\n\
    proxy_set_header X-Real-IP $remote_addr;\n\
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    proxy_set_header X-Forwarded-Proto $scheme;\n\
  }\n\
  \n\
  # Proxy Flexy sandbox requests to backend\n\
  location /flexy/ {\n\
    proxy_pass http://kai-backend:9900;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    proxy_set_header Host $host;\n\
    proxy_set_header X-Real-IP $remote_addr;\n\
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    proxy_set_header X-Forwarded-Proto $scheme;\n\
  }\n\
  \n\
  # Proxy code-server requests to backend\n\
  location /code-server/ {\n\
    proxy_pass http://kai-backend:9900;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Upgrade $http_upgrade;\n\
    proxy_set_header Connection "upgrade";\n\
    proxy_set_header Host $host;\n\
    proxy_set_header X-Real-IP $remote_addr;\n\
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    proxy_set_header X-Forwarded-Proto $scheme;\n\
  }\n\
  \n\
  # SPA fallback for console routes\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=5s --timeout=3s --retries=20 CMD curl -f http://localhost/ || exit 1
ENTRYPOINT ["/entrypoint.sh"]
