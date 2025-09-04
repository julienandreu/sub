// Import the actual module
import DatabaseModule, { type Database, type Options } from 'better-sqlite3';
import { StorageRepository } from './storage.interface';
import { injectable, singleton } from 'tsyringe';
import { app } from 'electron';
import { join } from 'path';

@singleton()
@injectable()
export class SQLiteStorageRepository implements StorageRepository {
  private db: Database | null = null;

  constructor() {
    this.connect(join(app.getPath('userData'), 'storage.db'));
  }

  connect(path: string | Buffer, options?: Options): this {
    this.db = new DatabaseModule(path, options);

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

    const stmt = this.db.prepare('SELECT value FROM storage WHERE key = ?');

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

    this.db.prepare('INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?)').run(key, value);

    return this;
  }

  remove(key: string): this {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    this.db.prepare('DELETE FROM storage WHERE key = ?').run(key);

    return this;
  }
}
