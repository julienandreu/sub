// Import the actual module
import DatabaseModule, { Statement } from 'better-sqlite3';

// Type definitions for better-sqlite3
type DatabaseConstructor = new (path: string | Buffer, options?: DatabaseOptions) => DatabaseInstance;

interface DatabaseOptions {
  readonly?: boolean;
  fileMustExist?: boolean;
  timeout?: number;
  verbose?: (...args: unknown[]) => void;
}

interface DatabaseInstance {
  pragma(sql: string): unknown;
  close(): void;
  prepare(sql: string): Statement;
  exec(sql: string): void;
}

const Database = DatabaseModule as unknown as DatabaseConstructor;

export class Storage {
  private static instance: Storage | null = null;
  public static getInstance(): Storage {
    Storage.instance ??= new Storage();

    return Storage.instance;
  }

  private db: DatabaseInstance | null = null;

  private constructor() {
    // private to prevent direct instantiation
  }

  connect(path: string | Buffer, options?: DatabaseOptions): this {
    this.db = new Database(path, options);

    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = OFF');

    this.db.exec(`
        CREATE TABLE IF NOT EXISTS storage (
            key TEXT PRIMARY KEY,
            value BLOB,
            created_at TEXT DEFAULT (datetime('now','utc'))
        ) WITHOUT ROWID;
    `);

    this.db.exec('PRAGMA optimize;');

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  get<T>(key: string): T | null {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stmt = this.db.prepare('SELECT value FROM storage WHERE key = ?');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result: unknown = stmt.get(key);

    if (!result) {
      return null;
    }

    const { value } = result as { value: T };

    return value;
  }

  set(key: string, value: unknown): this {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.db.prepare('INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?)').run(key, value);

    return this;
  }

  remove(key: string): this {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.db.prepare('DELETE FROM storage WHERE key = ?').run(key);

    return this;
  }
}
