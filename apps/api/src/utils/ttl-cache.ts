// A small in-process cache with per-entry expiry, used to skip repeat database
// reads for data that rarely changes (sessions, company settings, units).
//
// It lives in this server process's memory, so with more than one API
// instance each one has its own copy. Writes invalidate the local copy
// immediately; the TTL bounds how long another instance can serve stale data.
export class TtlCache<K, V> {
  private readonly entries = new Map<K, { value: V; expiresAt: number }>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries = 1000,
  ) {}

  get(key: K): V | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    // Maps iterate in insertion order, so the first key is the oldest entry.
    if (!this.entries.has(key) && this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next();
      if (!oldest.done) this.entries.delete(oldest.value);
    }
    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  delete(key: K): void {
    this.entries.delete(key);
  }

  deleteWhere(predicate: (value: V, key: K) => boolean): void {
    for (const [key, entry] of this.entries) {
      if (predicate(entry.value, key)) this.entries.delete(key);
    }
  }

  clear(): void {
    this.entries.clear();
  }
}
