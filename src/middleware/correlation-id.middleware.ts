import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-request-id'

    const correlationId = (req.headers[headerName] as string) || randomUUID();

    req.headers[headerName] = correlationId
    res.setHeader(headerName, correlationId)

    const startTime = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - startTime;
      console.log(
        `[HTTP] ${req.method} ${req.originalUrl || req.url} ` +
        `Status: ${res.statusCode} | Request-ID: ${correlationId} | Duration: ${elapsed}ms`,
      );
    })

    next();
  }
}