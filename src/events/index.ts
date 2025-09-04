import type { IpcMainInvokeEvent } from 'electron';
import { container } from '../processes/main/di/container';
import { UserMeHandler, UserSignInHandler, UserSignOutHandler } from './user';
import { WindowMoveHandler, WindowOpenHandler } from './window';
import type { IEventHandler } from './base';

const useMeEvent = container.resolve(UserMeHandler);
const useSignInEvent = container.resolve(UserSignInHandler);
const useSignOutEvent = container.resolve(UserSignOutHandler);
const useWindowMoveEvent = container.resolve(WindowMoveHandler);
const useWindowOpenEvent = container.resolve(WindowOpenHandler);

export const events = {
  [useMeEvent.eventName]: useMeEvent.handle.bind(useMeEvent),
  [useSignInEvent.eventName]: useSignInEvent.handle.bind(useSignInEvent),
  [useSignOutEvent.eventName]: useSignOutEvent.handle.bind(useSignOutEvent),
  [useWindowMoveEvent.eventName]: useWindowMoveEvent.handle.bind(useWindowMoveEvent),
  [useWindowOpenEvent.eventName]: useWindowOpenEvent.handle.bind(useWindowOpenEvent),
};

export type Events = typeof events;

type WithoutInvokeEvent<T extends IEventHandler['handle']> =
  (
    ...args: T extends (...args: infer Args) => unknown
      ? 0 extends Args['length']
      ? []
      : Args extends [IpcMainInvokeEvent, ...infer Rest]
      ? Rest
      : Args
      : []
  ) => ReturnType<T>;

export type RendererEvents = {
  [K in keyof Events]: WithoutInvokeEvent<Events[K]>
};
