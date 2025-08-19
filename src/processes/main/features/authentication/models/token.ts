interface TokenParams {
  value: string;
}

export class Token {
  readonly value: string;

  constructor({ value }: TokenParams) {
    this.value = value;
  }
}
