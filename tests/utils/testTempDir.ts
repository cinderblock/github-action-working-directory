import { tmpdir } from 'os';
import { basename } from 'path';

const runID = Math.random()
  .toString(36)
  .substring(2);

export function testTempDir(testName: string, parent?: string): string {
  return `${tmpdir}/github-action-working-directory/${parent ||
    `dummy-test-${runID}`}/${basename(testName)}`;
}
