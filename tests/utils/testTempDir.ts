import { tmpdir } from 'os';
import { basename } from 'path';

export function testTempDir(testName: string, parent?: string): string {
  return `${tmpdir}/github-action-working-directory/${parent ||
    'dummy-test'}/${basename(testName)}`;
}
