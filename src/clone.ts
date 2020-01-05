// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import core from '@actions/core';
import NodeGit from 'nodegit';

async function run(): Promise<void> {
  try {
    core.debug('Reading inputs');

    const branch = core.getInput('branch', { required: true });
    const repo = core.getInput('repo', { required: true });
    const dir = core.getInput('working-directory', { required: true });

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
