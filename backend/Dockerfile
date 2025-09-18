# ========= base =========
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl \
 && addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 \
 && chown -R nodejs:nodejs /app
USER nodejs

# ========= dev =========
FROM base AS dev
ENV NODE_ENV=development
COPY --chown=nodejs:nodejs package*.json ./
# если есть lockfile — npm ci, иначе npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ========= deps (prod) =========
FROM base AS deps
COPY --chown=nodejs:nodejs package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# ========= runner (prod) =========
FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --chown=nodejs:nodejs . .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:5000/health || exit 1
CMD ["npm", "start"]
