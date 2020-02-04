// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';
import { readInputs } from './utils/readInputs';
import { commitAndPush } from './utils/commitAndPush';

async function run(): Promise<void> {
  try {
    const { dir, branch, message, name, email } = readInputs();
    const { debug } = core;

    await commitAndPush({ dir, branch, message, name, email, debug });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();