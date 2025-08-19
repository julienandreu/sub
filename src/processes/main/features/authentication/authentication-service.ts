import { Credentials } from "./models/credentials";

export class AuthService {
  static async signIn(credentials: Credentials): Promise<Token> {
  }

  static async signOut(): Promise<boolean> {
  }
}
