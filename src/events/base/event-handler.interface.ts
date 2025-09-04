import type { IpcMainInvokeEvent } from 'electron';

export interface IEventHandler {
  readonly eventName: string;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  handle(event: IpcMainInvokeEvent, ...args: unknown[]): Promise<unknown> | unknown;
}
