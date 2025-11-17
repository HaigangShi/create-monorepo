# Create Monorepo

A powerful CLI tool for quickly initializing and managing containerized monorepo development environments.

[![npm version](https://badge.fury.io/js/%40haigang.shi%2Fcreate-monorepo.svg)](https://badge.fury.io/js/%40haigang.shi%2Fcreate-monorepo)
[![CI/CD](https://github.com/HaigangShi/create-monorepo/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/HaigangShi/create-monorepo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **🎯 Quick Setup**: Generate a complete monorepo structure in seconds
- **📦 Multiple Templates**: Choose from various pre-configured templates
- **🐳 Containerized Development**: Built-in Docker and Docker Compose support
- **🔧 Development Tools**: Pre-configured ESLint, Prettier, TypeScript, and more
- **📱 Multi-Framework Support**: React, Vue, Next.js, Svelte applications
- **🔌 Plugin System**: Extensible architecture with plugin support
- **🧪 Comprehensive Testing**: Unit and E2E test setup included
- **📊 CI/CD Ready**: GitHub Actions workflows for automated testing and deployment
- **🎨 Interactive CLI**: Guided setup with intelligent prompts

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @haigang.shi/create-monorepo
```

### Using npx (No Installation)

```bash
npx @haigang.shi/create-monorepo my-project
```

### Using Yarn

```bash
yarn global add @haigang.shi/create-monorepo
```

### Using pnpm

```bash
pnpm add -g @haigang.shi/create-monorepo
```

## 🎯 Quick Start

### Create a New Monorepo

```bash
# Interactive mode (recommended)
create-monorepo my-monorepo

# Non-interactive mode with options
create-monorepo my-monorepo --template=next-fullstack --docker --package-manager=pnpm
```

### Navigate and Start Development

```bash
cd my-monorepo
pnpm install
pnpm run dev
```

## 📋 Available Templates

### Default Templates

- **`default`**: Full-featured monorepo with multiple apps and services
- **`minimal`**: Basic structure for simple projects
- **`next-fullstack`**: Next.js frontend with backend services
- **`vue-fullstack`**: Vue.js frontend with backend services  
- **`react-fullstack`**: React frontend with backend services
- **`enterprise`**: Complete enterprise setup with all tools

### Template Features

| Template | Apps | Services | Docker | CI/CD | Testing |
|----------|------|----------|---------|--------|---------|
| default | ✅ | ✅ | ✅ | ✅ | ✅ |
| minimal | ✅ | ❌ | ❌ | ✅ | ✅ |
| next-fullstack | ✅ | ✅ | ✅ | ✅ | ✅ |
| vue-fullstack | ✅ | ✅ | ✅ | ✅ | ✅ |
| react-fullstack | ✅ | ✅ | ✅ | ✅ | ✅ |
| enterprise | ✅ | ✅ | ✅ | ✅ | ✅ |

## 🔧 CLI Commands

### Create Command

```bash
# Create with interactive prompts
create-monorepo create my-project

# Create with specific options
create-monorepo create my-project --template=next-fullstack --docker --package-manager=pnpm

# Create with all options
create-monorepo create my-project \
  --template=enterprise \
  --package-manager=pnpm \
  --docker \
  --skip-install \
  --skip-git
```

#### Create Options

| Option | Description | Default |
|--------|-------------|---------|
| `--template` | Project template to use | `default` |
| `--package-manager` | Package manager (npm, yarn, pnpm) | `pnpm` |
| `--docker` | Include Docker configuration | `false` |
| `--skip-install` | Skip dependency installation | `false` |
| `--skip-git` | Skip git initialization | `false` |
| `--interactive` | Use interactive mode | `false` |

### Plugin Command

```bash
# List available plugins
create-monorepo plugin --list

# Install a plugin
create-monorepo plugin --install storybook

# Uninstall a plugin
create-monorepo plugin --uninstall storybook
```

#### Available Plugins

| Plugin | Description |
|--------|-------------|
| `storybook` | Component development environment |
| `playwright` | End-to-end testing framework |
| `cypress` | Alternative E2E testing framework |
| `jest` | Testing framework configuration |
| `prisma` | Database ORM and toolkit |
| `supabase` | Backend services integration |
| `stripe` | Payment processing integration |

### Doctor Command

```bash
# Run diagnostics on your monorepo
create-monorepo doctor
```

The doctor command checks:
- ✅ Node.js version compatibility
- ✅ Package manager availability
- ✅ Git installation and repository status
- ✅ Project structure integrity
- ✅ Dependencies and security vulnerabilities
- ✅ Docker installation (if configured)

## 🏗️ Project Structure

Generated monorepo structure:

```
my-monorepo/
├── apps/                      # Frontend applications
│   ├── corporate-website/     # Next.js corporate site
│   ├── admin-dashboard/       # Next.js admin panel
│   ├── mobile-h5/            # Vue.js mobile app
│   ├── cms-admin/            # Vue.js CMS
│   └── analytics-admin/      # React analytics dashboard
├── packages/                  # Shared packages
│   ├── ui/                   # UI components (React/Vue)
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript definitions
│   ├── hooks/                # React hooks
│   ├── composables/          # Vue composables
│   ├── api-client/           # API client libraries
│   ├── database/             # Database utilities
│   └── config/               # Configuration management
├── services/                  # Backend services
│   ├── api-gateway/         # API Gateway
│   ├── user-service/        # User management service
│   ├── content-service/     # Content management service
│   ├── auth-service/        # Authentication service
│   └── worker-service/      # Background job service
├── configs/                 # Shared configurations
│   ├── eslint/              # ESLint configurations
│   ├── typescript/          # TypeScript configurations
│   ├── vite/                # Vite configurations
│   ├── jest/                # Jest configurations
│   ├── tailwind/            # Tailwind CSS configurations
│   ├── env/                 # Environment configurations
│   └── docker/              # Docker configurations
├── scripts/                 # Build and utility scripts
│   ├── build/               # Build scripts
│   ├── deploy/              # Deployment scripts
│   ├── database/            # Database scripts
│   └── utils/               # Utility scripts
├── docs/                    # Documentation
│   ├── architecture/        # Architecture documentation
│   ├── development/         # Development guides
│   ├── api/                 # API documentation
│   └── operations/          # Operations guides
├── .changeset/             # Changeset management
├── .devcontainer/          # VS Code dev container
├── .github/                # GitHub workflows
├── .husky/                 # Git hooks
├── .vscode/                # VS Code settings
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── turbo.json              # TurboRepo configuration
└── README.md               # Project documentation
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services (Compose V2)
docker compose up -d

# Start specific services
docker compose up -d web-app api-service

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

On environments that still use the legacy binary, replace `docker compose` with `docker-compose`.

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| nginx | 80/443 | Reverse proxy and load balancer |
| web-app | 3000 | Frontend application |
| api-service | 4000 | Backend API service |
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache and message broker |

## 🛠️ Development Workflow

### Package Management

```bash
# Install dependencies for all packages
pnpm install

# Add dependency to specific package
pnpm add lodash --filter @monorepo/utils

# Add dev dependency to root
pnpm add -D typescript

# Run scripts across all packages
pnpm run build
pnpm run test
pnpm run lint
```

### Development Scripts

```bash
# Start development servers
pnpm run dev

# Build all packages and apps
pnpm run build

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Format code
pnpm run format

# Type checking
pnpm run typecheck

# Clean build artifacts
pnpm run clean
```

### Docker Development

```bash
# Start development environment
docker-compose up -d

# Rebuild specific service
docker-compose build web-app

# Run commands in container
docker-compose exec web-app pnpm run dev
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (Playwright)
pnpm test:e2e:ui

# Generate E2E test report
pnpm test:e2e:report
```

### Testing Structure

```
├── src/
│   ├── __tests__/           # Unit tests
│   │   ├── utils/
│   │   ├── generators/
│   │   └── commands/
│   └── __tests__/e2e/       # E2E tests
│       └── cli.test.ts
```

## 📊 CI/CD Pipeline

### GitHub Actions Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every push and PR
   - Tests across Node.js 16, 18, 20
   - Runs linting, type checking, and tests
   - Builds and validates the package

2. **Release Pipeline** (`.github/workflows/release.yml`)
   - Triggered on version changes
   - Creates GitHub releases
   - Publishes to NPM
   - Updates documentation

3. **Security Scanning** (`.github/workflows/security.yml`)
   - Weekly security audits
   - Dependency vulnerability scanning
   - CodeQL analysis
   - Secret scanning

### Environment Variables

Configure these in your GitHub repository settings:

- `NPM_TOKEN`: NPM publishing token
- `SNYK_TOKEN`: Snyk security scanning token
- `CODECOV_TOKEN`: Code coverage reporting token

## 🔧 Configuration

### Package Manager Configuration

The tool supports npm, yarn, and pnpm. pnpm is recommended for monorepos:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

### TurboRepo Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  web-app:
    build:
      context: .
      dockerfile: configs/docker/Dockerfile.web
    ports:
      - "3000:3000"
    depends_on:
      - api-service
      - postgres
      - redis
```

## 🎨 Customization

### Adding Custom Templates

Create custom templates by extending the generator functions:

```typescript
// src/generators/custom-template.ts
export async function generateCustomTemplate(projectPath: string, config: MonorepoConfig): Promise<void> {
  // Your custom template logic
}
```

### Creating Custom Plugins

```typescript
// src/plugins/custom-plugin.ts
export const customPlugin: Plugin = {
  name: 'custom-plugin',
  version: '1.0.0',
  description: 'Custom plugin description',
  install: async (config) => {
    // Installation logic
  },
  uninstall: async (config) => {
    // Uninstallation logic
  },
};
```

### Extending Configuration

Add custom configurations in the `configs/` directory:

```javascript
// configs/custom/webpack.config.js
module.exports = {
  // Custom webpack configuration
};
```

## 📚 Examples

### Example 1: Basic Monorepo

```bash
# Create a basic monorepo
create-monorepo my-basic-app --template=minimal

# Navigate and start
cd my-basic-app
pnpm install
pnpm run dev
```

### Example 2: Full-Stack Application

```bash
# Create a full-stack Next.js application
create-monorepo my-fullstack-app --template=next-fullstack --docker

# Start development
cd my-fullstack-app
pnpm install
docker-compose up -d
pnpm run dev
```

### Example 3: Enterprise Setup

```bash
# Create enterprise-grade monorepo
create-monorepo my-enterprise-app --template=enterprise

# Add additional tools
cd my-enterprise-app
create-monorepo plugin --install storybook
create-monorepo plugin --install playwright

# Start development
pnpm install
pnpm run dev
```

## 🚨 Troubleshooting

### Common Issues

#### Node.js Version
```bash
# Check Node.js version
node --version

# Update Node.js (using nvm)
nvm install 18
nvm use 18
```

#### Package Manager Issues
```bash
# Clear cache
pnpm store prune
npm cache clean --force
yarn cache clean

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Docker Issues
```bash
# Check Docker status
docker --version
docker-compose --version

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Git Issues
```bash
# Initialize git manually
git init
git add .
git commit -m "Initial commit"
```

### Getting Help

1. **Run Doctor**: `create-monorepo doctor`
2. **Check Logs**: Review console output and error messages
3. **GitHub Issues**: [Report issues on GitHub](https://github.com/HaigangShi/create-monorepo/issues)
4. **Documentation**: Check the `docs/` directory in your generated project

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/HaigangShi/create-monorepo.git
cd create-monorepo

# Install dependencies
npm install

# Run tests
npm test

# Run in development mode
npm run dev
```

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) for build system inspiration
- [Nx](https://nx.dev/) for monorepo tooling concepts
- [pnpm](https://pnpm.io/) for excellent workspace support
- All the amazing open-source tools that make this possible

## 📞 Support

- 📧 Email: haigang.shi@foxmail.com
- 💬 Discord: [Join our Discord](https://discord.gg/create-monorepo)
- 🐛 Issues: [GitHub Issues](https://github.com/HaigangShi/create-monorepo/issues)
- 📖 Documentation: [Full Documentation](https://create-monorepo.dev/docs)

---

Made with ❤️ by the Create Monorepo team