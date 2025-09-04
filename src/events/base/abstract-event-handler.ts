import type { IpcMainInvokeEvent } from 'electron';
import type { IEventHandler } from './event-handler.interface';

export abstract class AbstractEventHandler implements IEventHandler {
  abstract readonly eventName: string;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  abstract handle(event: IpcMainInvokeEvent, ...args: unknown[]): Promise<unknown> | unknown;
}
