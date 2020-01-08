import { clone } from '../src/utils/clone';
import rmfr from 'rmfr';
import { testTempDir } from './utils/testTempDir';

describe('utils/clone', () => {
  test('clone is a function', () => {
    expect(typeof clone).toBe('function');
  });

  const repoUrl = '.git';
  const parentDir = testTempDir(__filename);

  // TODO: figure out why this is hitting the timeout
  afterAll(async () => rmfr(parentDir), 1000);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  process.stdout.write = jest.fn();

  test('clone can be called for non-existent branch', async () => {
    const dir = `${parentDir}/clone-non-existent`;
    await rmfr(dir); // Make sure we're clean
    const result = clone({
      repoUrl,
      branch: 'this-branch-will-never-exist',
      dir,
    });

    // cleanup
    const cleanup = rmfr(dir); // Make sure we're clean

    expect((await result).isValid()).toBe(true);

    await cleanup;
  });

  test('clone can be called for existing branch', async () => {
    const dir = `${parentDir}/clone-existing`;
    await rmfr(dir); // Make sure we're clean
    const result = clone({ repoUrl, branch: 'master', dir });

    // cleanup
    const cleanup = rmfr(dir); // Make sure we're clean

    expect((await result).isValid()).toBe(true);

    await cleanup;
  });
});
