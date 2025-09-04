import { BrowserWindow, type IpcMainInvokeEvent } from 'electron';
import { AbstractEventHandler } from '../base';
import { injectable } from 'tsyringe';

export interface WindowPosition {
  x: number;
  y: number;
}


@injectable()
export class WindowMoveHandler extends AbstractEventHandler {
  readonly eventName = 'window.move';

  handle(event: IpcMainInvokeEvent, destination: WindowPosition): WindowPosition {
    const { sender: { id = -1 } } = event;
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
  }
}
