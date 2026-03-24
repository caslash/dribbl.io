/**
 * Returns a deterministic pseudo-random number generator seeded from `seed`.
 *
 * Uses a djb2 hash to derive the initial state, followed by a MurmurHash3
 * finalizer to ensure good avalanche (so that nearby seeds like consecutive
 * dates produce well-spread outputs), then a standard LCG to advance it.
 * The same seed always produces the same sequence, so the schedule is
 * reproducible and can be re-generated safely.
 *
 * @param seed - An arbitrary string (typically a date like `"2026-03-22"`).
 * @returns A `() => number` function returning values in `[0, 1)`.
 *
 * @example
 * const rng = seededRandom('2026-03-22');
 * const index = Math.floor(rng() * items.length);
 */
export function seededRandom(seed: string): () => number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 33) ^ seed.charCodeAt(i);
  }
  // MurmurHash3 finalizer — ensures nearby seeds (e.g. consecutive dates)
  // avalanche into distant outputs rather than staying clustered.
  h = h >>> 0;
  h ^= h >>> 16;
  h = Math.imul(0x85ebca6b, h) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(0xc2b2ae35, h) >>> 0;
  h ^= h >>> 16;
  return () => {
    h = Math.imul(1664525, h) + 1013904223;
    h = h >>> 0;
    return h / 0x100000000;
  };
}

/**
 * Yields every date string between `start` and `end` (inclusive) in
 * `"YYYY-MM-DD"` format, advancing one calendar day at a time.
 *
 * Uses UTC noon internally to avoid DST edge cases shifting the date.
 *
 * @param start - Start date `"YYYY-MM-DD"`.
 * @param end - End date `"YYYY-MM-DD"` (inclusive).
 *
 * @example
 * for (const date of dateRange('2026-03-22', '2026-03-28')) {
 *   console.log(date); // '2026-03-22', '2026-03-23', ...
 * }
 */
export function* dateRange(start: string, end: string): Generator<string> {
  const current = new Date(`${start}T12:00:00Z`);
  const endDate = new Date(`${end}T12:00:00Z`);

  while (current <= endDate) {
    yield current.toISOString().slice(0, 10);
    current.setUTCDate(current.getUTCDate() + 1);
  }
}
