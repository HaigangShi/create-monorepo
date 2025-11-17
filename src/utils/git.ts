import { execa } from 'execa';

export async function initializeGit(projectPath: string): Promise<void> {
  try {
    // Initialize git repository
    await execa('git', ['init'], { cwd: projectPath });

    // Create initial commit
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa('git', ['commit', '-m', 'Initial commit'], { cwd: projectPath });

    console.log('✅ Git repository initialized successfully');
  } catch (error) {
    console.warn('⚠️  Failed to initialize Git repository:');
    console.warn(error instanceof Error ? error.message : error);
    console.warn('You can manually initialize Git later with: git init');
  }
}

export async function checkGitInstalled(): Promise<boolean> {
  try {
    await execa('git', ['--version']);
    return true;
  } catch {
    return false;
  }
}

export async function checkGitClean(projectPath: string): Promise<boolean> {
  try {
    const { stdout } = await execa('git', ['status', '--porcelain'], { cwd: projectPath });
    return stdout.trim() === '';
  } catch {
    return false;
  }
}
