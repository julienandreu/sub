import { WindowPosition } from '../../events/window';

export function useInvoke() {

  return {
    user: {
      auth: (username: string, password: string) => window.invoke('users.auth', username, password),
    },
    window: {
      move: (destination: WindowPosition) => window.invoke('window.move', destination),
    },
  } as const;
}
