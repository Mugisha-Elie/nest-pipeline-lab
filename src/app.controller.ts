import { Controller, Get, UseGuards, Req, UseInterceptors, Param } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "./guards/auth.guard";
import { Public, Roles } from "./decorators/auth.decorator";
import { InspectContextGuard } from "./guards/inspect-context.guard";
import { RequestContextService } from "./context/request-context.service";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ParsePositiveIntPipe } from "./pipes/parse-positive-int.pipe";

@Controller('system')
@UseGuards(AuthGuard)  
@UseInterceptors(TransformInterceptor)  
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

  @Public()
  @Get('public')
  getPublic(@Req() req: Request) {
    return {
      message: 'Authenticated profile data',
      user: (req as any).user,
      correlationId: this.requestContext.correlationId
    }
  }

  @Get('me')
  getAdminData(@Req() req: Request) {
    return {
      message: 'Sensitive admin metrics',
      user: (req as any).user
    }
  }

  @Roles(['admin'])
  @Get('admin')
  getProfile(@Req() req: Request) {
    return {
      message: 'Sensitive admin metrics',
      user: (req as any).user
    }
  }

  @Public()
  @Get('items/:id')
  getItemById(@Param('id', ParsePositiveIntPipe) id: number) {
    return {
      itemId: id,
      typeofId: typeof id
    }
  }
}