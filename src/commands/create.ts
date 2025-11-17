import path from 'path';
import chalk from 'chalk';
import { Listr } from 'listr2';
import { MonorepoConfig } from '../types';
import { promptForMonorepoConfig } from '../utils/prompts';
import { generateProjectStructure } from '../generators/project';
import { generateDockerConfig } from '../generators/docker';
import { generatePackageJson } from '../generators/package-json';
import { generateToolConfigs } from '../generators/tools';
import { initializeGit } from '../utils/git';
import { installDependencies } from '../utils/package-manager';
import { validateProjectName } from '../utils/validation';
import { fileExists } from '../utils/file-system';

interface CreateOptions {
  template?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  docker?: boolean;
  skipInstall?: boolean;
  skipGit?: boolean;
  interactive?: boolean;
}

export async function createMonorepo(
  projectName?: string,
  options: CreateOptions = {}
): Promise<void> {
  console.log(chalk.blue('🚀 Creating your monorepo project...\n'));

  try {
    // Get project configuration
    let config: MonorepoConfig;

    if (options.interactive) {
      config = await promptForMonorepoConfig();
      if (projectName) {
        config.name = projectName;
      }
    } else {
      if (!projectName) {
        throw new Error('Project name is required in non-interactive mode');
      }

      // Validate project name
      const validation = validateProjectName(projectName);
      if (!validation.valid) {
        throw new Error(`Invalid project name: ${validation.errors.join(', ')}`);
      }

      config = {
        name: projectName,
        packageManager: options.packageManager || 'pnpm',
        template: options.template || 'default',
        docker: options.docker || false,
        skipInstall: options.skipInstall || false,
        skipGit: options.skipGit || false,
        apps: [],
        packages: [],
        services: [],
        tools: [],
      };
    }

    const projectPath = path.resolve(process.cwd(), config.name);

    // Check if project directory already exists
    if (await fileExists(projectPath)) {
      throw new Error(`Directory "${config.name}" already exists. Please choose a different name.`);
    }

    // Create tasks for project generation
    const tasks = new Listr([
      {
        title: 'Creating project structure',
        task: async () => {
          await generateProjectStructure(projectPath, config);
        },
      },
      {
        title: 'Generating package.json files',
        task: async () => {
          await generatePackageJson(projectPath, config);
        },
      },
      {
        title: 'Configuring development tools',
        task: async () => {
          await generateToolConfigs(projectPath, config);
        },
      },
      {
        title: config.docker ? 'Setting up Docker configuration' : 'Skipping Docker setup',
        task: async () => {
          if (config.docker) {
            await generateDockerConfig(projectPath, config);
          }
        },
      },
      {
        title: config.skipGit ? 'Skipping Git initialization' : 'Initializing Git repository',
        task: async () => {
          if (!config.skipGit) {
            await initializeGit(projectPath);
          }
        },
      },
      {
        title: config.skipInstall ? 'Skipping dependency installation' : 'Installing dependencies',
        task: async () => {
          if (!config.skipInstall) {
            await installDependencies(projectPath, config.packageManager);
          }
        },
      },
    ]);

    // Run tasks
    await tasks.run();

    console.log(chalk.green('\n✅ Monorepo project created successfully!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${config.name}`));

    if (config.skipInstall) {
      console.log(chalk.white(`  ${config.packageManager} install`));
    }

    if (config.docker) {
      console.log(chalk.white(`  docker-compose up -d`));
    }

    console.log(chalk.white(`  ${config.packageManager} run dev`));
    console.log();
    console.log(chalk.gray('For more information, see the documentation in your project folder.'));
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to create monorepo:'));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
