/// <reference types="vite/client" />

declare global {
  namespace JSX {
    type Element = unknown;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void;
        on: (channel: string, func: (...args: unknown[]) => void) => void;
        once: (channel: string, func: (...args: unknown[]) => void) => void;
      };
      process: {
        versions: {
          electron: string;
          chrome: string;
          node: string;
        };
      };
    };
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}
