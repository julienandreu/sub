import { BrowserWindow, type IpcMainInvokeEvent } from 'electron';
import { Auth } from '../processes/main/windows/auth';

export type AvailableWindows = 'auth';

export interface WindowPosition {
  x: number;
  y: number;
}

export const window = {
  'window.move': (
    { sender: { id = -1 } }: IpcMainInvokeEvent,
    destination: WindowPosition,
  ): WindowPosition => {
    const allWindows = BrowserWindow.getAllWindows();
    const currentWindow = allWindows.find(win => win.id === id);
    if (!currentWindow) {
      throw new Error('Window not found');
    }

    const { x: dx, y: dy } = destination;
    const [x, y] = currentWindow.getPosition();

    const newX = x + dx;
    const newY = y + dy;

    currentWindow.setPosition(Math.round(newX), Math.round(newY));

    return {
      x: newX,
      y: newY,
    };
  },
  'window.open': async (_: IpcMainInvokeEvent, endpoint: AvailableWindows) => {
    switch (endpoint) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case 'auth': {
        const auth = await Auth.getInstance().create();

        return auth.window?.id;
      }
      default:
        throw new Error(`Unknown window: ${String(endpoint)}`);
    }
  },
} as const;

export type Window = typeof window;

