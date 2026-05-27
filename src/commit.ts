import * as core from '@actions/core';
import { readInputs } from './utils/readInputs.js';
import { commitAndPush } from './utils/commitAndPush.js';

async function run(): Promise<void> {
  try {
    const { dir, branch, message, name, email, unchanged } = readInputs();
    await commitAndPush({ dir, branch, message, name, email, commitUnchanged: Boolean(unchanged) });
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

void run();
