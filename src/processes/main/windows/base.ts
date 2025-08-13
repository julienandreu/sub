import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { PRELOAD_PATH } from './constants';
import { is } from '@electron-toolkit/utils';

export class Base {
  public window: BrowserWindow | null = null;

  protected path = '/';

  protected showOnReady = false;

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
      if (this.showOnReady) {
        this.window?.show();
      }
    });

    this.window?.on('closed', () => {
      this.window = null;
    });

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      await this.window?.loadURL(`${process.env.ELECTRON_RENDERER_URL}${this.path}`);
    } else {
      await this.window?.loadURL(`app://-${this.path}`);
    }

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
