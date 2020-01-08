// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import { readInputs } from './utils/readInputs';
import { clone } from './utils/clone';

async function run(): Promise<void> {
  try {
    const { branch, repo: repoUrl, dir } = readInputs();

    const debug = console.log.bind(0);

    const ref = await clone({ branch, repoUrl, dir, debug });

    core.debug(`Cloned: ${ref?.toString()}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
