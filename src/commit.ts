// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import { readInputs } from './utils/inputs';
import { commitAndPush } from './utils/commitAndPush';

async function run(): Promise<void> {
  try {
    const { dir, branch, message, name, email } = readInputs();
    const { debug } = core;

    commitAndPush({ dir, branch, message, name, email, debug });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
