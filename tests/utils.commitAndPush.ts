import { commitAndPush } from '../src/utils/commitAndPush';

describe('commitAndPush', () => {
  test('readInputs is a function', () => {
    expect(typeof commitAndPush).toBe('function');
  });
});
