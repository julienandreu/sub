import { users } from './users';
import { window } from './window';

export const events = {
  ...users,
  ...window,
} as const;

export type Events = typeof events;
