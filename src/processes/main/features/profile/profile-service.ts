import { ProfileRepository } from './profile-repository';
import { User } from './models/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ProfileService {
  private readonly repository: ProfileRepository;

  constructor(
    @inject(ProfileRepository) repository: ProfileRepository,
  ) {
    this.repository = repository;
  }

  async getCurrentUser(): Promise<User> {
    const user = await this.repository.getCurrentUser();

    console.dir({ user }, { depth: null, colors: true });

    return user;
  }
}
