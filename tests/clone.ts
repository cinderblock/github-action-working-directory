import { tmpdir } from 'os';
import rmfr from 'rmfr';

describe('utils/clone', () => {
  const repoUrl = '.';
  const branch = 'master';
  const dir = `${tmpdir}/github-action-working-directory/dummy-test-clone`;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  process.stdout.write = jest.fn();

  process.env.INPUT_REPO = repoUrl;
  process.env.INPUT_BRANCH = branch;
  process.env['INPUT_working-directory'] = dir;

  // Cleanup after ourselves
  afterAll(async () => rmfr(dir));

  test('clone can be called', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/clone');

    return new Promise(resolve => setTimeout(resolve, 500));
  });
});
