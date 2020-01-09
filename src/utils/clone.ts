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

  const repository = await Clone.clone(repoUrl, dir, {
    checkoutBranch: branch,
  }).catch(e => {
    if (e?.message !== `reference 'refs/remotes/origin/${branch}' not found`) {
      throw e;
    }

    dbg(`Branch not found`);

    return null;
  });

  // TODO: Handle missing branch (initial commit ?)

  dbg(`Branch checked out`);

  return repository;
}
