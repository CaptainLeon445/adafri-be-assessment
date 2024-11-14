import { NextFunction, Request, Response } from 'express';
import { getErrorMessage } from '../error_handlers/global-handler';
import { AuthErrors } from '../../constants/errors.constants';
import { StatusCodes } from 'http-status-codes';
import { ROLES } from '../../constants/values.constants';
import Access from '../../models/access.models';
import { Op } from 'sequelize';
import { isProductionEnv } from '../../utilities/guards';

declare module 'express' {
  interface Request {
    user: any;
  }
}

export const authProtect = async (req: Request, res: Response, next: NextFunction) => {
  const modes: string[] = ['live', 'test'];
  const user: string[] = ['admn', 'usr'];
  const accessKey: string = req.headers['x-api-access-key'] as string;
  if (!accessKey) return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (accessKey.split(' ').length > 1)
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (accessKey.split('_').length < 2)
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (accessKey.split('_')[0].toLocaleLowerCase() !== process.env.AUTH_BASE_KEY)
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (!modes.includes(accessKey.split('_')[1]))
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (!user.includes(accessKey.split('_')[2]))
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  if (isProductionEnv && accessKey.split('_')[1] === 'test')
    return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
  let validKey: Access;
  if (accessKey.split('_')[2] === 'admin') {
    validKey = await Access.findOne({
      where: {
        [Op.or]: { live_admin_key: accessKey, test_admin_key: accessKey },
      },
    });
    if (accessKey.split('_')[2] === 'user') {
      validKey = await Access.findOne({
        where: {
          [Op.or]: { live_user_key: accessKey, test_user_key: accessKey },
        },
      });
    }
    if (!validKey)
      return getErrorMessage(next, AuthErrors.NOT_AUTHORIZED, StatusCodes.UNAUTHORIZED);
    let role: string;
    if (accessKey.split('_')[2] === 'admn') role = ROLES.admin;
    if (accessKey.split('_')[2] === 'usr') role = ROLES.user;
    req.user = { accessKey, role };
    next();
  }
};
export const authRestrictTo = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return getErrorMessage(next, AuthErrors.NO_PERMISSION, StatusCodes.FORBIDDEN);
    next();
  };
};
