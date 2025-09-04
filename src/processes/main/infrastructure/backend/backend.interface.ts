export interface BackendRepository {
  setToken(token: string): string;
  resetToken(): boolean;
  fetch(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}

export const BackendRepository = Symbol('BackendRepository');
