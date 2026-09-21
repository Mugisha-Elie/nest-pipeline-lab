import { Controller, Get, UseGuards } from "@nestjs/common";
import { InspectContextGuard } from "./guards/inspect-context.guard";
import { RequestContextService } from "./context/request-context.service";

@Controller('system')
export class AppController {
  constructor(private readonly requestContext: RequestContextService) {}
  
  @Get('status')
  @UseGuards(InspectContextGuard)
  getStatus() {
    const correlationId = this.requestContext.correlationId;
    
    return {
      status: 'operational',
      correlationIdFromALS: correlationId,
      timestamp: Date.now()
    }
  }
}