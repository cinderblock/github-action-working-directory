import { commitAndPush } from '../src/utils/commitAndPush';

describe('utils/commitAndPush', () => {
  test('commitAndPush is a function', () => {
    expect(typeof commitAndPush).toBe('function');
  });
});
