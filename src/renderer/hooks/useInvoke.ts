export function useInvoke() {

  return {
    user: {
      auth: (username: string, password: string) => window.invoke('users.auth', username, password),
    }
  } as const;
}
