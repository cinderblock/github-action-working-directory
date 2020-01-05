/* eslint-disable @typescript-eslint/no-unused-vars */

// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';

async function run(): Promise<void> {
  try {
    core.debug('Reading inputs');

    const branch = core.getInput('branch', { required: true });
    const repo = core.getInput('repo', { required: true });
    const dir = core.getInput('working-directory', { required: true });
    const message = core.getInput('commit-message', { required: true });
    const name = core.getInput('commit-name', { required: true });
    const email = core.getInput('commit-email', { required: true });
    const unchanged = core.getInput('commit-unchanged', { required: true });

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
