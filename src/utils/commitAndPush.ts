import NodeGit from 'nodegit';
import * as core from '@actions/core';

type Options = {
  branch: string;
  dir: string;
  message: string;
  name: string;
  email: string;

  // TODO: push to url, not named remote
  // repoUrl: string;

  debug?: typeof core.debug;
};

/**
 * Commit and Push.
 *
 * @param {Options} opts - Commit options.
 */
export async function commitAndPush({
  branch,
  dir,
  message,
  name,
  email,
  debug,
}: Options): Promise<NodeGit.Oid> {
  if (debug === undefined) {
    debug = core.debug;
  }

  debug('open repo');
  const repository = await NodeGit.Repository.open(`${dir}/.git`);

  // TODO: Support time/offset/signature buffer
  const author = NodeGit.Signature.now(name, email);

  debug(`Author: ${author.toString()}`);

  const committer = author;

  debug(`Committer: ${committer.toString()}`);

  debug('refresh index');
  const index = await repository.refreshIndex();

  debug('index add all');

  const debugFixed = debug;

  const indexAddRes = await index.addAll(
    branch,
    undefined,
    (path: string, patternMatch: string) => {
      debugFixed(`index add: ${{ path, patternMatch }}`);
      return 0;
    },
  );

  // TODO: check `unchanged`

  debug(`index add result: ${indexAddRes}`);

  debug('index write');
  index.write();

  debug('index write tree');
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

  debug(`Latest commit: ${commit.tostrS()} ${tree.tostrS()}`);

  const remote = await repository.getRemote('origin');

  await remote.push([branch]);

  return commit;
}
