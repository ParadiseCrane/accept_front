# syntax=docker/dockerfile:1.4
# Accept Frontend - Next.js Application
# Optimized multi-stage build for production deployment

ARG NODE_VERSION=20

###############################################################################
# Stage 1: Dependencies - Install packages only
###############################################################################
FROM node:${NODE_VERSION}-alpine AS deps

# Install libc6-compat for Next.js compatibility on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package manifests
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on available lock file
RUN \
  if [ -f yarn.lock ]; then \
    corepack enable && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No lock file found" && exit 1; \
  fi

###############################################################################
# Stage 2: Builder - Build Next.js application
###############################################################################
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Set build-time environment variables
ARG API_ENDPOINT
ARG NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=${NODE_ENV} \
    API_ENDPOINT=${API_ENDPOINT}

# Build Next.js application
RUN \
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f package-lock.json ]; then \
    npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm build; \
  fi

###############################################################################
# Stage 3: Runner - Minimal production image
###############################################################################
FROM node:${NODE_VERSION}-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (if they exist)
COPY --from=builder /app/public ./public

# Create .next directory with proper permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application from standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js server
CMD ["node", "server.js"]
