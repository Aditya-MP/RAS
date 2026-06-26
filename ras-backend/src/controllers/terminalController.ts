import { Request, Response } from 'express';
import { exec } from 'child_process';
import { writeFileSync, mkdtempSync, rmSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';

const BASE_SANDBOX = resolve(process.cwd(), 'sandbox');
if (!existsSync(BASE_SANDBOX)) {
  mkdirSync(BASE_SANDBOX, { recursive: true });
}

const BLOCKED_PREFIXES = [
  'rm -rf /', 'rmdir /s', 'format', 'mkfs', 'dd if=',
  ':(){', 'fork()', 'chmod 777 /', 'sudo', 'su ',
  'shutdown', 'reboot', 'init 0', 'poweroff',
];

export const execCommand = async (req: Request, res: Response) => {
  const { command, files } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'command is required' });
  }

  const trimmed = command.trim().toLowerCase();
  for (const blocked of BLOCKED_PREFIXES) {
    if (trimmed.includes(blocked.toLowerCase())) {
      return res.json({ stdout: '', stderr: `Blocked: dangerous command ('${blocked}')\n`, exitCode: 1 });
    }
  }

  let tmpDir = '';
  try {
    tmpDir = mkdtempSync(join(tmpdir(), 'ras-term-'));

    // Write workspace files so terminal commands can access them
    if (files && typeof files === 'object') {
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = join(tmpDir, filePath);
        const parentDir = fullPath.substring(0, fullPath.lastIndexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        if (parentDir && parentDir !== fullPath) {
          mkdirSync(parentDir, { recursive: true });
        }
        writeFileSync(fullPath, String(content), 'utf-8');
      }
    }

    const stdout = await new Promise<string>((resolvePromise, reject) => {
      exec(command, { timeout: 15000, cwd: tmpDir, windowsHide: true }, (err, stdout, stderr) => {
        if (err && (err as any).killed) {
          resolvePromise((stdout || '') + '\n[Terminal: execution timed out after 15s]');
          return;
        }
        resolvePromise(stdout || stderr || err?.message || '');
      });
    });

    res.json({ stdout, stderr: '', exitCode: 0 });
  } catch (err: any) {
    res.json({ stdout: '', stderr: `Error: ${err.message}`, exitCode: 1 });
  } finally {
    if (tmpDir) {
      try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* cleanup */ }
    }
  }
};
