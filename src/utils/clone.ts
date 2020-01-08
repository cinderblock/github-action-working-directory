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
  const dbg = debug ?? core.debug;

  dbg(`cloning repo(${repoUrl}) into dir(${dir})`);

  // TODO: Handle empty repoUrl. Find main remote of current repo

  const repository = await Clone.clone(repoUrl, dir);

  dbg(`Checking out branch(${branch})`);

  try {
    const ret = await repository.checkoutBranch(branch);

    // TODO: Handle missing branch (initial commit)

    dbg(`Branch checked out`);

    return ret;
  } catch (e) {
    if (e?.message !== `no reference found for shorthand '${branch}'`) throw e;
    return null;
  }
}
