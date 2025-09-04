import type { BrowserWindowConstructorOptions } from 'electron';
import { singleton } from 'tsyringe';
import { BaseWindow } from './base';

@singleton()
export class WidgetWindow extends BaseWindow {
  protected path = '/widget';

  public create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    if (this.window) {
      this.window.focus();
      return Promise.resolve(this);
    }

    return super.create(options);
  }

  protected getOptions(): BrowserWindowConstructorOptions {
    return {
      ...super.getOptions(),
      alwaysOnTop: true,
      autoHideMenuBar: true,
      frame: false,
      fullscreen: false,
      hasShadow: false,
      height: 64,
      resizable: false,
      transparent: true,
      width: 64,
      x: 64,
      y: 64,
    };
  }
}
