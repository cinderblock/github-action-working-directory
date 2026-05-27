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

export function readInputs(): Inputs {
  core.debug('Reading inputs');
  const branch = core.getInput('branch', { required: true });
  const repo =
    core.getInput('repo') ||
    `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}`;
  return {
    branch,
    repo,
    dir: core.getInput('working-directory'),
    message: core.getInput('commit-message'),
    name: core.getInput('commit-name'),
    email: core.getInput('commit-email'),
    unchanged: core.getInput('commit-unchanged'),
  };
}
