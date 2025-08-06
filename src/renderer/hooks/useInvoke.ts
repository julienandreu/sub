import type { AvailableWindows, WindowPosition } from '../../events/window';

export function useInvoke() {

  return {
    user: {
      auth: (username: string, password: string) => window.invoke('users.auth', username, password),
    },
    window: {
      move: (destination: WindowPosition) => window.invoke('window.move', destination),
      open: (endpoint: AvailableWindows) => window.invoke('window.open', endpoint),
    },
  } as const;
}
