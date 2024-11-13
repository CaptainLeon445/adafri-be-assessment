import { ROLES } from '../models/enums';
import { isDevelopmentEnv, isTestENV } from '../utilities/guards';

export const HUNDRED = 100;
export const BASE_10 = 10;
export const ZERO = 0;
export const OTP_EXPIRE_TIME: number = 15;

export const FILE_EXTENSION = {
  PDF: 'pdf',
  JPEG: 'jpeg',
  JPG: 'jpg',
  PNG: 'png',
};

export const NOTIFICATION_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};
const USER_2FA_ACTIONS = {
  LOGIN: 'login',
  ACTIVATE: 'activate',
  CHANGEPASSWORD: 'changePassword',
  RESETPASSWORD: 'resetPassword',
  CHANGEEMAIL: 'changeEmail',
  DEACTIVATE: 'deactivate',
};

export const DGT_AUTH_TYPE = {
  KEY: 'dgtauth',
};
export const DGT_AUTH_TYPE_ARRAY = Object.values(DGT_AUTH_TYPE);

export const USER_2FA_ACTIONS_ARRAY = Object.keys(USER_2FA_ACTIONS);

const BASE_ORIGINS = ['https://digit-tally.io'];
export const SUBSCRIPTION_PLAN = {
  FREE: 'accounting free',
  START: 'accounting start',
  STANDARD: 'accounting standard',
  PLUS: 'accounting plus',
};

const DEV_ORIGINS = [
  'http://localhost:9628',
  'http://127.0.0.1:9628',
  'http://localhost:8752',
  'http://127.0.0.1:8752',
  'http://localhost:3932',
  'http://127.0.0.1:3932',
  'http://localhost:4512',
  'http://127.0.0.1:4512',
  'https://localhost:9628',
  'https://127.0.0.1:9628',
  'https://localhost:8752',
  'https://127.0.0.1:8752',
  'https://localhost:3932',
  'https://127.0.0.1:3932',
  'https://localhost:4512',
  'https://127.0.0.1:4512',
  'http://192.168.6.5:8080',
  'http://192.168.0.113:3000',
  'http://192.168.0.127:3000',
  'http://192.168.43.12:3000',
];

export const APP_ORIGINS = {
  DEV_USER_APP: process.env.DEV_USER_APP,
  DEV_ADMIN: process.env.DEV_ADMIN_APP,
  PROD_USER_APP: process.env.PROD_USER_APP,
  PROD_ADMIN: process.env.PROD_ADMIN_APP,
};

export const ALLOWED_ORIGINS =
  isDevelopmentEnv || isTestENV
    ? [...DEV_ORIGINS, ...BASE_ORIGINS, process.env.DEV_USER_APP, process.env.DEV_ADMIN_APP]
    : [...BASE_ORIGINS, process.env.PROD_USER_APP, process.env.PROD_ADMIN_APP];

export const ADMIN_ORIGINS = [process.env.PROD_ADMIN_APP, process.env.DEV_ADMIN_APP];

export const USER_APP_ORIGINS =
  isDevelopmentEnv || isTestENV
    ? [...DEV_ORIGINS, APP_ORIGINS.DEV_USER_APP, APP_ORIGINS.PROD_USER_APP]
    : [APP_ORIGINS.DEV_USER_APP, APP_ORIGINS.PROD_USER_APP];

export const ADMIN_APP_ORIGINS =
  isDevelopmentEnv || isTestENV
    ? [...DEV_ORIGINS, APP_ORIGINS.DEV_ADMIN, APP_ORIGINS.PROD_ADMIN]
    : [APP_ORIGINS.DEV_ADMIN, APP_ORIGINS.PROD_ADMIN];

export const USERAPP_GLOBAL_ACCESS = [ROLES.SUPERADMIN, ROLES.OWNER, ROLES.MANAGER];
export const USERAPP_ACCESS = [ROLES.SUPERADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.BASIC];
export const ADMINAPP_GLOBAL_ACCESS = [ROLES.SUPERADMIN, ROLES.ADMIN];
export const OWNER_ACCESS = [ROLES.SUPERADMIN, ROLES.OWNER];
export const ADMIN_ACCESS = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT];
export const MUTABLE_ADMIN_ROLES = [ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT];
export const SUBSCRIPTION_PLAN_ARRAY = Object.values(SUBSCRIPTION_PLAN);
