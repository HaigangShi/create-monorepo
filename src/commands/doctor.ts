import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import { fileExists } from '../utils/file-system';
import { checkGitInstalled } from '../utils/git';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  suggestion?: string;
}

export async function runDoctor(): Promise<void> {
  console.log(chalk.blue('🔍 Running monorepo diagnostics...\n'));

  const spinner = ora('Checking system requirements...').start();

  try {
    const results: DiagnosticResult[] = [];

    // Check Node.js version
    results.push(await checkNodeVersion());

    // Check package managers
    results.push(await checkPackageManagers());

    // Check Git
    results.push(await checkGit());

    // Check project structure
    results.push(await checkProjectStructure());

    // Check dependencies
    results.push(await checkDependencies());

    // Check Docker (if applicable)
    results.push(await checkDocker());

    spinner.stop();

    // Display results
    displayResults(results);

    // Provide recommendations
    provideRecommendations(results);

  } catch (error) {
    spinner.fail(chalk.red('❌ Diagnostic check failed'));
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function checkNodeVersion(): Promise<DiagnosticResult> {
  try {
    const { stdout } = await execa('node', ['--version']);
    const version = stdout.trim();
    const majorVersion = parseInt(version.slice(1).split('.')[0] || '0');

    if (majorVersion >= 16) {
      return {
        name: 'Node.js Version',
        status: 'pass',
        message: `Node.js ${version} (✓)`,
      };
    } else {
      return {
        name: 'Node.js Version',
        status: 'fail',
        message: `Node.js ${version} (✗)`,
        suggestion: 'Please upgrade to Node.js 16 or higher',
      };
    }
  } catch (error) {
    return {
      name: 'Node.js Version',
      status: 'fail',
      message: 'Node.js not found',
      suggestion: 'Please install Node.js 16 or higher',
    };
  }
}

async function checkPackageManagers(): Promise<DiagnosticResult> {
  const packageManagers = ['npm', 'yarn', 'pnpm'];
  const available: string[] = [];
  const versions: Record<string, string> = {};

  for (const pm of packageManagers) {
    try {
      const { stdout } = await execa(pm, ['--version']);
      available.push(pm);
      versions[pm] = stdout.trim();
    } catch {
      // Package manager not available
    }
  }

  if (available.length === 0) {
    return {
      name: 'Package Managers',
      status: 'fail',
      message: 'No package managers found',
      suggestion: 'Please install npm, yarn, or pnpm',
    };
  }

  const recommended = available.includes('pnpm') ? 'pnpm' : 'yarn';
  const message = available.map(pm => `${pm} ${versions[pm]}`).join(', ');

  return {
    name: 'Package Managers',
    status: 'pass',
    message: `${message} (Recommended: ${recommended})`,
    suggestion: available.includes('pnpm') ? undefined : 'Consider using pnpm for better monorepo support',
  };
}

async function checkGit(): Promise<DiagnosticResult> {
  const isGitInstalled = await checkGitInstalled();
  
  if (!isGitInstalled) {
    return {
      name: 'Git',
      status: 'warn',
      message: 'Git not found',
      suggestion: 'Consider installing Git for version control',
    };
  }

  try {
    const { stdout } = await execa('git', ['--version']);
    const version = stdout.trim();

    // Check if we're in a git repository
    try {
      await execa('git', ['rev-parse', '--git-dir']);
      return {
        name: 'Git',
        status: 'pass',
        message: `${version} (✓ Repository detected)`,
      };
    } catch {
      return {
        name: 'Git',
        status: 'warn',
        message: `${version} (No repository)`,
        suggestion: 'Consider initializing a Git repository',
      };
    }
  } catch (error) {
    return {
      name: 'Git',
      status: 'fail',
      message: 'Git check failed',
      suggestion: 'Please check your Git installation',
    };
  }
}

async function checkProjectStructure(): Promise<DiagnosticResult> {
  const requiredFiles = [
    'package.json',
    'pnpm-workspace.yaml',
    'turbo.json',
  ];

  const optionalFiles = [
    'apps',
    'packages',
    'services',
    'configs',
  ];

  const missingRequired: string[] = [];
  const foundOptional: string[] = [];

  for (const file of requiredFiles) {
    if (!(await fileExists(file))) {
      missingRequired.push(file);
    }
  }

  for (const file of optionalFiles) {
    if (await fileExists(file)) {
      foundOptional.push(file);
    }
  }

  if (missingRequired.length > 0) {
    return {
      name: 'Project Structure',
      status: 'fail',
      message: `Missing: ${missingRequired.join(', ')}`,
      suggestion: 'Run create-monorepo to initialize your project',
    };
  }

  if (foundOptional.length === 0) {
    return {
      name: 'Project Structure',
      status: 'warn',
      message: 'Basic structure found, but no apps/packages/services',
      suggestion: 'Consider adding applications and packages to your monorepo',
    };
  }

  return {
    name: 'Project Structure',
    status: 'pass',
    message: `Found: ${foundOptional.join(', ')}`,
  };
}

async function checkDependencies(): Promise<DiagnosticResult> {
  try {
    const packageJsonExists = await fileExists('package.json');
    if (!packageJsonExists) {
      return {
        name: 'Dependencies',
        status: 'warn',
        message: 'No package.json found',
        suggestion: 'Initialize your project first',
      };
    }

    // Check if node_modules exists
    const nodeModulesExists = await fileExists('node_modules');
    if (!nodeModulesExists) {
      return {
        name: 'Dependencies',
        status: 'warn',
        message: 'Dependencies not installed',
        suggestion: 'Run pnpm install to install dependencies',
      };
    }

    // Check for security vulnerabilities
    try {
      await execa('pnpm', ['audit', '--audit-level', 'high']);
      return {
        name: 'Dependencies',
        status: 'pass',
        message: 'Dependencies installed and secure',
      };
    } catch (error) {
      return {
        name: 'Dependencies',
        status: 'warn',
        message: 'Security vulnerabilities found',
        suggestion: 'Run pnpm audit and fix security issues',
      };
    }
  } catch (error) {
    return {
      name: 'Dependencies',
      status: 'fail',
      message: 'Dependency check failed',
      suggestion: 'Check your package.json and try installing dependencies',
    };
  }
}

async function checkDocker(): Promise<DiagnosticResult> {
  try {
    const { stdout } = await execa('docker', ['--version']);
    const version = stdout.trim();

    // Check if docker-compose is available
    try {
      await execa('docker-compose', ['--version']);
      return {
        name: 'Docker',
        status: 'pass',
        message: `${version} (✓ Docker Compose available)`,
      };
    } catch {
      return {
        name: 'Docker',
        status: 'warn',
        message: `${version} (Docker Compose not found)`,
        suggestion: 'Install Docker Compose for multi-container development',
      };
    }
  } catch (error) {
    return {
      name: 'Docker',
      status: 'warn',
      message: 'Docker not found',
      suggestion: 'Install Docker for containerized development',
    };
  }
}

function displayResults(results: DiagnosticResult[]): void {
  console.log(chalk.blue('\n📋 Diagnostic Results:\n'));

  results.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    const color = result.status === 'pass' ? 'green' : result.status === 'warn' ? 'yellow' : 'red';
    
    console.log(`${icon} ${chalk.bold(result.name)}: ${chalk[color](result.message)}`);
    
    if (result.suggestion) {
      console.log(chalk.gray(`   💡 ${result.suggestion}`));
    }
    
    console.log();
  });
}

