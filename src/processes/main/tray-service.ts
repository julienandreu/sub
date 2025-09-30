import {
  app,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  Tray,
} from 'electron';
import { inject, singleton } from 'tsyringe';
import { AuthenticationService } from './features/authentication/authentication-service';
import { AuthWindow } from './windows/auth';
import { getRendererPath } from './path';
import { join } from 'path';

@singleton()
export class TrayService {
  private tray: Tray;

  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
  ) {
    const image = nativeImage.createFromPath(
      join(
        getRendererPath(),
        'assets',
        'icons',
        process.platform === 'darwin' ? 'mono' : 'regular',
        '24x24.png',
      )
    );

    this.tray = new Tray(image);
    this.update();
  }

  update(): Menu {
    const isAuthenticated = this.authenticationService.isAuthenticated();

    const authenticationAction = isAuthenticated
      ? {
        label: 'Sign-out',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          void this.authenticationService.signOut();
        },
      }
      : {
        label: 'Sign-in',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          void this.authWindow.create();
        },
      };

    const template = [
      authenticationAction,
      { type: 'separator' },
      { label: `Version ${app.getVersion()} : ${JSON.stringify(isAuthenticated)}` },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ] satisfies MenuItemConstructorOptions[];

    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    return contextMenu;
  }

  setToolTip(tip: string): void {
    this.tray.setToolTip(tip);
  }
}
