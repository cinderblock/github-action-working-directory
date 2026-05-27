import {
  spawn as nodeSpawn,
  exec as nodeExec,
  type SpawnOptions,
  type PromiseWithChild,
} from 'node:child_process';
import { promisify } from 'node:util';

const defaultShell = '/bin/bash';

/** Spawn `command [args...]` with stdio inherited from the parent.
 *  Resolves when the child exits 0; rejects with `Error("Exit code: N")` otherwise.
 *
 *  Overloads:
 *  - `spawn(command, true, ...args)` — run `command` via the default shell.
 *  - `spawn(command, options, ...args)` — pass through SpawnOptions (e.g. `{ cwd }`).
 *  - `spawn(command, ...args)` — straight argv. */
export function spawn(
  command: string,
  shell: true,
  ...args: string[]
): PromiseWithChild<void>;
export function spawn(
  command: string,
  options: SpawnOptions,
  ...args: string[]
): PromiseWithChild<void>;
export function spawn(command: string, ...args: string[]): PromiseWithChild<void>;
export function spawn(
  command: string,
  first?: string | SpawnOptions | true,
  ...args: string[]
): PromiseWithChild<void> {
  const defOpts: SpawnOptions = { stdio: 'inherit' };

  const allArgs = typeof first === 'string' ? [first, ...args] : args;
  const opts =
    first === true
      ? { ...defOpts, shell: defaultShell }
      : typeof first === 'object' && first !== null
        ? { ...defOpts, ...first }
        : defOpts;

  const proc = nodeSpawn(command, allArgs, opts);

  const ret = new Promise<void>((resolve, reject) => {
    proc.on('exit', exitCode => {
      if (exitCode) reject(new Error(`Exit code: ${exitCode}`));
      else resolve();
    });
    proc.on('error', reject);
  }) as PromiseWithChild<void>;

  ret.child = proc;
  return ret;
}

const execP = promisify(nodeExec);

/** Run a command and capture its stdout/stderr.
 *
 *  - `shell: true` (default) — wrap in the default shell.
 *  - `shell: 'name'` — wrap in the given shell.
 *  - `shell: null` — no shell; `command` is a single executable. */
export function exec(
  command: string,
  shell: true | null | string = true,
): PromiseWithChild<{ stdout: string; stderr: string }> {
  if (shell === null) return execP(command);
  if (shell === true) shell = defaultShell;
  return execP(command, { shell }) as PromiseWithChild<{ stdout: string; stderr: string }>;
}
