import { describe, it, expect } from 'bun:test';

describe('module load smoke', () => {
  it('utils/spawn loads', async () => {
    const mod = await import('./utils/spawn.js');
    expect(typeof mod.spawn).toBe('function');
    expect(typeof mod.exec).toBe('function');
  });

  it('utils/clone loads', async () => {
    const mod = await import('./utils/clone.js');
    expect(typeof mod.clone).toBe('function');
  });

  it('utils/commitAndPush loads', async () => {
    const mod = await import('./utils/commitAndPush.js');
    expect(typeof mod.commitAndPush).toBe('function');
  });

  it('utils/readInputs loads', async () => {
    const mod = await import('./utils/readInputs.js');
    expect(typeof mod.readInputs).toBe('function');
  });
});
