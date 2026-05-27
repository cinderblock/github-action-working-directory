import * as core from '@actions/core';
import { readInputs } from './utils/readInputs.js';
import { clone } from './utils/clone.js';

async function run(): Promise<void> {
  try {
    const { branch, repo: repoUrl, dir } = readInputs();
    await clone({ branch, repoUrl, dir });
    core.debug('Cloned');
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

void run();
