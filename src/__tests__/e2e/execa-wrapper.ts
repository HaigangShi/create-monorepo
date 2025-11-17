import { execFile } from 'child_process';

export async function execa(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        const out = (stdout || stderr).replace(/\r?\n/g, ' ');
        reject(Object.assign(error, { stdout: out, stderr }));
        return;
      }
      resolve({ stdout, stderr, exitCode: 0 });
    });
  });
}
