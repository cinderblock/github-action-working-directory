import { Clone, Repository, CloneOptions, Fetch } from 'nodegit';
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

  dbg(`Creating repo in dir(${dir})`);

  dbg(`Fetching repo(${repoUrl}) into dir(${dir})`);

  // TODO: Handle empty repoUrl. Find main remote of current repo

  const options = new FetchOptions();

  options.checkoutBranch = branch;

  const promise = new Fetch(repoUrl, dir, options);

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
