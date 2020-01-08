import { clone } from '../src/utils/clone';
import rmfr from 'rmfr';
import { testTempDir } from './utils/testTempDir';

describe('utils/clone', () => {
  test('clone is a function', () => {
    expect(typeof clone).toBe('function');
  });

  const repoUrl = '.';
  const parentDir = testTempDir(__filename);

  // TODO: figure out why this is hitting the timeout
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  beforeAll(() => rmfr(parentDir), 1000);
  // Cleanup
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  afterAll(() => rmfr(parentDir), 1000);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  process.stdout.write = jest.fn();

  test('clone can be called for non-existent branch', async () => {
    const dir = `${parentDir}/clone-non-existent`;

    const result = await clone({
      repoUrl,
      branch: 'this-branch-will-never-exist',
      dir,
    });

    expect(result).toBe(null);
  });

  test('clone can be called for existing branch', async () => {
    const dir = `${parentDir}/clone-existing`;

    const result = await clone({ repoUrl, branch: 'master', dir });

    expect(result).not.toBe(null);
    if (result === null) throw new Error('unreachable');

    const head = await result.head();

    expect(head.isValid()).toBe(true);

    expect(!!head.isBranch()).toBe(true);
  });
});
