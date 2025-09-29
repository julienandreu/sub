import 'reflect-metadata';

import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, ipcMain, net, protocol } from 'electron';
import log from 'electron-log/main';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { events } from '../../events';
import { container } from './di/container';
import { AuthenticationService } from './features/authentication/authentication-service';
import { AuthWindow } from './windows/auth';
import { WidgetWindow } from './windows/widget';
import { TrayService } from './tray-service';

function getRendererPath() {
  return join(
    __dirname,
    '..',
    'renderer',
  );
}

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
      scheme: 'saris',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
      },
    },
  ]);

  await app.whenReady();

  container.resolve(TrayService);

  setInterval(() => {
    container.resolve(TrayService).update();
  }, 1000);

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

  const authenticationService = container.resolve(AuthenticationService);

  try {
    if (!authenticationService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const widget = container.resolve(WidgetWindow);
    await widget.create();
    widget.window?.show();
  } catch {
    const auth = container.resolve(AuthWindow);
    await auth.create();
  }
}

void initialize();
