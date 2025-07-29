import { is } from '@electron-toolkit/utils';
import { BrowserWindow, shell } from 'electron';
import { join } from 'path';

export class Widget {
  private static instance: Widget | null = null;
  public static getInstance(): Widget {
    Widget.instance ??= new Widget();

    return Widget.instance;
  }

  public window: BrowserWindow | null = null;

  private constructor() {
    // private to prevent direct instantiation
  }

  public create(): this {
    this.window = new BrowserWindow({
      alwaysOnTop: true,
      autoHideMenuBar: true,
      backgroundColor: 'transparent',
      frame: false,
      fullscreen: false,
      hasShadow: false,
      height: 64,
      resizable: false,
      show: true,
      transparent: true,
      width: 64,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      }
    });

    this.window.on('ready-to-show', () => {
      this.window?.show();
    });

    this.window.webContents.setWindowOpenHandler((details) => {
      void shell.openExternal(details.url);

      return { action: 'deny' };
    });

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      void this.window.loadURL(process.env.ELECTRON_RENDERER_URL);

      return this;
    }

    void this.window.loadFile(join(__dirname, '../renderer/index.html'));

    return this;
  }
}
