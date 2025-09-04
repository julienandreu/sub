import { inject, injectable } from 'tsyringe';
import { AbstractEventHandler } from '../base';
import { AuthenticationService } from '../../processes/main/features/authentication';
import { AuthWindow } from '../../processes/main/windows/auth';


@injectable()
export class UserSignOutHandler extends AbstractEventHandler {
  readonly eventName = 'users.sign-out';

  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
  ) {
    super();
  }

  async handle(): Promise<boolean> {
    const succeeded = await this.authenticationService.signOut();

    if (!succeeded) {
      throw new Error('Failed to sign out');
    }

    const auth = await this.authWindow.create();
    auth.window?.show();

    return true;
  }
}
