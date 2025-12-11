# Dockerization Outline for QuakeWorld Hub

## Overview
This document outlines the strategy for containerizing the QuakeWorld Hub application, a Vite-based React SPA with multiple entry points.

## Application Architecture
- **Framework**: Vite + React
- **Node Version**: 20.18.3
- **Package Manager**: Yarn
- **Build Output**: `dist/` directory
- **Entry Points**: 7 routes (main, games, players, qtv, qtv-popout, scoreboard, profile)
- **Current Deployment**: Firebase Hosting

## Docker Strategy

### 1. Multi-Stage Dockerfile Approach

#### Stage 1: Build Stage
- **Base Image**: `node:20.18.3-alpine` (matches .tool-versions)
- **Purpose**: Install dependencies and build the application
- **Steps**:
  1. Install Yarn (if not included in base image)
  2. Copy `package.json` and `yarn.lock`
  3. Run `yarn install --immutable` (production dependencies only)
  4. Copy source code and configuration files
  5. Set environment variables for build-time
  6. Run `yarn build` (executes `tsc && vite build`)
  7. Output: `dist/` directory with static assets

#### Stage 2: Production Stage
- **Base Image**: `nginx:alpine` (lightweight web server)
- **Purpose**: Serve static files efficiently
- **Steps**:
  1. Copy built `dist/` from build stage
  2. Configure Nginx for SPA routing
  3. Set up proper caching headers
  4. Configure security headers
  5. Expose port 80 (or configurable)

### 2. Dockerfile Structure

