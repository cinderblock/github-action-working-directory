import { Clone, Reference } from 'nodegit';
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
}: Options): Promise<Reference | null> {
  if (debug === undefined) {
    debug = core.debug;
  }

  debug(`cloning repo(${repoUrl}) into dir(${dir})`);

  // TODO: Handle empty repoUrl. Find main remote of current repo

  const repository = await Clone.clone(repoUrl, dir);

  debug(`Checking out branch(${branch})`);

  try {
    const ret = await repository.checkoutBranch(branch);

    // TODO: Handle missing branch (initial commit)

    debug(`Branch checked out`);

    return ret;
  } catch (e) {
    if (typeof e !== 'string') throw e;
    if (e !== `no reference found for shorthand '${branch}'`) throw e;

    debug(`Branch does not exist. Creating a new one.`);

    return null;
  }
}
