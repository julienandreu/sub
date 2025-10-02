import 'reflect-metadata';

import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, ipcMain, net, protocol } from 'electron';
import log from 'electron-log/main';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { events } from '../../events';
import { container } from './di/container';
import { TrayService } from './tray-service';
import { StartupService } from './startup-service';

function initliazeLogger() {
  log.initialize({
    preload: true,
  });
  Object.assign(console, log.functions);
}

async function initialize() {
  initliazeLogger();

  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
    {
      scheme: 'saris',
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

    const uri = existsSync(path)
      ? path
      : join(
        __dirname,
        '..',
        'renderer',
        'index.html'
      );

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

  container.resolve(TrayService);
  container.resolve(StartupService);
}

void initialize();
