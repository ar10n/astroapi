import { IMiddleWare } from './middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleWare {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
                if (error) {
                    next();
                } else if (typeof payload !== 'string' && typeof payload !== 'undefined') {
                    req.user = payload.email;
                    next();
                }
            });
        } else {
            next();
        }
    }
}
