// Other packages https://github.com/actions/toolkit/blob/master/README.md#packages
import * as core from '@actions/core';
import NodeGit from 'nodegit';
import { readInputs } from './utils/inputs';

async function run(): Promise<void> {
  try {
    const { branch, dir, message, name, email } = readInputs();

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
      branch,
      undefined,
      (path: string, patternMatch: string) => {
        core.debug(`index add:${{ path, patternMatch }.toString()}`);
        return 0;
      },
    );

    // TODO: check `unchanged`

    core.debug(`index add result: ${indexAddRes}`);

    core.debug('index write');
    index.write();

    core.debug('index write tree');
    const tree = await index.writeTree();

    const workingBranch = await repository.getBranch(branch);

    const parents = [workingBranch.target()];

    const commit = await repository.createCommit(
      branch,
      author,
      committer,
      message,
      tree,
      parents,
    );

    core.debug(`Latest commit: ${commit.tostrS()} ${tree.tostrS()}`);

    const remote = await repository.getRemote('origin');

    await remote.push([branch]);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
