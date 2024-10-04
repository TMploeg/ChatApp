import { StorageLocation } from "../enums/StorageLocation";

export default function useStorage<T>(location: StorageLocation) {
  function get(): T | null {
    const token = sessionStorage.getItem(location);

    if (!token) {
      return null;
    }

    return JSON.parse(token);
  }

  function set(value: T | null) {
    if (value === null) {
      sessionStorage.removeItem(location);
      return;
    }

    sessionStorage.setItem(location, JSON.stringify(value));
  }

  return { get, set };
}
