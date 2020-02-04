// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';
import { readInputs } from './utils/readInputs';
import { clone } from './utils/clone';

async function run(): Promise<void> {
  try {
    const { branch, repo: repoUrl, dir } = readInputs();

    const debug = console.log.bind(0);

    await clone({ branch, repoUrl, dir, debug });

    core.debug(`Cloned`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
