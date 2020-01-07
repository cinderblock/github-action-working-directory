import { clone } from '../src/utils/clone';
import { tmpdir } from 'os';
import rmfr from 'rmfr';

describe('utils/clone', () => {
  test('clone is a function', () => {
    expect(typeof clone).toBe('function');
  });

  const repoUrl = '.';
  const branch = 'master';
  const dir = `${tmpdir}/github-action-working-directory/dummy-test`;

  afterAll(async done => rmfr(dir).then(done));

  // eslint-disable-next-line @typescript-eslint/unbound-method
  process.stdout.write = jest.fn();

  test('clone can be called', async () => {
    await rmfr(dir);
    return clone({ repoUrl, branch, dir });
  });
});
