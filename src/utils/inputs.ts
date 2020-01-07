import * as core from '@actions/core';

type Inputs = {
  branch: string;
  repo: string;
  dir: string;
  message: string;
  name: string;
  email: string;
  unchanged: string;
};

export function readInputs(): Inputs {
  core.debug('Reading inputs');

  const branch = core.getInput('branch', { required: true });

  const repo =
    core.getInput('repo') ||
    `https://github.com/${process.env.GITHUB_REPOSITORY}`;

  const dir = core.getInput('working-directory');

  const message = core.getInput('commit-message');

  const name = core.getInput('commit-name');

  const email = core.getInput('commit-email');

  const unchanged = core.getInput('commit-unchanged');

  const inputs: Inputs = {
    branch,
    repo,
    dir,
    message,
    name,
    email,
    unchanged,
  };

  return inputs;
}
