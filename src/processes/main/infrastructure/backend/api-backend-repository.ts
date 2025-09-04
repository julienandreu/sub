import { BackendRepository } from './backend.interface';
import { injectable, singleton } from 'tsyringe';

@injectable()
@singleton()
export class ApiBackendRepository implements BackendRepository {
  private token: string | null = null;

  public setToken(token: string) {
    this.token = token;

    return this.token;
  }

  public resetToken() {
    this.token = null;

    return true;
  }

  public async fetch(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ): Promise<Response> {
    const headers = new Headers(init?.headers);

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    return fetch(input, {
      headers,
      ...init,
    });
  }
}
