import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain } from 'electron';
import { events } from '../../events';
import { Widget } from './widget';

void app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.sub');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  Widget.getInstance().create();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      Widget.getInstance().create();
    }
  });
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
