import {
  app,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
} from 'electron';
import { inject, singleton } from 'tsyringe';
import appIconMono from '../../renderer/assets/icons/mono/24x24.png?asset';
import appIcon from '../../renderer/assets/icons/regular/24x24.png?asset';
import { AuthenticationService } from './features/authentication/authentication-service';
import { AuthWindow } from './windows/auth';

@singleton()
export class TrayService {
  private tray: Tray;

  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
  ) {
    const image = nativeImage.createFromPath(
      process.platform === 'darwin' ? appIconMono : appIcon
    );

    this.tray = new Tray(image);
    this.update();
  }

  update() {
    const isAuthenticated = this.authenticationService.isAuthenticated();

    const authenticationAction = isAuthenticated
      ? {
        label: 'Sign-out',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          this.authenticationService.signOut();
        },
      }
      : {
        label: 'Sign-in',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          this.authWindow.create();
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
  }

  setToolTip(tip: string) {
    this.tray.setToolTip(tip);
  }
}
