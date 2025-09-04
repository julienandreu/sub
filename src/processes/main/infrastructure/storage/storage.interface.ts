export interface StorageRepository {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  get<T>(key: string): T | null;
  set(key: string, value: unknown): this;
  remove(key: string): this;
}

export const StorageRepository = Symbol('StorageRepository');
