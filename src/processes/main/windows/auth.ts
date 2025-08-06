import type { BrowserWindowConstructorOptions } from 'electron';
import { Base } from './base';

export class Auth extends Base {
  private static instance: Auth | null = null;
  public static getInstance(): Auth {
    Auth.instance ??= new Auth();

    return Auth.instance;
  }

  protected path = '/auth';

  protected getOptions(): BrowserWindowConstructorOptions {
    return {
      ...super.getOptions(),
      height: 480,
      width: 320,
    };
  }

  protected async afterLoad(): Promise<unknown> {
    console.log('AUTH.afterLoad', this.window?.id);
    return this.window?.webContents.executeJavaScript(
      'window.location.hash = "/auth"',
    );
  }
}
