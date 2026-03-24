import '@testing-library/jest-dom';

// Node.js 22+ ships a built-in `localStorage` global that does not implement
// the full Web Storage API (no `.clear()`, no `.key()`). When Vitest runs under
// Node.js 22+, that thin built-in takes precedence over jsdom's implementation.
// This polyfill replaces globalThis.localStorage with a spec-compliant in-memory
// implementation so tests that call `localStorage.clear()`, `.setItem()`, etc.
// work correctly regardless of the Node.js version.
class InMemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new InMemoryStorage(),
  writable: true,
  configurable: true,
});
