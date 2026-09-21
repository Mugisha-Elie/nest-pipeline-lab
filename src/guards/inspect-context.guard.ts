import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class InspectContextGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const contextType = context.getType();

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();

    const targetClass = context.getClass();
    const targetHandler = context.getHandler();

    console.log('\n--- [InspectContextGuard Triggered] ---');
    console.log(`Context Type : ${contextType}`);
    console.log(`HTTP Method  : ${req.method}`);
    console.log(`Route Path   : ${req.url}`);
    console.log(`Target Class : ${targetClass.name}`);
    console.log(`Handler Name : ${targetHandler.name}`);
    console.log('----------------------------------------\n');

    return true;
  }
}
