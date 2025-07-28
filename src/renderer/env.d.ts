/// <reference types="vite/client" />
import type { Events } from '../events';

type Invoke = <T extends keyof Events>(
        channel: T,
        ...args: Parameters<Events[T]> extends [unknown, ...infer Rest]
          ? Rest
          : never,
      ) => ReturnType<Events[T]>;

interface Versions {
  electron: string;
  chrome: string;
  node: string;
}

declare global {
  namespace JSX {
    type Element = unknown;
  }

  interface Window {
    invoke: Invoke;
    electron: {
      process: {
        versions: Versions;
      };
    };
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}
