import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContextService } from '../context/request-context.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly requestContext: RequestContextService) { }
  
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: string | object = 'Internal Server Error';

    if (isHttpException) {
      errorResponse = exception.getResponse();
    }else {
      console.error(`[AllExceptionFilter] unhandled exception: ${exception} `)
    }

    const message = 
      typeof errorResponse === 'object' && errorResponse !== null
    ? (errorResponse as Record<string, unknown>)['message'] || errorResponse
    : errorResponse;

    const correlationId = this.requestContext.correlationId

    const payload = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: correlationId ?? null,
      error: isHttpException ? exception.name : 'InternalServerError',
      message,
    }

    response.status(status).json(payload)
  }
}