```dockerfile
# Build stage
FROM node:20.18.3-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable --frozen-lockfile
COPY . .
ARG VITE_DEMOS_CLOUDFRONT_URL
ARG VITE_ASSETS_CLOUDFRONT_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SENTRY_ENVIRONMENT
ARG VITE_SENTRY_DSN
ENV VITE_DEMOS_CLOUDFRONT_URL=$VITE_DEMOS_CLOUDFRONT_URL
ENV VITE_ASSETS_CLOUDFRONT_URL=$VITE_ASSETS_CLOUDFRONT_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SENTRY_ENVIRONMENT=$VITE_SENTRY_ENVIRONMENT
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Nginx Configuration

**File**: `nginx.conf`

Key requirements:
- **SPA Routing**: All routes should fallback to `index.html` for client-side routing
- **Multiple Entry Points**: Handle routing for 7 different entry points:
  - `/` → `index.html`
  - `/games/*` → `games/index.html`
  - `/players/*` → `players/index.html`
  - `/qtv/*` → `qtv/index.html`
  - `/qtv-popout/*` → `qtv-popout/index.html`
  - `/scoreboard/*` → `scoreboard/index.html`
  - `/profile/*` → `profile/index.html`
- **Caching Strategy**:
  - Static assets (JS, CSS, images): Long cache with versioning
  - HTML files: No cache (for updates)
  - Games route: No cache (as per firebase.json)
- **Security Headers**: Add security headers (CSP, X-Frame-Options, etc.)
- **Gzip Compression**: Enable for text-based assets
- **MIME Types**: Ensure proper MIME types for all assets

### 4. Environment Variables Management

#### Build-Time Variables (Required)
These must be available during the build stage:
- `VITE_DEMOS_CLOUDFRONT_URL`
- `VITE_ASSETS_CLOUDFRONT_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_ENVIRONMENT`
- `VITE_SENTRY_DSN`

#### Options for Environment Variables:
1. **Docker Build Args**: Pass via `--build-arg` during build
2. **.env File**: Use `docker-compose` with `.env` file
3. **Secrets Management**: Use Docker secrets or external secret managers
4. **Runtime Injection**: For production, consider runtime environment injection (requires additional setup)

### 5. Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
version: '3.8'
services:
  quakeworld-hub:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_DEMOS_CLOUDFRONT_URL: ${VITE_DEMOS_CLOUDFRONT_URL}
        VITE_ASSETS_CLOUDFRONT_URL: ${VITE_ASSETS_CLOUDFRONT_URL}
        VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}
        VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY}
        VITE_SENTRY_ENVIRONMENT: ${VITE_SENTRY_ENVIRONMENT}
        VITE_SENTRY_DSN: ${VITE_SENTRY_DSN}
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
```

**File**: `.env.example`
```env
VITE_DEMOS_CLOUDFRONT_URL=https://demos.example.com
VITE_ASSETS_CLOUDFRONT_URL=https://assets.example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### 6. Development vs Production

#### Development Docker Setup
- Use `vite dev` server instead of Nginx
- Mount volumes for hot-reload
- Expose Vite dev server port (typically 5173)
- Include dev dependencies

#### Production Docker Setup
- Multi-stage build (as outlined above)
- Optimized Nginx configuration
- Minimal image size
- No dev dependencies

### 7. File Structure

```
.
├── Dockerfile
├── Dockerfile.dev          # Optional: Development Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml  # Optional: Development compose
├── nginx.conf
├── .dockerignore
├── .env.example
└── DOCKER_OUTLINE.md
```

### 8. .dockerignore File

**File**: `.dockerignore`

```
node_modules
dist
.git
.github
.idea
.vscode
coverage
*.log
.env*
!.env.example
.firebase
.firebaserc
tests
*.test.js
*.test.ts
*.test.tsx
README.md
DOCKER_OUTLINE.md
```

### 9. Implementation Steps

1. **Create Dockerfile** (multi-stage build)
2. **Create nginx.conf** (SPA routing + caching)
3. **Create .dockerignore** (exclude unnecessary files)
4. **Create docker-compose.yml** (orchestration)
5. **Create .env.example** (template for environment variables)
6. **Test locally**:
   - Build: `docker build -t quakeworld-hub .`
   - Run: `docker run -p 8080:80 quakeworld-hub`
7. **Update CI/CD** (optional):
   - Add Docker build step to GitHub Actions
   - Push to container registry
   - Deploy to container platform

### 10. Testing Checklist

- [ ] All 7 entry points load correctly
- [ ] Client-side routing works (no 404s on refresh)
- [ ] Environment variables are correctly injected
- [ ] Static assets are served with proper caching
- [ ] Gzip compression works
- [ ] Security headers are present
- [ ] Image size is optimized
- [ ] Build time is reasonable

### 11. Deployment Options

#### Option A: Docker Hub / Container Registry
- Build and push image
- Pull and run on server
- Use with orchestration (Docker Compose, Kubernetes, etc.)

#### Option B: Cloud Platforms
- **AWS**: ECS, EKS, or App Runner
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **DigitalOcean**: App Platform, Droplets
- **Fly.io**: Direct Docker deployment

#### Option C: Self-Hosted
- Run on VPS with Docker
- Use Docker Compose for orchestration
- Set up reverse proxy (Traefik, Caddy, etc.)

### 12. Additional Considerations

#### Performance
- Enable Nginx caching for static assets
- Use HTTP/2 if possible
- Consider CDN for static assets (already using CloudFront)
- Implement proper cache headers

#### Security
- Keep base images updated
- Scan images for vulnerabilities
- Use non-root user in Nginx (alpine images do this by default)
- Implement rate limiting if needed
- Add security headers (CSP, HSTS, etc.)

#### Monitoring
- Health check endpoint
- Logging configuration
- Metrics collection (if needed)

#### Multi-Architecture Support
- Consider building for multiple architectures (amd64, arm64)
- Use Docker buildx for cross-platform builds

### 13. Alternative: Development Dockerfile

For local development with hot-reload:

```dockerfile
FROM node:20.18.3-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host"]
```

### 14. Troubleshooting

Common issues and solutions:
- **Build fails**: Check environment variables are set
- **Routes return 404**: Verify Nginx routing configuration
- **Assets not loading**: Check base paths and MIME types
- **Large image size**: Ensure multi-stage build is working
- **Slow builds**: Use Docker layer caching effectively

## Next Steps

1. Review and approve this outline
2. Implement Dockerfile with multi-stage build
3. Create Nginx configuration for SPA routing
4. Set up Docker Compose for local testing
5. Test all entry points and routes
6. Document environment variable setup
7. Update CI/CD pipeline (if applicable)
8. Deploy to target environment
