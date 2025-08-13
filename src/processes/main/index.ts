import { electronApp, optimizer } from '@electron-toolkit/utils';
import { App, app, ipcMain, type IpcMainInvokeEvent, net, protocol } from 'electron';
import log from 'electron-log/main';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { events } from '../../events';
import { Storage } from './storage';
import { Auth } from './windows/auth';
import { Widget } from './windows/widget';

const emptyIpcMainInvokeEvent: IpcMainInvokeEvent = {} as IpcMainInvokeEvent;

function getStoragePath(app: App) {
  return join(app.getPath('userData'), 'storage.db');
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

  protocol.handle('app', request => {
    const { pathname } = new URL(request.url);

    const path = join(
      __dirname,
      '..',
      'renderer',
      pathname === '/' ? '/index.html' : pathname
    );

    const uri = existsSync(path) ? path : join(__dirname, '..', 'renderer', 'index.html');

    return net.fetch(pathToFileURL(uri).toString());
  });

  app.on('window-all-closed', () => {
    app.quit();
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
