/* eslint-disable @typescript-eslint/no-unused-vars */

// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import NodeGit from 'nodegit';

async function run(): Promise<void> {
  try {
    core.debug('Reading inputs');

    const branch = core.getInput('branch', { required: true });
    const repo = core.getInput('repo');
    const dir = core.getInput('working-directory', { required: true });
    const message = core.getInput('commit-message');
    const name = core.getInput('commit-name');
    const email = core.getInput('commit-email');
    const unchanged = core.getInput('commit-unchanged');

    core.debug('open repo');
    const repository = await NodeGit.Repository.open(`${dir}/.git`);

    // TODO: Support time/offset/signature buffer
    const author = NodeGit.Signature.now(name, email);

    core.debug(`Author: ${author.toString()}`);

    const committer = author;

    core.debug(`Committer: ${committer.toString()}`);

    core.debug('refresh index');
    const index = await repository.refreshIndex();

    core.debug('index add all');
    const indexAddRes = await index.addAll(
      ref,
      undefined,
      (path: string, patternMatch: string) => {
        core.debug(`index add:${{ path, patternMatch }.toString()}`);
        return 0;
      },
    );

    // TODO: check `unchanged`

    core.debug(`index add result: ${indexAddRes}`);

    core.debug('index write');
    await index.write();

    core.debug('index write tree');
    const tree = await index.writeTree();

    const branch = await repository.getBranch(ref);

    const parents = [branch.target()];

    const commit = await repository.createCommit(
      ref,
      author,
      committer,
      message,
      tree,
      parents,
    );

    core.debug(`Latest commit: ${commit.tostrS()} ${tree.tostrS()}`);

    const remote = await repository.getRemote('origin');

    await remote.push([ref]);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
