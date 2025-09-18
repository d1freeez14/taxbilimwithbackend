# ========= base =========
FROM node:18-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# важные XDG/кеши, чтобы не лезть в /root
ENV HOME=/home/nodejs \
    NPM_CONFIG_CACHE=/home/nodejs/.npm \
    NPM_CONFIG_PREFIX=/home/nodejs/.npm-global \
    XDG_CACHE_HOME=/home/nodejs/.cache \
    XDG_CONFIG_HOME=/home/nodejs/.config \
    XDG_DATA_HOME=/home/nodejs/.local/share
RUN addgroup -g 1001 -S nodejs \
 && adduser -S -D -u 1001 -h /home/nodejs -G nodejs nodejs \
 && mkdir -p /home/nodejs && chown -R nodejs:nodejs /home/nodejs /app
USER nodejs

# ========= deps =========
FROM base AS deps
COPY --chown=nodejs:nodejs package*.json ./
# reproducible install
RUN npm ci

# ========= builder (prod) =========
FROM base AS builder
COPY --from=deps /app/node_modules /app/node_modules
COPY --chown=nodejs:nodejs . .
# включаем standalone-сборку — меньше runtime-зависимостей
ENV NODE_ENV=production
RUN npx --yes next@14.2.25 telemetry disable || true
RUN npm run build

# ========= runner (prod) =========
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# создаём пользователя
RUN addgroup -g 1001 -S nodejs \
 && adduser -S -D -u 1001 -h /home/nodejs -G nodejs nodejs
USER nodejs

# копим только нужное (standalone)
COPY --chown=nodejs:nodejs --from=builder /app/public ./public
COPY --chown=nodejs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nodejs:nodejs --from=builder /app/.next/static ./.next/static

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "server.js"]

# ========= dev (target) =========
FROM base AS dev
ENV NODE_ENV=development
# ставим dev-зависимости
COPY --chown=nodejs:nodejs package*.json ./
RUN npm install
# исходники будут примонтированы томом
EXPOSE 3001
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
