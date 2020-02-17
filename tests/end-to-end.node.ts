import { clone } from '../src/utils/clone';
import rmfr from 'rmfr';
import { testTempDir } from './utils/testTempDir';
import { promises } from 'fs';

const { access } = promises;

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

  test('works with non-existent branch', async () => {
    const dir = `${parentDir}/clone-non-existent`;

    const result = await clone({
      repoUrl,
      branch: 'this-branch-will-never-exist',
      dir,
    });

    expect(result).toBe(undefined);

    const dirExists = await access(dir).then(
      () => true,
      () => false,
    );

    expect(dirExists).toBe(true);

    expect('this test').toBe('flushed out');
  });

  test('works with existing branch', async () => {
    const dir = `${parentDir}/clone-existing`;

    const result = await clone({ repoUrl, branch: 'master', dir });

    expect(result).toBe(undefined);

    const dirExists = await access(dir).then(
      () => true,
      () => false,
    );

    expect(dirExists).toBe(true);

    expect('this test').toBe('flushed out');
  });
});
