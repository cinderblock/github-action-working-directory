// eslint-disable-next-line @typescript-eslint/promise-function-async
export function wait(milliseconds: number): Promise<void> {
  if (isNaN(milliseconds)) throw new Error('argument is not a number');

  if (milliseconds < 0) throw new RangeError('cannot wait negative time');

  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