function provideRecommendations(results: DiagnosticResult[]): void {
  const failedChecks = results.filter(r => r.status === 'fail');
  const warningChecks = results.filter(r => r.status === 'warn');

  if (failedChecks.length === 0 && warningChecks.length === 0) {
    console.log(chalk.green('🎉 All checks passed! Your monorepo is ready for development.'));
    return;
  }

  if (failedChecks.length > 0) {
    console.log(chalk.red(`\n❌ ${failedChecks.length} critical issues found:`));
    failedChecks.forEach(check => {
      console.log(chalk.red(`   • ${check.name}: ${check.message}`));
    });
  }

  if (warningChecks.length > 0) {
    console.log(chalk.yellow(`\n⚠️  ${warningChecks.length} warnings:`));
    warningChecks.forEach(check => {
      console.log(chalk.yellow(`   • ${check.name}: ${check.message}`));
    });
  }

  console.log(chalk.blue('\n🔧 To fix these issues:'));
  console.log(chalk.white('   1. Address critical issues first (❌)'));
  console.log(chalk.white('   2. Consider addressing warnings (⚠️)'));
  console.log(chalk.white('   3. Run "create-monorepo doctor" again to verify fixes'));
  console.log(chalk.gray('\n   For detailed setup instructions, see: docs/development/setup.md'));
}