// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import NodeGit from 'nodegit';
import { readInputs } from './utils/inputs';

async function run(): Promise<void> {
  try {
    core.debug('Reading inputs');

    const { branch, repo, dir } = readInputs();

    const repoUrl = repo;

    core.debug('clone repo');
    const repository = await NodeGit.Clone.clone(repoUrl, dir);

    const ref = await repository.checkoutBranch(branch);

    core.setOutput('Cloned', ref.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
