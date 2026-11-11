import * as core from '@actions/core';
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { spawn } from './spawn.js';

interface Options {
  repoUrl: string;
  dir: string;
  branch: string;
  debug?: typeof core.debug;
}

/** Whether `branch` exists on the remote. `git ls-remote --exit-code` exits
 *  2 when the ref is missing; any other failure (auth, network, a wrong
 *  URL) is an error, not a missing branch. */
export function branchExists(
  repoUrl: string,
  branch: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    execFile(
      'git',
      [
        'ls-remote',
        '--exit-code',
        '--heads',
        '--',
        repoUrl,
        `refs/heads/${branch}`,
      ],
      (err, _stdout, stderr) => {
        if (!err) return resolve(true);
        if ((err as { code?: unknown }).code === 2) return resolve(false);
        reject(
          new Error(`Can't read the remote: ${stderr.trim() || err.message}`),
        );
      },
    );
  });
}

/** Clone the repo's branch. If the branch doesn't exist yet on the remote,
 *  start an orphan branch in the working directory instead, which the post
 *  step pushes. */
export async function clone({
  repoUrl,
  dir,
  branch,
  debug = core.debug,
}: Options): Promise<void> {
  if (await branchExists(repoUrl, branch)) {
    debug(`Cloning ${branch} into ${dir}`);
    await spawn(
      'git',
      'clone',
      '--single-branch',
      '--branch',
      branch,
      '--',
      repoUrl,
      dir,
    );
  } else {
    core.info(
      `Branch ${branch} doesn't exist yet; starting it empty in ${dir}.`,
    );
    await mkdir(dir, { recursive: true });
    await spawn('git', { cwd: dir }, 'init', '--quiet');
    await spawn('git', { cwd: dir }, 'remote', 'add', 'origin', repoUrl);
    await spawn('git', { cwd: dir }, 'checkout', '--quiet', '--orphan', branch);
  }
  debug('Branch checked out');
}
