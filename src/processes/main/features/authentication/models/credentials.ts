interface CredentialsParams {
  username: string;
  password: string;
}

export class Credentials {
  readonly username: string;
  readonly password: string;

  constructor({ username, password }: CredentialsParams) {
    this.username = username;
    this.password = password;
  }
}
