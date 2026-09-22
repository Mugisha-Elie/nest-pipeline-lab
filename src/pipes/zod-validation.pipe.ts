import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema, ZodError, ZodIssue } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform{
  constructor(private readonly schema: ZodSchema) {}
  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log(`\n--- [ZodValidationPipe] Validating ${metadata.type} ---`);

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const error: ZodError = result.error;

      const formattedErrors = error.issues.map((issue: ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))

      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        validationErrors: formattedErrors
      })
    }

    return result.data;
  }
}