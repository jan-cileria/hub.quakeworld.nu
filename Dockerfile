# Build stage
FROM node:20.18.3-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --immutable --frozen-lockfile

# Copy source code and configuration
COPY . .

# Build arguments for environment variables
ARG VITE_DEMOS_CLOUDFRONT_URL
ARG VITE_ASSETS_CLOUDFRONT_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SENTRY_ENVIRONMENT
ARG VITE_SENTRY_DSN

# Set environment variables for build
ENV VITE_DEMOS_CLOUDFRONT_URL=$VITE_DEMOS_CLOUDFRONT_URL
ENV VITE_ASSETS_CLOUDFRONT_URL=$VITE_ASSETS_CLOUDFRONT_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SENTRY_ENVIRONMENT=$VITE_SENTRY_ENVIRONMENT
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
