import { Clone, Repository } from 'nodegit';
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
}: Options): Promise<Repository | null> {
  const dbg = debug ?? core.debug;

  dbg(`cloning repo(${repoUrl}) into dir(${dir})`);

  // TODO: Handle empty repoUrl. Find main remote of current repo

  const promise = Clone.clone(repoUrl, dir, {
    checkoutBranch: branch,
  });

  const handleMissing = promise.catch(e => {
    if (e?.message !== `reference 'refs/remotes/origin/${branch}' not found`) {
      dbg(`Throwing unrecognized error: ${e?.message}`);
      throw e;
    }

    dbg(`Branch not found`);

    return null;
  });

  const repository = await handleMissing;

  dbg(`Branch checked out`);

  return repository;
}
