import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CorrelationIdMiddleware } from "./middleware/correlation-id.middleware";
import { RequestContextService } from "./context/request-context.service";
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionFilter } from "./filters/all-exception.filter";


@Module({
  imports: [],
  controllers: [AppController],
  providers: [RequestContextService, {provide: APP_FILTER, useClass: AllExceptionFilter}],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes('*')
  }
}