import { tmpdir } from 'os';
import { basename } from 'path';

const runID = Math.random()
  .toString(36)
  .substring(2);

/**
 * Get a name of a folder to use for testing with.
 *
 * @param {string} testName - Name test to create a dedicated folder for
 * @param {string} parent - Optional test name
 * @returns {string} The path to the folder with no trailing slash
 */
export function testTempDir(testName: string, parent?: string): string {
  return `${tmpdir}/github-action-working-directory/${parent ||
    `dummy-test-${runID}`}/${basename(testName)}`;
}
