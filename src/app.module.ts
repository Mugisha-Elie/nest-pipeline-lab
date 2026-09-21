import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CorrelationIdMiddleware } from "./middleware/correlation-id.middleware";
import { RequestContextService } from "./context/request-context.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RequestContextService],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes('*')
  }
}