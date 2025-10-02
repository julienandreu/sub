import { inject, singleton } from 'tsyringe';
import { AuthWindow } from './windows/auth';
import { WidgetWindow } from './windows/widget';

@singleton()
export class StartupService {
  constructor(
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
    await this.createAndShowWidget();

    await this.createAndShowAuth();
  }
}
