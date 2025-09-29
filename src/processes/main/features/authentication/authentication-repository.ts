import { StorageRepository } from '../../infrastructure/storage/storage.interface';
import { BackendRepository } from '../../infrastructure/backend/backend.interface';
import { Credentials } from './models/credentials';
import { Token } from './models/token';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthenticationRepository {
  private readonly storage: StorageRepository;
  private readonly api: BackendRepository;

  constructor(
    @inject(StorageRepository) storage: StorageRepository,
    @inject(BackendRepository) api: BackendRepository,
  ) {
    this.storage = storage;
    this.api = api;
  }

  async getToken(credentials: Credentials): Promise<Token> {
    const { username, password } = credentials;

    const body = new FormData();
    body.append('username', username);
    body.append('password', password);
    body.append('grant_type', 'password');

    const response = await this.api.fetch('https://api.metro.saris.ai/api/token/', {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      throw new Error('Failed to sign in');
    }

    const data: unknown = await response.json();

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response');
    }

    if (!('access_token' in data && 'token_type' in data)) {
      throw new Error('Invalid response');
    }

    return new Token({ value: String(data.access_token), type: String(data.token_type) });
  }

  async revoke(): Promise<boolean> {
    if (!this.storage.get('token')) {
      return false;
    }

    await this.api.fetch('https://api.metro.saris.ai/api/token/logout');

    this.storage.remove('token');

    return true;
  }
}
