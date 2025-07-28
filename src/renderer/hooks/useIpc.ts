export function useIpc() {

  return {
    user: {
      auth: async (username: string, password: string) => {
        return window.invoke('users.auth', username, password);
      },
    }
  } as const;
}
