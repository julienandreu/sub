import type { IpcMainInvokeEvent } from 'electron';
import { inject, injectable } from 'tsyringe';
import { AbstractEventHandler } from '../base';
import { AuthenticationService, Credentials } from '../../processes/main/features/authentication';
import { AuthWindow } from '../../processes/main/windows/auth';
import { WidgetWindow } from '../../processes/main/windows/widget';


@injectable()
export class UserSignInHandler extends AbstractEventHandler {
  readonly eventName = 'users.sign-in' as const;

  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
    @inject(WidgetWindow) private readonly widgetWindow: WidgetWindow,
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
  ) {
    super();
  }

  async handle(
    _: IpcMainInvokeEvent,
    username: string,
    password: string,
  ): Promise<boolean> {
    const credentials = new Credentials({ username, password });
    const token = await this.authenticationService.signIn(credentials);

    if (!token.value) {
      throw new Error('Failed to sign in');
    }

    const widget = await this.widgetWindow.create();
    widget.window?.show();

    const auth = await this.authWindow.create();
    auth.window?.close();

    return true;
  }
}
