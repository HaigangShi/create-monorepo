import path from 'path';
import { MonorepoConfig } from '../types';
import { writeFile } from '../utils/file-system';

export async function generateDockerConfig(projectPath: string, config: MonorepoConfig): Promise<void> {
  // Generate Docker Compose configuration
  const dockerComposeContent = generateDockerCompose(config);
  await writeFile(path.join(projectPath, 'docker-compose.yml'), dockerComposeContent);

  // Generate Dockerfiles for different services
  const dockerPath = path.join(projectPath, 'configs', 'docker');
  
  const dockerfiles = {
    'Dockerfile.web': generateWebDockerfile(),
    'Dockerfile.api': generateApiDockerfile(),
  };

  for (const [filename, content] of Object.entries(dockerfiles)) {
    await writeFile(path.join(dockerPath, filename), content);
  }

  // Generate .dockerignore
  const dockerignoreContent = generateDockerignore();
  await writeFile(path.join(projectPath, '.dockerignore'), dockerignoreContent);

  // Generate nginx configuration
  const nginxConfig = generateNginxConfig();
  await writeFile(path.join(projectPath, 'configs', 'nginx', 'nginx.conf'), nginxConfig);
}

function generateDockerCompose(config: MonorepoConfig): string {
  const services: string[] = [];
  const volumes: string[] = [];
  const networks: string[] = ['monorepo-network'];

  // Add database service if any service requires it
  const hasDatabase = config.services.some(service => service.database);
  if (hasDatabase) {
    services.push(`
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: monorepo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - monorepo-network`);
    
    volumes.push('postgres_data:');
  }

  // Add Redis for caching
  services.push(`
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - monorepo-network`);

  // Add applications
  config.apps.forEach((app, index) => {
    services.push(`
  ${app.name}:
    build:
      context: .
      dockerfile: configs/docker/Dockerfile.web
    ports:
      - "${3000 + index}:3000"
    volumes:
      - ./apps/${app.name}:/app/apps/${app.name}
      - ./packages:/app/packages
    networks:
      - monorepo-network
    depends_on:
      - redis${hasDatabase ? '\n      - postgres' : ''}`);
  });

  // Add services
  config.services.forEach((service, index) => {
    services.push(`
  ${service.name}:
    build:
      context: .
      dockerfile: configs/docker/Dockerfile.api
    ports:
      - "${4000 + index}:${service.port}"
    volumes:
      - ./services/${service.name}:/app/services/${service.name}
      - ./packages:/app/packages
    networks:
      - monorepo-network
    depends_on:
      - redis${hasDatabase && service.database ? '\n      - postgres' : ''}`);
  });

  // Add nginx reverse proxy
  services.push(`
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./configs/nginx/nginx.conf:/etc/nginx/nginx.conf
    networks:
      - monorepo-network
    depends_on:${config.apps.map(app => `\n      - ${app.name}`).join('')}${config.services.map(service => `\n      - ${service.name}`).join('')}`);

  return `version: '3.8'

services:${services.join('')}

volumes:${volumes.map(vol => `\n  ${vol}`).join('')}

networks:${networks.map(net => `\n  ${net}:`).join('')}
`;
}

function generateWebDockerfile(): string {
  return `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/*/package.json ./apps/*/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build applications
RUN pnpm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/*/package.json ./apps/*/
COPY packages/*/package.json ./packages/*/

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built applications
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start command
CMD ["pnpm", "start"]
`;
}

function generateApiDockerfile(): string {
  return `# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY services/*/package.json ./services/*/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build services
RUN pnpm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY services/*/package.json ./services/*/
COPY packages/*/package.json ./packages/*/

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built services
COPY --from=builder /app/services ./services
COPY --from=builder /app/packages ./packages

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:4000/health || exit 1

# Start command
CMD ["pnpm", "start"]
`;
}

function generateDockerignore(): string {
  return `# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist
build
.next
out

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Git
.git
.gitignore

# Documentation
docs
*.md

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
`;
}

function generateNginxConfig(): string {
  return `events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server corporate-website:3000;
    }

    upstream admin {
        server admin-dashboard:3001;
    }

    upstream api-gateway {
        server api-gateway:4000;
    }

    upstream user-service {
        server user-service:4001;
    }

    upstream content-service {
        server content-service:4002;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Admin routes
        location /admin {
            proxy_pass http://admin;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API routes
        location /api {
            proxy_pass http://api-gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # User service routes
        location /api/users {
            proxy_pass http://user-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Content service routes
        location /api/content {
            proxy_pass http://content-service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
`;
}