import * as core from '@actions/core';
import { mkdir } from 'node:fs/promises';
import { spawn } from './spawn.js';

interface Options {
  repoUrl: string;
  dir: string;
  branch: string;
  debug?: typeof core.debug;
}

/** Try to clone the repo+branch. If the branch doesn't exist yet on the
 *  remote, initialize an orphan branch in the working directory instead. */
export async function clone({
  repoUrl,
  dir,
  branch,
  debug = core.debug,
}: Options): Promise<void> {
  debug(`Cloning repo into dir(${dir})`);
  try {
    await spawn('git', 'clone', '--single-branch', '--branch', branch, '--', repoUrl, dir);
  } catch {
    debug(`Branch ${branch} missing. Creating an orphan.`);
    await mkdir(dir, { recursive: true });
    await spawn('git', { cwd: dir }, 'init');
    await spawn('git', { cwd: dir }, 'remote', 'add', 'origin', repoUrl);
    await spawn('git', { cwd: dir }, 'checkout', '--orphan', branch);
  }
  debug('Branch checked out');
}
