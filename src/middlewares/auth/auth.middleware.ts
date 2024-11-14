import { NextFunction, Request, Response } from 'express';


declare module 'express' {
  interface Request {
    user: any;
    userTokenId: string;
  }
}

export class AuthMiddleware {
  public async authProtect(req: Request, res: Response, next: NextFunction) {
    next()
  }
}

