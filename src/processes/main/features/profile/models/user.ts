interface UserParams {
  name: string;
  email: string;
}

export class User {
  readonly name: string;
  readonly email: string;

  constructor({ name, email }: UserParams) {
    this.name = name;
    this.email = email;
  }
}
