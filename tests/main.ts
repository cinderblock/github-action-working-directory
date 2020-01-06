import { promises, existsSync } from 'fs';
import { posix } from 'path';
import { load } from 'js-yaml';
import { SharedPromise } from './utils/SharedPromise';
import { fork } from 'child_process';

const { readFile } = promises;
const { join } = posix;

const distDir = join(__dirname, '..', 'dist');
const actionYmlFilename = join(distDir, 'action.yml');

describe('GitHub Actions Test', () => {
  test('action.yml exists', () => {
    expect(existsSync(actionYmlFilename)).toBe(true);
  });

  const actionYmlFileContents = SharedPromise<string>();

  test('can read action.yml', async () => {
    const contents = (await readFile(actionYmlFilename)).toString();
    actionYmlFileContents.resolve(contents);

    expect(typeof contents).toBe('string');

    expect(contents.length).toBeGreaterThan(0);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const action = SharedPromise<any>();

  test('action.yml has valid yaml', async () => {
    const contents = load(await actionYmlFileContents.promise);

    action.resolve(contents);

    expect(typeof contents).toBe('object');
  });

  test('action.yml has correct runs.using', async () => {
    const contents = await action.promise;

    expect((contents.runs.using as string).substr(0, 4)).toBe('node');
  });

  const runs = { main: SharedPromise<string>(), post: SharedPromise<string>() };

  test('action.yml has runs.main and runs.post', async () => {
    const contents = await action.promise;

    expect(typeof contents.runs.main).toBe('string');
    expect(typeof contents.runs.post).toBe('string');

    runs.main.resolve(join(distDir, contents.runs.main));
    runs.post.resolve(join(distDir, contents.runs.post));
  });

  test('runs.main exists', async () => {
    expect(existsSync(await runs.main.promise)).toBe(true);
  });

  test('runs.post exists', async () => {
    expect(existsSync(await runs.post.promise)).toBe(true);
  });

  const main = SharedPromise();

  test('can run runs.main', async () => {
    const exec = fork(await runs.main.promise);

    exec.on('error', main.reject);

    exec.on('exit', exitCode => {
      if (exitCode) main.reject();
      main.resolve();
    });

    exec.on('message', console.log.bind(0));

    await main.promise;

    expect(main.promise).resolves.toEqual(undefined);
  });

  const post = SharedPromise();

  test('can run runs.post', async () => {
    expect(main.promise).resolves.toEqual(undefined);

    await main.promise;

    const exec = fork(await runs.post.promise);

    exec.on('error', post.reject);

    exec.on('exit', exitCode => {
      if (exitCode) post.reject();
      post.resolve();
    });

    expect(post.promise).resolves.toEqual(undefined);
  });

  // TODO: Read action.yml and run main/post on dummy repo/dir
});
