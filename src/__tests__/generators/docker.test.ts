import { generateDockerCompose, generateWebDockerfile, generateApiDockerfile, generateDockerignore, generateNginxConfig } from '../../generators/docker';
import { MonorepoConfig } from '../../types';

describe('Docker Generator', () => {
  const mockConfig: MonorepoConfig = {
    name: 'test-monorepo',
    packageManager: 'pnpm',
    template: 'default',
    docker: true,
    skipInstall: false,
    skipGit: false,
    apps: [
      {
        name: 'web-app',
        type: 'next',
        port: 3000,
        features: [],
      },
    ],
    packages: [],
    services: [
      {
        name: 'api-service',
        type: 'api-gateway',
        port: 4000,
        database: false,
      },
    ],
    tools: [],
  };

  describe('generateDockerCompose', () => {
    it('should generate docker-compose.yml with services', () => {
      const result = generateDockerCompose(mockConfig);
      
      expect(result).toContain('version: \'3.8\'');
      expect(result).toContain('services:');
      expect(result).toContain('web-app:');
      expect(result).toContain('api-service:');
      expect(result).toContain('redis:');
      expect(result).toContain('nginx:');
    });

    it('should include database service when needed', () => {
      const configWithDatabase = {
        ...mockConfig,
        services: [
          {
            name: 'user-service',
            type: 'user-service',
            port: 4001,
            database: true,
          },
        ],
      };

      const result = generateDockerCompose(configWithDatabase);
      expect(result).toContain('postgres:');
      expect(result).toContain('POSTGRES_DB: monorepo');
    });

    it('should include correct network configuration', () => {
      const result = generateDockerCompose(mockConfig);
      
      expect(result).toContain('networks:');
      expect(result).toContain('monorepo-network:');
    });

    it('should include volume configuration for database', () => {
      const configWithDatabase = {
        ...mockConfig,
        services: [
          {
            name: 'user-service',
            type: 'user-service',
            port: 4001,
            database: true,
          },
        ],
      };

      const result = generateDockerCompose(configWithDatabase);
      expect(result).toContain('volumes:');
      expect(result).toContain('postgres_data:');
    });
  });

  describe('generateWebDockerfile', () => {
    it('should generate multi-stage Dockerfile for web apps', () => {
      const result = generateWebDockerfile();
      
      expect(result).toContain('FROM node:18-alpine AS builder');
      expect(result).toContain('FROM node:18-alpine AS runner');
      expect(result).toContain('RUN pnpm install --frozen-lockfile');
      expect(result).toContain('RUN pnpm run build');
      expect(result).toContain('EXPOSE 3000');
      expect(result).toContain('HEALTHCHECK');
    });

    it('should include production dependencies installation', () => {
      const result = generateWebDockerfile();
      
      expect(result).toContain('RUN pnpm install --prod --frozen-lockfile');
    });

    it('should include health check', () => {
      const result = generateWebDockerfile();
      
      expect(result).toContain('HEALTHCHECK');
      expect(result).toContain('curl -f http://localhost:3000/health');
    });
  });

  describe('generateApiDockerfile', () => {
    it('should generate multi-stage Dockerfile for API services', () => {
      const result = generateApiDockerfile();
      
      expect(result).toContain('FROM node:18-alpine AS builder');
      expect(result).toContain('FROM node:18-alpine AS runner');
      expect(result).toContain('RUN pnpm install --frozen-lockfile');
      expect(result).toContain('RUN pnpm run build');
      expect(result).toContain('EXPOSE 4000');
      expect(result).toContain('HEALTHCHECK');
    });

    it('should include service-specific configuration', () => {
      const result = generateApiDockerfile();
      
      expect(result).toContain('COPY services/*/package.json ./services/*/');
      expect(result).toContain('COPY --from=builder /app/services ./services');
    });
  });

  describe('generateDockerignore', () => {
    it('should generate comprehensive .dockerignore', () => {
      const result = generateDockerignore();
      
      expect(result).toContain('node_modules');
      expect(result).toContain('.env');
      expect(result).toContain('.git');
      expect(result).toContain('dist');
      expect(result).toContain('.next');
      expect(result).toContain('coverage');
    });

    it('should include log files', () => {
      const result = generateDockerignore();
      
      expect(result).toContain('*.log');
      expect(result).toContain('logs');
    });

    it('should include OS-specific files', () => {
      const result = generateDockerignore();
      
      expect(result).toContain('.DS_Store');
      expect(result).toContain('Thumbs.db');
    });
  });

  describe('generateNginxConfig', () => {
    it('should generate nginx configuration with upstream servers', () => {
      const result = generateNginxConfig();
      
      expect(result).toContain('upstream frontend');
      expect(result).toContain('upstream api-gateway');
      expect(result).toContain('server {');
      expect(result).toContain('listen 80;');
      expect(result).toContain('location / {');
      expect(result).toContain('location /api {');
    });

    it('should include proxy configuration', () => {
      const result = generateNginxConfig();
      
      expect(result).toContain('proxy_pass');
      expect(result).toContain('proxy_set_header Host $host');
      expect(result).toContain('proxy_set_header X-Real-IP $remote_addr');
    });

    it('should include health check endpoint', () => {
      const result = generateNginxConfig();
      
      expect(result).toContain('location /health {');
      expect(result).toContain('return 200 "healthy\\n"');
    });
  });
});