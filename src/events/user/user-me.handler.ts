import { inject, injectable } from 'tsyringe';
import { AbstractEventHandler } from '../base';
import { StorageRepository } from '../../processes/main/infrastructure/storage/storage.interface';

export interface UserData {
  id: number;
  email: string;
  name: string;
  force_reset_password: boolean;
}

export interface UserSelfResponse {
  data: UserData;
  meta: null;
}

function isUserData(data: unknown): data is UserData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if (!('id' in data)) {
    return false;
  }

  if (!('email' in data)) {
    return false;
  }

  if (!('name' in data)) {
    return false;
  }

  if (!('force_reset_password' in data)) {
    return false;
  }

  return true;
}

function isUserSelfResponse(data: unknown): data is UserSelfResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  if (!('data' in data)) {
    return false;
  }

  return isUserData(data.data);
}

@injectable()
export class UserMeHandler extends AbstractEventHandler {
  readonly eventName = 'users.me' as const;

  constructor(
    @inject(StorageRepository) private readonly storage: StorageRepository,
  ) {
    super();
  }

  async handle(): Promise<UserData> {
    const accessToken = this.storage.get<string>('access_token');

    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch('https://api.staging.saris.ai/api/users/self', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: unknown = await response.json();

    if (!isUserSelfResponse(data)) {
      throw new Error('Invalid user self response');
    }

    const user = data.data;
    this.storage.set('me', JSON.stringify(user));

    return user;
  }
}
