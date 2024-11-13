import { ROLES } from '../models/enums';

export const isProductionEnv = process.env.NODE_ENV === 'production';
export const isDevelopmentEnv = process.env.NODE_ENV === 'development';
export const isTestENV = process.env.NODE_ENV === 'test';

export const isSuperAdmin = (role: string): boolean => {
  let val: boolean;
  role === ROLES.SUPERADMIN ? (val = true) : (val = false);
  return val;
};

export const isValuePresent = (value: any): boolean => {
  return value !== '' && value !== null && value !== undefined;
};

export const is2FAenabled = (authenticator: boolean): boolean => {
  if (!authenticator) return false;
  return true;
};
