import * as core from '@actions/core';

interface Inputs {
  branch: string;
  repo: string;
  dir: string;
  message: string;
  name: string;
  email: string;
  unchanged: string;
}

type Env = Record<string, string | undefined>;

/** `repo` is `owner/name` (or empty for this repo), turned into an HTTPS URL
 *  that authenticates with GITHUB_TOKEN when it's set; anything else is used
 *  as a git URL as-is. */
export function repoUrl(repo: string, env: Env = process.env): string {
  const slug = repo.trim() || env.GITHUB_REPOSITORY || '';
  if (!/^[\w.-]+\/[\w.-]+$/.test(slug)) {
    if (!slug) throw new Error('No repo, and GITHUB_REPOSITORY is not set.');
    return slug;
  }
  const server = new URL(env.GITHUB_SERVER_URL || 'https://github.com');
  const token = env.GITHUB_TOKEN;
  const auth = token ? `x-access-token:${token}@` : '';
  return `${server.protocol}//${auth}${server.host}/${slug}.git`;
}

export function readInputs(): Inputs {
  core.debug('Reading inputs');
  if (process.env.GITHUB_TOKEN) core.setSecret(process.env.GITHUB_TOKEN);
  return {
    branch: core.getInput('branch', { required: true }),
    repo: repoUrl(core.getInput('repo')),
    dir: core.getInput('working-directory', { required: true }),
    message: core.getInput('commit-message'),
    name: core.getInput('commit-name'),
    email: core.getInput('commit-email'),
    unchanged: core.getInput('commit-unchanged'),
  };
}
