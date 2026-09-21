import {
  CanActivate,
  ExecutionContext,
  ForbiddenException, 
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Public, Roles } from "../decorators/auth.decorator";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(Public, [context.getHandler(), context.getClass()])
    if (isPublic) {
      console.log('>>> [AuthGuard] Public route detected. Bypassing check.');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }

    const rawToken = authHeader.split(' ')[1];

    // "Bearer admin:mugisha"
    const [role, username] = rawToken.split(':')

    if (!role || !username) {
      throw new UnauthorizedException('Invalid token format')
    }

    (request as any).user = { role, username };

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [context.getHandler(), context.getClass()])

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log(`>>> [AuthGuard] User "${username}" authenticated for general route.`);
      return true;
    }

    const hasRole = requiredRoles.includes(role);
    if (!hasRole) {
      console.log(`>>> [AuthGuard] Access DENIED for "${username}". Required: [${requiredRoles}], Found: "${role}"`);
      throw new ForbiddenException(
        `Forbidden resource. Required roles: [${requiredRoles.join(', ')}]`,
      );
    }
    console.log(`>>> [AuthGuard] Access GRANTED for "${username}" with role "${role}".`);
    return true;
  }
}