import { Controller, Get, UseGuards } from "@nestjs/common";
import { InspectContextGuard } from "./guards/inspect-context.guard";

@Controller('system')
export class AppController {
  @Get('status')
  @UseGuards(InspectContextGuard)
  getStatus() {
    return {status: 'operational', timestamp: Date.now()}
  }
}