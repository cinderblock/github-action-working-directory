import { clone } from '../src/utils/clone';

describe('clone', () => {
  test('readInputs is a function', () => {
    expect(typeof clone).toBe('function');
  });
});
