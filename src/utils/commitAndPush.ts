import core from '@actions/core';
import { spawn } from './spawn';

type Options = {
  branch: string;
  dir: string;
  message: string;
  name: string;
  email: string;

  // TODO: push to url, not named remote
  // repoUrl: string;

  debug?: typeof core.debug;
};

/**
 * Commit and Push.
 *
 * @param {Options} opts - Commit options.
 */
export async function commitAndPush({
  branch,
  dir,
  message,
  name,
  email,
  debug,
}: Options): Promise<void> {
  const dbg = debug ?? core.debug;

  dbg('Adding all files');

  await spawn('git', { cwd: dir }, 'add', '.');

  dbg('Committing');

  await spawn(
    'git',
    { cwd: dir },
    'commit',
    '--message',
    message,
    '--author',
    `${name} <${email}>`,
  );

  dbg('Pushing');

  await spawn('git', { cwd: dir }, 'push', 'origin', branch);
}
