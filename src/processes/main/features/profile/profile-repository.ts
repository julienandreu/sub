import { BackendRepository } from '../../infrastructure/backend/backend.interface';
import { User } from './models/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ProfileRepository {
  private readonly api: BackendRepository;

  constructor(
    @inject(BackendRepository) api: BackendRepository,
  ) {
    this.api = api;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.fetch('https://api.metro.saris.ai/api/users/self');

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    const data: unknown = await response.json();

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response');
    }

    if (!('id' in data && 'email' in data && 'name' in data)) {
      throw new Error('Invalid response');
    }

    return new User({ name: String(data.name), email: String(data.email) });
  }
}
