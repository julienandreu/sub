import type { IpcMainInvokeEvent } from 'electron';
import { inject, injectable } from 'tsyringe';
import { AbstractEventHandler } from '../base';
import { AuthWindow } from '../../processes/main/windows/auth';

export type AvailableWindows = 'auth';


@injectable()
export class WindowOpenHandler extends AbstractEventHandler {
  readonly eventName = 'window.open';

  constructor(
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
  ) {
    super();
  }

  async handle(
    _: IpcMainInvokeEvent,
    endpoint: AvailableWindows,
  ): Promise<number | undefined> {
    switch (endpoint) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      case 'auth': {
        const auth = await this.authWindow.create();
        return auth.window?.id;
      }
      default:
        throw new Error(`Unknown window: ${String(endpoint)}`);
    }
  }
}
