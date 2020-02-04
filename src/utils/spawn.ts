import {
  spawn as nodeSpawn,
  exec as nodeExec,
  SpawnOptions,
  PromiseWithChild,
} from 'child_process';

import { promisify } from 'util';

const defaultShell = '/bin/bash';

/**
 * These are functions that run some other program
 * Each is some combination of these running modes
 *
 * - Shell                       vs  Command + args
 * - Captured & Buffered output  vs  Stream to stdout/stderr
 * - Promised result/completion  vs  Return Streams
 */

/**
 * Run a command and send stdout/err to parent's
 *
 * - Shell
 * - Stream to stdout/stderr
 * - Promised completion (but streams are available on returned object/promise)
 *
 * @param command - Command to run
 * @param shell - Should we spawn a shell
 * @param args - Arguments to command
 */
export function spawn(
  command: string,
  shell: true,
  ...args: string[]
): PromiseWithChild<void>;

/**
 * Run a command and send stdout/err to parent's
 *
 * - Shell OR Command + args
 * - Stream to stdout/stderr (by default)
 * - Promised completion
 *
 * @param command - Command to run
 * @param options - Options to pass to node.spawn
 * @param args - Arguments to command
 */
export function spawn(
  command: string,
  options: SpawnOptions,
  ...args: string[]
): PromiseWithChild<void>;

/**
 * Run a command and send stdout/err to parent's
 *
 * - Command + args
 * - Stream to stdout/stderr
 * - Promised completion
 *
 * @param command - Command to run
 * @param args - Arguments to command
 */
export function spawn(
  command: string,
  ...args: string[]
): PromiseWithChild<void>;

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function spawn(
  command: string,
  first: string | SpawnOptions | true,
  ...args: string[]
): PromiseWithChild<void> {
  // console.log('Spawning:', command, ...args);
  const defOpts: SpawnOptions = { stdio: 'inherit' };

  const proc =
    typeof first === 'string'
      ? nodeSpawn(command, [first, ...args], defOpts)
      : nodeSpawn(
          command,
          args,
          first === true ? { ...defOpts, shell: defaultShell } : first,
        );

  const ret = new Promise((resolve, reject) => {
    proc.on('exit', exitCode => {
      if (exitCode) {
        reject(new Error(`Exit code: ${exitCode}`));
      } else {
        resolve();
      }
    });
  }) as PromiseWithChild<void>;

  ret.child = proc;

  return ret;
}

const execP = promisify(nodeExec);

/**
 * Run a command and capture output. Prints nothing
 *
 * - Shell
 * - Captured & Buffered output
 * - Promised result
 *
 * @param command - Command to run
 * @param shell - If we should use a shell or not
 * @returns The result of the execution
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function exec(
  command: string,
  shell: true | null | string = true,
): PromiseWithChild<{
  stdout: string;
  stderr: string;
}> {
  if (shell === null) {
    return execP(command);
  }

  if (shell === true) shell = defaultShell;

  return execP(command, { shell });
}
