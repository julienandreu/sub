import {
  app,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  Tray,
} from 'electron';
import { inject, singleton } from 'tsyringe';
import { AuthenticationService } from './features/authentication/authentication-service';
import { trayIconMono, trayIconRegular } from './assets';


@singleton()
export class TrayService {
  private tray: Tray;

  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
  ) {
    const image = nativeImage.createFromPath(
      process.platform === 'darwin' ? trayIconMono : trayIconRegular
    );

    this.tray = new Tray(image);
    this.update();
  }

  buildMenuTemplate(): MenuItemConstructorOptions[] {
    const isAuthenticated = this.authenticationService.isAuthenticated();

    const authenticationAction = isAuthenticated
      ? {
        label: 'Sign-out',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          void this.authenticationService.signOut();
        },
      }
      : null;

    const template = [
      {
        label: 'Saris AI Desktop App',
      },
      { type: 'separator' },
      authenticationAction,
      { type: 'separator' },
      { label: `Version ${app.getVersion()}` },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ].filter(Boolean);

    // TODO: replace by satisfies MenuItemConstructorOptions[] once Typescript correctly infers the type from `filter()`
    return template as MenuItemConstructorOptions[];
  }

  update(): Menu {
    const template = this.buildMenuTemplate();

    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    return contextMenu;
  }

  setToolTip(tip: string): void {
    this.tray.setToolTip(tip);
  }
}
