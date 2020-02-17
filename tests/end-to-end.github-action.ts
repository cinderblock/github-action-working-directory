import { promises, existsSync } from 'fs';
import { posix } from 'path';
import { load } from 'js-yaml';
import { fork } from 'child_process';
import { EOL } from 'os';
import { testTempDir } from './utils/testTempDir';

const { readFile } = promises;
const { join } = posix;

const distDir = join(__dirname, '..', 'dist');
const actionYmlFilename = join(distDir, 'action.yml');

describe('GitHub Actions Test', () => {
  test('action.yml exists', () => {
    expect(existsSync(actionYmlFilename)).toBe(true);
  });

  test('can read action.yml', async () => {
    const contents = (await readFile(actionYmlFilename)).toString();

    expect(typeof contents).toBe('string');

    expect(contents.length).toBeGreaterThan(0);
  });

  test('action.yml has valid yaml', async () => {
    const contents = await readFile(actionYmlFilename);

    const action = load(contents.toString());

    expect(typeof action).toBe('object');
  });

  test('action.yml has correct runs.using', async () => {
    const contents = await readFile(actionYmlFilename);

    const action = load(contents.toString());

    expect((action.runs.using as string).substr(0, 4)).toBe('node');
  });

  test(`action.yml has runs.main and runs.post`, async () => {
    const contents = await readFile(actionYmlFilename);

    const action = load(contents.toString());

    expect(typeof action?.runs?.main).toBe('string');
    expect(typeof action?.runs?.post).toBe('string');
  });

  const runtimePath = 'dist/';

  test(`runs.main and runs.post files exist`, async () => {
    const contents = await readFile(actionYmlFilename);

    const action = load(contents.toString());

    expect(existsSync(`${runtimePath}${action?.runs?.main}`)).toBe(true);
    expect(existsSync(`${runtimePath}${action?.runs?.post}`)).toBe(true);
  });

  test(`can run runs.main and runs.post end-to-end`, async () => {
    const contents = await readFile(actionYmlFilename);

    const action = load(contents.toString());

    const mainFile = action?.runs?.main;
    const postFile = action?.runs?.post;

    expect(typeof mainFile).toBe('string');
    expect(typeof postFile).toBe('string');

    const mainFileFullPath = `${runtimePath}${mainFile}`;
    const postFileFullPath = `${runtimePath}${postFile}`;

    const mainOutput = await new Promise((resolve, reject) => {
      let messages = '';

      const exec = fork(mainFileFullPath, [], {
        env: {
          INPUT_BRANCH: 'test-dummy',
          'INPUT_working-directory': testTempDir('e2e-gh-actions'),
        },
        silent: true,
      });

      exec.stdout?.on('data', m => (messages += `stdout > ${m}`));
      exec.stderr?.on('data', m => (messages += `stderr > ${m}`));

      exec.on('error', reject);

      exec.on('exit', exitCode => {
        expect(messages).toBe('');
        expect(exitCode).toBe(0);
        resolve(messages);
      });
    });

    expect(mainOutput).toBe(
      ['::debug::Reading inputs', '::debug::Cloned: undefined']
        .map(l => `stdout > ${l}${EOL}`)
        .join(''),
    );

    const postOutput = await new Promise((resolve, reject) => {
      let messages = '';

      const exec = fork(postFileFullPath, [], {
        env: {
          INPUT_BRANCH: 'test-dummy',
          'INPUT_working-directory': 'test-dummy',
        },
        silent: true,
      });

      exec.stdout?.on('data', m => (messages += `stdout > ${m}`));
      exec.stderr?.on('data', m => (messages += `stderr > ${m}`));

      exec.on('error', reject);

      exec.on('exit', exitCode => {
        // eslint-disable-next-line no-console
        if (exitCode) console.log(messages);

        expect(exitCode).toBe(0);
        resolve(messages);
      });
    });

    expect(postOutput).toBe('');
  });
});
