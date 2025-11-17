import fs from 'fs-extra';
import path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.ensureDir(dir);
  await fs.writeFile(filePath, content, 'utf8');
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export async function copyTemplate(templatePath: string, targetPath: string): Promise<void> {
  await fs.copy(templatePath, targetPath);
}

export async function createDirectoryStructure(
  basePath: string,
  structure: Record<string, any>
): Promise<void> {
  for (const [key, value] of Object.entries(structure)) {
    const fullPath = path.join(basePath, key);

    if (typeof value === 'string') {
      const parent = path.dirname(fullPath);
      await fs.ensureDir(parent);
      await fs.writeFile(fullPath, value);
    } else if (value === null) {
      await ensureDir(fullPath);
    } else if (typeof value === 'object') {
      await ensureDir(fullPath);
      await createDirectoryStructure(fullPath, value);
    }
  }
}

export function formatJson(obj: any, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}

export function parseJson<T = any>(jsonString: string): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
