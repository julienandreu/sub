import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { Events } from '../../events';

function invoke<T extends keyof Events>(
  channel: T,
  ...args: Parameters<Events[T]>
): Promise<ReturnType<Events[T]>> {
  return electronAPI.ipcRenderer.invoke(channel, ...args);
}

function expose(): void {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld('invoke', invoke);
      contextBridge.exposeInMainWorld('electron', electronAPI);
    } catch (error) {
      console.error(
        new Error(
          'Failed to expose Electron APIs to renderer process with context isolation',
          {
            cause: error,
          },
        ),
      );
    }

    return;
  }

  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.invoke = invoke;
}

expose();

