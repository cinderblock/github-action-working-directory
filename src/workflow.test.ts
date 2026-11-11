import { afterAll, describe, expect, it } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { branchExists, clone } from './utils/clone.js';
import { commitAndPush } from './utils/commitAndPush.js';
import { repoUrl } from './utils/readInputs.js';

describe('repoUrl', () => {
  const env = {
    GITHUB_REPOSITORY: 'me/here',
    GITHUB_SERVER_URL: 'https://github.com',
    GITHUB_TOKEN: 'tok',
  };
  it('turns owner/name (or nothing) into an authenticated URL', () => {
    expect(repoUrl('', env)).toBe(
      'https://x-access-token:tok@github.com/me/here.git',
    );
    expect(repoUrl('o/r', env)).toBe(
      'https://x-access-token:tok@github.com/o/r.git',
    );
    expect(repoUrl('o/r', { ...env, GITHUB_TOKEN: '' })).toBe(
      'https://github.com/o/r.git',
    );
  });
  it('passes a URL through', () => {
    expect(repoUrl('git@example.com:o/r.git', env)).toBe(
      'git@example.com:o/r.git',
    );
  });
});

describe('clone, then commit and push', () => {
  const dirs: string[] = [];
  const temp = async () => {
    const d = await mkdtemp(join(tmpdir(), 'wd-test-'));
    dirs.push(d);
    return d;
  };
  afterAll(async () => {
    for (const d of dirs) await rm(d, { recursive: true, force: true });
  });
  const git = (cwd: string, ...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  const who = { name: 'Test', email: 'test@example.com', message: 'update' };

  it('starts a missing branch, then clones it and adds to it', async () => {
    const remote = await temp();
    git(remote, 'init', '--bare', '--quiet');

    expect(await branchExists(remote, 'data')).toBe(false);
    const a = join(await temp(), 'wd');
    await clone({ repoUrl: remote, dir: a, branch: 'data', debug: () => {} });
    await writeFile(join(a, 'one.txt'), '1');
    await commitAndPush({ dir: a, branch: 'data', ...who, debug: () => {} });
    expect(await branchExists(remote, 'data')).toBe(true);

    const b = join(await temp(), 'wd');
    await clone({ repoUrl: remote, dir: b, branch: 'data', debug: () => {} });
    expect(await readFile(join(b, 'one.txt'), 'utf8')).toBe('1');
    await writeFile(join(b, 'two.txt'), '2');
    await commitAndPush({ dir: b, branch: 'data', ...who, debug: () => {} });
    expect(git(remote, 'log', '--format=%s', 'data').split('\n')).toEqual([
      'update',
      'update',
    ]);

    // Nothing changed: no commit, unless asked for one.
    await commitAndPush({ dir: b, branch: 'data', ...who, debug: () => {} });
    expect(git(remote, 'rev-list', '--count', 'data')).toBe('2');
    await commitAndPush({
      dir: b,
      branch: 'data',
      ...who,
      commitUnchanged: true,
      debug: () => {},
    });
    expect(git(remote, 'rev-list', '--count', 'data')).toBe('3');
  }, 30_000);

  it("fails on a remote it can't read, instead of starting an empty branch", async () => {
    const missing = join(await temp(), 'no-such-repo.git');
    await expect(branchExists(missing, 'data')).rejects.toThrow(
      "Can't read the remote",
    );
  });
});
