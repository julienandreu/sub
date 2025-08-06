import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { PRELOAD_PATH } from './constants';

export class Base {
  public window: BrowserWindow | null = null;

  protected path = '/';

  protected getOptions(): BrowserWindowConstructorOptions {
    return {
      show: false,
      visualEffectState: 'active',
      webPreferences: {
        preload: PRELOAD_PATH,
        sandbox: false,
      },
    };
  }

  protected async prepare(): Promise<this> {
    this.window?.on('ready-to-show', () => {
      this.window?.show();
    });

    this.window?.on('closed', () => {
      this.window = null;
    });

    this.window?.webContents.openDevTools({ mode: 'detach' });

    await this.window?.loadURL(`app://-${this.path}`);

    return this;
  }

  public async create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    this.window = new BrowserWindow({
      ...this.getOptions(),
      ...options,
    });

    await this.prepare();

    return this;
  }
}
