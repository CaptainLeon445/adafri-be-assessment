import { AuthController } from '../controllers/auth.controllers';
import LoginActivitiesControllers from '../controllers/login-activities.controllers';
import UserControllers from '../controllers/user.controllers';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { AuthService } from '../services/auth/auth.services';
import LoginActivitiesServices from '../services/user/login-activities.services';
import UserServices from '../services/user/user.services';

export interface ContainerInstanceTypes {
  userServices: UserServices;
  AuthService: AuthService;
  loginActivitiesServices: LoginActivitiesServices;
  authController: AuthController;
  userController: UserControllers;
  authMiddleware: AuthMiddleware;
  loginActivitiesControllers: LoginActivitiesControllers;
}
