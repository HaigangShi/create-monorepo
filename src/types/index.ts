export interface MonorepoConfig {
  name: string;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  template: string;
  docker: boolean;
  skipInstall: boolean;
  skipGit: boolean;
  apps: AppConfig[];
  packages: PackageConfig[];
  services: ServiceConfig[];
  tools: ToolConfig[];
}

export interface AppConfig {
  name: string;
  type: 'next' | 'vue' | 'react' | 'svelte';
  port: number;
  features: string[];
}

export interface PackageConfig {
  name: string;
  type: 'ui' | 'utils' | 'types' | 'hooks' | 'composables' | 'api-client' | 'database' | 'config';
  shared: boolean;
}

export interface ServiceConfig {
  name: string;
  type: 'api-gateway' | 'user-service' | 'content-service' | 'auth-service' | 'worker-service';
  port: number;
  database?: boolean;
}

export interface ToolConfig {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface ProjectTemplate {
  name: string;
  description: string;
  apps: AppConfig[];
  packages: PackageConfig[];
  services: ServiceConfig[];
  tools: ToolConfig[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  install: (config: MonorepoConfig) => Promise<void>;
  uninstall: (config: MonorepoConfig) => Promise<void>;
}

export interface CLIContext {
  cwd: string;
  projectName: string;
  config: MonorepoConfig;
  spinner: any;
}
