import NodeGit from 'nodegit';
import * as core from '@actions/core';

type Options = {
  repoUrl: string;
  dir: string;
  branch: string;
  debug?: typeof core.debug;
};

export async function clone({
  repoUrl,
  dir,
  branch,
  debug,
}: Options): Promise<NodeGit.Reference> {
  if (debug === undefined) {
    debug = core.debug;
  }

  debug(`cloning repo(${repoUrl}) into dir(${dir})`);

  // TODO: Handle empty repoUrl. Find main remote of current repo

  const repository = await NodeGit.Clone.clone(repoUrl, dir);

  debug(`Checking out branch(${branch})`);

  const ret = await repository.checkoutBranch(branch);

  // TODO: Handle missing branch (initial commit)

  debug(`Branch checked out`);

  return ret;
}
