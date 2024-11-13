import { ContainerKeys } from './container.types';
import { ContainerInstanceTypes } from './container.interfaces';
import { AuthController } from '../controllers/auth.controllers';
import LoginActivitiesControllers from '../controllers/login-activities.controllers';
import UserControllers from '../controllers/user.controllers';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { AuthService } from '../services/auth/auth.services';
import LoginActivitiesServices from '../services/user/login-activities.services';
import UserServices from '../services/user/user.services';

class Container {
  private instances: Partial<Record<ContainerKeys, ContainerInstanceTypes[ContainerKeys]>> = {};

  register<K extends ContainerKeys>(key: K, instance: ContainerInstanceTypes[K]): void {
    this.instances[key] = instance;
  }

  resolve<K extends ContainerKeys>(key: K): ContainerInstanceTypes[K] {
    return this.instances[key] as ContainerInstanceTypes[K];
  }
}

const container = new Container();

container.register('userServices', new UserServices());
container.register('AuthService', new AuthService(container.resolve('userServices')));
container.register('loginActivitiesServices', new LoginActivitiesServices());

container.register(
  'authController',
  new AuthController(container.resolve('AuthService'), container.resolve('userServices'))
);
container.register(
  'userController',
  new UserControllers(container.resolve('AuthService'), container.resolve('userServices'))
);
container.register('authMiddleware', new AuthMiddleware());
container.register(
  'loginActivitiesControllers',
  new LoginActivitiesControllers(
    container.resolve('userServices'),
    container.resolve('loginActivitiesServices')
  )
);

export default container;
