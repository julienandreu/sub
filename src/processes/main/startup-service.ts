import { inject, singleton } from 'tsyringe';
import { AuthenticationService } from './features/authentication/authentication-service';
import { AuthWindow } from './windows/auth';
import { WidgetWindow } from './windows/widget';

@singleton()
export class StartupService {
  constructor(
    @inject(AuthenticationService) private readonly authenticationService: AuthenticationService,
    @inject(AuthWindow) private readonly authWindow: AuthWindow,
    @inject(WidgetWindow) private readonly widgetWindow: WidgetWindow,
  ) {
    void this.showWidgetOrAuth();
  }

  private async createAndShowWidget() {
    await this.widgetWindow.create();
    this.widgetWindow.window?.show();
  }

  private async createAndShowAuth() {
    const auth = this.authWindow;
    await auth.create();
  }

  private async showWidgetOrAuth() {
    if (this.authenticationService.isAuthenticated()) {
      await this.createAndShowWidget();

      return;
    }

    await this.createAndShowAuth();
  }
}
