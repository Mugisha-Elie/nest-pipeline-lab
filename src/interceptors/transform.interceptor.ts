import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs'

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  executionTimeMs: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseEnvelope<T>>{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseEnvelope<T>> | Promise<Observable<ApiResponseEnvelope<T>>> {
    const start = Date.now();
    const handlerName = context.getHandler().name;
    const className = context.getClass().name;

    console.log(`>>> [TransformInterceptor PRE] Entering: ${className} -> ${handlerName}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`>>> [TransformInterceptor POST (tap)] ${className} -> ${handlerName} took ${duration}ms`);
      }),

      map((data: T) => {
        const duration = Date.now() - start;
        return {
          success: true,
          data,
          executionTimeMs: duration
        }
      })
    )
  }
}