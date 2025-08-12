import { electronApp, optimizer } from '@electron-toolkit/utils';
import { App, app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import { events } from '../../events';
import { Widget } from './windows/widget';
import { join } from 'path';
import { Storage } from './storage';
import log from 'electron-log/main';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';

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

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
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

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      void Widget.getInstance().create();
    }
  });

  await Widget.getInstance().create();

  Storage.getInstance().connect(getStoragePath(app));
}

void initialize();
