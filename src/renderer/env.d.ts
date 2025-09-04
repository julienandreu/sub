/// <reference types="vite/client" />
import type { RendererEvents } from '../events';

type Invoke = <T extends keyof RendererEvents>(
  channel: T,
  ...args: RendererEvents[T] extends (...args: infer Args) => unknown ? Args : never,
) => RendererEvents[T] extends (...args: unknown[]) => infer Return ? Return : never;

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

