import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { Events } from '../../events';

function invoke<T extends keyof Events>(channel: T, ...args: Parameters<Events[T]>): Promise<ReturnType<Events[T]>> {
  return electronAPI.ipcRenderer.invoke(channel, ...args);
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('invoke', invoke);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.invoke = invoke;
}


