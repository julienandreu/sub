export function useInvoke() {
  return {
    user: {
      signIn: (username: string, password: string) => window.invoke('users.sign-in', username, password),
      signOut: () => window.invoke('users.sign-out'),
      me: () => window.invoke('users.me'),
    },
    window: {
      move: (destination: { x: number; y: number }) => window.invoke('window.move', destination),
      open: (endpoint: 'auth') => window.invoke('window.open', endpoint),
    },
  } as const;
}
