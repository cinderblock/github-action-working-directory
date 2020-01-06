import { existsSync } from 'fs';
import { join } from 'path';

describe('GitHub Actions Format', () => {
  test('action.yml exists', () => {
    expect(existsSync(join(__dirname, '..', 'action.yml'))).toBe(true);
  });

  // TODO: Read action.yml and run main/post on dummy repo/dir
});
