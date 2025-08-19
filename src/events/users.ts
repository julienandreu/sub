import type { IpcMainInvokeEvent } from 'electron';
import { Storage } from '../processes/main/storage';
import { Auth } from '../processes/main/windows/auth';
import { Widget } from '../processes/main/windows/widget';
import { AuthService } from '../processes/main/features/authentication';

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

export class UserSelfError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = 'UserSelfError';
  }
}

export class UserSignInError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = 'UserSignInError';
  }
}

export class UserSignOutError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = 'UserSignOutError';
  }
}

export interface SignInResponse {
  access_token: string;
  token_type: string;
}

function isSignInResponse(data: unknown): data is SignInResponse {
  return typeof data === 'object' && data !== null && 'access_token' in data && 'token_type' in data;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  force_reset_password: boolean;
}

function isUserData(data: unknown): data is UserData {
  return typeof data === 'object' && data !== null && 'id' in data && 'email' in data && 'name' in data && 'force_reset_password' in data;
}

export interface UserSelfResponse {
  data: UserData;
  meta: null;
}

function isUserSelfResponse(data: unknown): data is UserSelfResponse {
  return typeof data === 'object' && data !== null && 'data' in data && 'meta' in data && isUserData(data.data);
}

export const users = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'users.me': async (_: IpcMainInvokeEvent) => {
    const accessToken = Storage.getInstance().get<string>('access_token');

    if (!accessToken) {
      throw new UserSelfError('No access token found');
    }

    const response = await fetch('https://api.staging.saris.ai/api/users/self', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: unknown = await response.json();

    if (!isUserSelfResponse(data)) {
      throw new UserSelfError('Invalid user self response');
    }

    const user = data.data;

    Storage.getInstance().set('me', JSON.stringify(user));

    return user;
  },
  'users.sign-in': async (_: IpcMainInvokeEvent, username: string, password: string) => {
    const params = new FormData();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    const credentials = new Credentials({ username, password });

    const token = await AuthService.signIn(credentials);

    const response = await fetch('https://api.staging.saris.ai/api/token/', {
      method: 'POST',
      body: params,
    });

    const data: unknown = await response.json();

    if (!isSignInResponse(data)) {
      throw new UserSignInError('Invalid authentication response');
    }

    Storage.getInstance().set('access_token', data.access_token);

    const widget = await Widget.getInstance().create();
    widget.window?.show();

    const auth = await Auth.getInstance().create();
    auth.window?.close();

    return data;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'users.sign-out': async (_: IpcMainInvokeEvent) => {
    const accessToken = Storage.getInstance().get<string>('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch('https://api.staging.saris.ai/api/token/logout', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    Storage.getInstance().remove('access_token');

    const auth = await Auth.getInstance().create();
    auth.window?.show();

    return response.status < 400;
  },
} as const;

export type Users = typeof users;

