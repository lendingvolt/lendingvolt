/**
 * Fixed-capacity particle pool stored as parallel typed arrays, with a
 * free-list of slot indices. Spawning and killing never allocate.
 */
export type Pool<F extends string> = {
  readonly capacity: number;
  readonly alive: Uint8Array;
  readonly fields: Record<F, Float32Array>;
  /** Claim a free slot; returns -1 when the pool is full. */
  spawn(): number;
  kill(index: number): void;
  /** Number of live particles. */
  count(): number;
  clear(): void;
};

export function createPool<F extends string>(capacity: number, fieldNames: readonly F[]): Pool<F> {
  const alive = new Uint8Array(capacity);
  const free = new Int32Array(capacity);
  const fields = {} as Record<F, Float32Array>;
  for (const name of fieldNames) fields[name] = new Float32Array(capacity);

  let freeTop = 0;
  let live = 0;

  const clear = () => {
    alive.fill(0);
    for (let i = 0; i < capacity; i++) free[i] = capacity - 1 - i;
    freeTop = capacity;
    live = 0;
  };
  clear();

  return {
    capacity,
    alive,
    fields,
    spawn() {
      if (freeTop === 0) return -1;
      const index = free[--freeTop];
      alive[index] = 1;
      live++;
      return index;
    },
    kill(index) {
      if (!alive[index]) return;
      alive[index] = 0;
      free[freeTop++] = index;
      live--;
    },
    count: () => live,
    clear,
  };
}
