import type { BrowserWindowConstructorOptions } from 'electron';
import { container, singleton } from 'tsyringe';
import { BaseWindow } from './base';
import { TrayService } from '../tray-service';

@singleton()
export class WidgetWindow extends BaseWindow {
  protected path = '/widget';

  public create(options: BrowserWindowConstructorOptions = {}): Promise<this> {
    if (this.window) {
      this.window.focus();
      return Promise.resolve(this);
    }

    return super.create(options).then(() => {
      this.setupContextMenu();
      return this;
    });
  }

  private setupContextMenu(): void {
    if (!this.window) return;

    this.window.webContents.on('context-menu', (event) => {
      event.preventDefault();
      const contextMenu = container.resolve(TrayService).update();
      contextMenu.popup();
    });
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
