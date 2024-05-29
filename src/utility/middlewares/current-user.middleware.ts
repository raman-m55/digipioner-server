import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { sub } = this.jwtService.verify(token);
        const currentUser = await this.usersService.findOneUserById(+sub);
        req.currentUser = currentUser;
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}
