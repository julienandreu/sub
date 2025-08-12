import type { BrowserWindowConstructorOptions } from 'electron';
import { Base } from './base';

export class Widget extends Base {
  private static instance: Widget | null = null;
  public static getInstance(): Widget {
    Widget.instance ??= new Widget();

    return Widget.instance;
  }

  public override async create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    if (this.window) {
      this.window.focus();

      return this;
    }

    return super.create(options);
  }

  protected path = '/widget';

  private constructor() {
    // private to prevent direct instantiation
    super();
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
