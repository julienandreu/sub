import type { AvailableWindows, WindowPosition } from '../../events/window';

export function useInvoke() {
  return {
    user: {
      signIn: (username: string, password: string) => window.invoke('users.sign-in', username, password),
      signOut: () => window.invoke('users.sign-out'),
    },
    window: {
      move: (destination: WindowPosition) => window.invoke('window.move', destination),
      open: (endpoint: AvailableWindows) => window.invoke('window.open', endpoint),
    },
  } as const;
}
