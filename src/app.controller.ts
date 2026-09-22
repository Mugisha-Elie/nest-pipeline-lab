import { Controller, Get, UseGuards, Req, UseInterceptors, Param, Body, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request } from "express";
import {z, ZodPipe} from "zod";
import { AuthGuard } from "./guards/auth.guard";
import { Public, Roles } from "./decorators/auth.decorator";
import { InspectContextGuard } from "./guards/inspect-context.guard";
import { RequestContextService } from "./context/request-context.service";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ParsePositiveIntPipe } from "./pipes/parse-positive-int.pipe";
import { ZodValidationPipe } from "./pipes/zod-validation.pipe";
import { CreateItemClassDto } from "./dto/create-item.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ZoddPipe } from "./pipes/zod.pipe";
import { RegisterUserSchema } from "./dto/register-user.schema";

export const CreateItemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  price: z.number().positive('Price must be greater than zero'),
  tags: z.array(z.string()).min(1, 'At least one tag is required')
})

export type CreateItemDto = z.infer<typeof CreateItemSchema>;

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


  @Public()
  @Post('items')
  @UsePipes(new ZodValidationPipe(CreateItemSchema))
  createItem(@Body() itemDto: CreateItemDto) {
    return {
      message: 'Item created successfully',
      item: itemDto
    }
  }

  @Public()
  @Post('items/traditional')
  createWithClassValidator(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: CreateItemClassDto
  ) {
    return {
      message: 'Item created via class-validator',
      item: dto,
    }
  }


  @Public()
  @Post('users/register')
  registerUser(
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })) dto: RegisterUserDto
  ) {
    return {
      message: 'User registered successfully with traditional class-validator!',
      data: dto,
      isAddressInstance: dto.address instanceof Object
    }
  }

  @Public()
  @Post('users/register-zod')
  @UsePipes(new ZoddPipe(RegisterUserSchema))
  registerUserZod(
    @Body() dto: RegisterUserDto
  ) {
    return {
      message: 'User registerd successfully wit zod!',
      data: dto
    }
  }
}
