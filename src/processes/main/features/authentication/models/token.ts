interface TokenParams {
  value: string;
  type: string;
}

export class Token {
  readonly value: string;
  readonly type: string;

  constructor({ value, type }: TokenParams) {
    this.value = value;
    this.type = type;
  }
}
