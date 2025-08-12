import type { BrowserWindowConstructorOptions } from 'electron';
import { Base } from './base';

export class Auth extends Base {
  private static instance: Auth | null = null;
  public static getInstance(): Auth {
    Auth.instance ??= new Auth();

    return Auth.instance;
  }

  public override async create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    if (this.window) {
      this.window.focus();

      return this;
    }

    return super.create(options);
  }

  protected path = '/auth';

  protected getOptions(): BrowserWindowConstructorOptions {
    return {
      ...super.getOptions(),
      height: 480,
      width: 320,
    };
  }
}
