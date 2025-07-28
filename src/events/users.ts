import type { IpcMainInvokeEvent } from 'electron';

export const users = {
  'users.auth': async (_: IpcMainInvokeEvent, username: string, password: string) => {
    return Promise.resolve({
      username,
      password,
    });
  },
} as const;

export type Users = typeof users;

