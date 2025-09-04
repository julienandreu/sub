import { AuthenticationRepository } from './authentication-repository';
import { Credentials } from './models/credentials';
import { Token } from './models/token';
import { inject, injectable } from 'tsyringe';
import { StorageRepository } from '../../infrastructure/storage/storage.interface';
import { BackendRepository } from '../../infrastructure/backend/backend.interface';

@injectable()
export class AuthenticationService {
  private readonly repository: AuthenticationRepository;
  private readonly storage: StorageRepository;
  private readonly api: BackendRepository;

  constructor(
    @inject(AuthenticationRepository) repository: AuthenticationRepository,
    @inject(StorageRepository) storage: StorageRepository,
    @inject(BackendRepository) api: BackendRepository,
  ) {
    this.repository = repository;
    this.storage = storage;
    this.api = api;
  }

  async signIn(credentials: Credentials): Promise<Token> {
    const token = await this.repository.getToken(credentials);

    console.dir({ token }, { depth: null, colors: true });

    this.storage.set('token', token.value);

    this.api.setToken(token.value);

    return token;
  }

  async signOut(): Promise<boolean> {
    const succeeded = await this.repository.revoke();

    console.dir({ succeeded }, { depth: null, colors: true });

    return succeeded;
  }

  isAuthenticated(): boolean {
    return Boolean(this.storage.get('token'));
  }
}
