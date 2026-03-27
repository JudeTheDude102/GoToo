import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

// Creates a Zustand-compatible StateStorage backed by an MMKV instance.
export function createZustandMMKVStorage(id: string): StateStorage {
  const storage = createMMKV({ id });
  return {
    getItem: (name) => storage.getString(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
    removeItem: (name) => storage.remove(name),
  };
}
