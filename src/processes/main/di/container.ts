import 'reflect-metadata';

import { container } from 'tsyringe';
import { UserMeHandler, UserSignInHandler, UserSignOutHandler } from '../../../events/user';
import { WindowMoveHandler, WindowOpenHandler } from '../../../events/window';
import { AuthenticationRepository } from '../features/authentication/authentication-repository';
import { AuthenticationService } from '../features/authentication/authentication-service';
import { ApiBackendRepository } from '../infrastructure/backend/api-backend-repository';
import { SQLiteStorageRepository } from '../infrastructure/storage/sqlite-storage-repository';
import { AuthWindow } from '../windows/auth';
import { WidgetWindow } from '../windows/widget';
import { BackendRepository } from '../infrastructure/backend/backend.interface';
import { StorageRepository } from '../infrastructure/storage/storage.interface';
import { TrayService } from '../tray-service';

container.registerSingleton(AuthenticationRepository, AuthenticationRepository);
container.registerSingleton(AuthenticationService, AuthenticationService);
container.registerSingleton(AuthWindow, AuthWindow);
container.registerSingleton(BackendRepository, ApiBackendRepository);
container.registerSingleton(StorageRepository, SQLiteStorageRepository);
container.registerSingleton(UserMeHandler, UserMeHandler);
container.registerSingleton(UserSignInHandler, UserSignInHandler);
container.registerSingleton(UserSignOutHandler, UserSignOutHandler);
container.registerSingleton(WidgetWindow, WidgetWindow);
container.registerSingleton(WindowMoveHandler, WindowMoveHandler);
container.registerSingleton(WindowOpenHandler, WindowOpenHandler);
container.registerSingleton(TrayService, TrayService);

export { container };
