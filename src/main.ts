// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import { readInputs } from './utils/inputs';
import { clone } from './utils/clone';
import { commitAndPush } from './utils/commitAndPush';

async function runClone(): Promise<void> {
  try {
    const { branch, repo: repoUrl, dir } = readInputs();
    const { debug } = core;

    const ref = clone({ branch, repoUrl, dir, debug });

    core.debug(`Cloned: ${ref.toString()}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function runCommit(): Promise<void> {
  try {
    const { dir, branch, message, name, email } = readInputs();
    const { debug } = core;

    commitAndPush({ dir, branch, message, name, email, debug });
  } catch (error) {
    core.setFailed(error.message);
  }
}

console.log(process.argv);

const mode = process.argv[1];

if (mode === 'commit') runCommit();
if (mode === 'clone') runClone();
