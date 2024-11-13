import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';
import User from '../../models/user.model';
import UserUtils from '../../services/user/user-utils.services';
import logger from '../../utilities/logger';
import BlacklistToken from '../../models/blacklist-token.model';
import UserLogins from '../../models/user-logins.model';
import { getErrorMessage } from '../error_handlers/global-handler';
import { ERROR } from '../../constants/errors.constants';
import { ADMIN_ACCESS } from '../../constants/values.constants';
import { currentTimestamp } from '../../utilities/global.utilities';
import { ROLES } from '../../models/enums';
import { verifyAuthToken } from '../../utilities/auth.utilities';

declare module 'express' {
  interface Request {
    user: User;
    userTokenId: string;
  }
}

export class AuthMiddleware {
  public async authProtect(req: Request, res: Response, next: NextFunction) {
    try {
      let decoded: any;
      let uuid: string;
      if (this.getJWTAccessToken(req, next)) {
        const accessToken = this.getJWTAccessToken(req, next);
        if (!accessToken) return;
        const blacklisted = await BlacklistToken.findOne({
          where: { token: accessToken },
        });
        if (blacklisted) return getErrorMessage(next, ERROR.notAuthorized);
        decoded = await this.verifyAndDecodeToken(accessToken, process.env.JWT_SECRET_KEY, next);
        const login = await UserLogins.findOne({
          where: { userId: decoded.uuid, tokenId: decoded.tokenId },
        });
        if (login && login.tokenDeleted === true) {
          await BlacklistToken.create({
            token: accessToken,
          });
          return getErrorMessage(next, ERROR.notAuthorized);
        }
        uuid = decoded.uuid;
        req.userTokenId = decoded.tokenId;
      } else if (this.getAPIAccessKey(req, next)) {
        const apiAccesskey = this.getAPIAccessKey(req, next) as string;
        uuid = apiAccesskey;
        this.setAPIAccessKey(uuid);
      }
      const user = await this.getUserFromToken(uuid);
      if (!user) return getErrorMessage(next, ERROR.notAuthorized);
      if (!user.active) return getErrorMessage(next, ERROR.inactiveAccount);
      if (ADMIN_ACCESS.includes(user.role) && !user.authenticator && !user.authenticatorBackup)
        return getErrorMessage(next, ERROR._2faRequired);
      const superAdmin = await UserUtils.getUserByRole(ROLES.SUPERADMIN);
      if (superAdmin && !superAdmin.authenticator && !superAdmin.authenticatorBackup)
        return getErrorMessage(next, ERROR.noSuperAdmin);
      req.user = user;
      next();
    } catch (error: any) {
      getErrorMessage(next, ERROR.notAuthorized);
    }
  }

  public authRestrictTo(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!roles.includes(req.user.role)) {
          return getErrorMessage(next, ERROR.noPermission);
        }
        next();
      } catch (err: any) {
        logger.error('error', err);
        getErrorMessage(next, ERROR.serverError);
      }
    };
  }

  public async blacklistToken(req: Request, res: Response, next: NextFunction) {
    const token = await this.getJWTAccessToken(req, next);
    if (token) {
      const blacklisted = await BlacklistToken.findOne({ where: { token } });
      if (blacklisted) {
        const decoded = await this.verifyAndDecodeToken(token, process.env.JWT_SECRET_KEY, next);
        if (decoded) {
          const login = await UserUtils.getUserLogin(decoded.uuid, decoded.tokenId);
          if (login) {
            login.loggedOut = true;
            login.tokenDeleted = true;
            login.loggedOutAt = currentTimestamp(req);
            login.updatedAt = currentTimestamp(req);
            await login.save();
          }
          return getErrorMessage(next, ERROR.notAuthorized);
        }
      } else {
        const decoded = await this.verifyAndDecodeToken(token, process.env.JWT_SECRET_KEY, next);
        if (decoded) {
          const login = await UserUtils.getUserLogin(decoded.uuid, decoded.tokenId);
          if (!login) return;
          // if (login.tokenDeleted) {
          //   login.loggedOut = true;
          //   login.loggedOutAt = currentTimestamp(req);
          //   await login.save();
          //   await BlacklistToken.create({
          //     token: token,
          //   });
          // } else {
          login.loggedOut = true;
          login.tokenDeleted = true;
          login.updatedAt = currentTimestamp(req);
          login.loggedOutAt = currentTimestamp(req);
          await login.save();
          await BlacklistToken.create({
            token,
            createdAt: currentTimestamp(req),
            updatedAt: currentTimestamp(req),
          });
          // }
        }
        next();
      }
    }
  }

  private readonly verifyAndDecodeToken = async (
    token: string,
    secretKey: string,
    next: NextFunction
  ): Promise<any> => {
    return await verifyAuthToken(token, secretKey, next);
  };

  private readonly getJWTAccessToken = (req: Request, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return getErrorMessage(next, ERROR.notAuthorized);
    const bearer = authHeader.split(' ')[0];
    if (bearer !== 'Bearer') return getErrorMessage(next, ERROR.notAuthorized);
    const accessToken: string = authHeader.split(' ')[1];
    if (!accessToken) return getErrorMessage(next, ERROR.notAuthorized);
    return accessToken;
  };

  private readonly getAPIAccessKey = (req: Request, next: NextFunction) => {
    const accessKey: string = req.headers['x-api-access-key'] as string;
    if (!accessKey) {
      return getErrorMessage(next, ERROR.notAuthorized);
    }
    if (accessKey.split(' ').length > 0) {
      return getErrorMessage(next, ERROR.notAuthorized);
    }
    if (accessKey.split('-')[0].toLocaleLowerCase() !== 'dgt') {
      return getErrorMessage(next, ERROR.notAuthorized);
    }
    if (accessKey.split('-').length < 2) return getErrorMessage(next, ERROR.notAuthorized);
    return accessKey.split('-')[-1];
  };
  private readonly setAPIAccessKey = (accessKey: string) => {
    const notificationAPIAccessKey = process.env.NOTIFICATION_ACCESS_KEY.replace('KEY', accessKey);
    httpContext.set('notificationApiKey', notificationAPIAccessKey);
  };
  private readonly getUserFromToken = async (uuid: string): Promise<User | null> => {
    return UserUtils.getUserByUUID(uuid);
  };
}
