import { electronApp, optimizer } from '@electron-toolkit/utils';
import { App, app, ipcMain, type IpcMainInvokeEvent, Menu, nativeImage, net, protocol, Tray } from 'electron';
import log from 'electron-log/main';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { events } from '../../events';
import { Storage } from './storage';
import { Auth } from './windows/auth';
import { Widget } from './windows/widget';
import appIcon from '../../renderer/assets/icons/mono/tray-icon.png?asset';

let trayIcon: Tray;

const emptyIpcMainInvokeEvent: IpcMainInvokeEvent = {} as IpcMainInvokeEvent;

function getStoragePath(app: App) {
  return join(app.getPath('userData'), 'storage.db');
}

function getRendererPath() {
  return join(
    __dirname,
    '..',
    'renderer',
  );
}

async function initialize() {
  log.initialize({
    preload: true,
  });
  Object.assign(console, log.functions);

  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
      },
    },
  ]);

  await app.whenReady();


  const icon = nativeImage.createFromPath(appIcon);
  trayIcon = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' }
  ]);

  // Make a change to the context menu
  contextMenu.items[1].checked = false;

  // Call this again for Linux because we modified the context menu
  trayIcon.setContextMenu(contextMenu);

  protocol.handle('app', request => {
    const { pathname } = new URL(request.url);

    const path = join(
      getRendererPath(),
      pathname === '/' ? '/index.html' : pathname
    );

    const uri = existsSync(path) ? path : join(getRendererPath(), 'index.html');

    return net.fetch(pathToFileURL(uri).toString());
  });

  app.on('window-all-closed', () => {
    app.quit();
    process.exit(0);
  });

  // Handle events
  Object.entries(events).forEach(([channel, listener]) => {
    ipcMain.handle(channel, listener);
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.sub');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  Storage.getInstance().connect(getStoragePath(app));


  try {
    await events['users.me'](emptyIpcMainInvokeEvent);

    const widget = await Widget.getInstance().create();
    widget.window?.show();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    await Auth.getInstance().create();
  }
}

void initialize();
