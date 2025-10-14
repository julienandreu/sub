import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { injectable } from 'tsyringe';
import { PRELOAD_PATH } from './constants';
import { is } from '@electron-toolkit/utils';

@injectable()
export class BaseWindow {
  public window: BrowserWindow | null = null;

  protected path = '/';
  protected title = 'Saris AI';
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

    // Set CSP and CORS headers
    this.window?.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        if (!details.responseHeaders) {
          return;
        }

        if ('access-control-allow-origin' in details.responseHeaders) {
          delete details.responseHeaders['access-control-allow-origin'];
        }

        details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
        details.responseHeaders['Content-Security-Policy'] = [
          "default-src 'self' app:; script-src 'self' app:; style-src 'self' 'unsafe-inline' app:; img-src 'self' data: app:"
        ];

        callback({
          cancel: false,
          responseHeaders: details.responseHeaders,
        });
      }
    );

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      await this.window?.loadURL(`${process.env.ELECTRON_RENDERER_URL}${this.path}`);
    } else {
      await this.window?.loadURL(`app://saris-ai/${this.path.replace(/^\//, '')}`);
    }

    return this;
  }

  public async create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    this.window = new BrowserWindow({
      ...this.getOptions(),
      ...options,
    });

    await this.prepare();

    this.window.setTitle(this.title);

    return this;
  }
}
