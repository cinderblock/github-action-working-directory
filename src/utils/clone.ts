import core from '@actions/core';
import { spawn } from './spawn';
import { promises } from 'fs';

const { mkdir } = promises;

type Options = {
  repoUrl: string;
  dir: string;
  branch: string;
  debug?: typeof core.debug;
};

export async function clone({
  repoUrl,
  dir,
  branch,
  debug,
}: Options): Promise<void> {
  const dbg = debug ?? core.debug;

  dbg(`Cloning repo into dir(${dir})`);

  await spawn(
    'git',
    'clone',
    '--single-branch',
    '--branch',
    branch,
    '--',
    repoUrl,
    dir,
  ).catch(async () => {
    dbg(`Branch ${branch} missing. Creating an orphan`);

    await mkdir(dir, { recursive: true });
    await spawn('git', { cwd: dir }, 'init');
    await spawn('git', { cwd: dir }, 'remote', 'add', 'origin', repoUrl);
    await spawn('git', { cwd: dir }, 'checkout', '--orphan', branch);
  });

  dbg(`Branch checked out`);
}
