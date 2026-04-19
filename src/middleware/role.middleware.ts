import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'] as { role?: string } | undefined;
    
    if (user) {
      req['userRole'] = user.role || 'user';
    }

    next();
  }
}