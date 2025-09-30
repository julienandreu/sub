import { type BrowserWindowConstructorOptions } from 'electron';
import { injectable, singleton } from 'tsyringe';
import { BaseWindow } from './base';

@injectable()
@singleton()
export class AuthWindow extends BaseWindow {
  protected path = '/auth';
  protected showOnReady = true;

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
      height: 480,
      minHeight: 480,
      minWidth: 320,
      width: 320,
    };
  }
}
