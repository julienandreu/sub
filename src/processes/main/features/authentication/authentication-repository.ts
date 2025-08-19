export class AuthRepository {
  private readonly storage: Storage;
  private readonly api: Api;

  constructor(storage: Storage, api: Api) {
    this.storage = storage;
    this.api = api;
  }

  async getToken(credentials: Credentials): Promise<Token> {
    const response = await this.api.signIn(credentials);
  }

  async revoke() {
    const response = await this.api.signOut();

    this.storage.clear('token');
  }
}
