import { users } from './users';

export const events = {
  ...users,
} as const;

export type Events = typeof events;
