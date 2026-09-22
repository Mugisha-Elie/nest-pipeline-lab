import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ZodType } from 'zod'

@Injectable()
export class ZoddPipe implements PipeTransform {
  constructor(private readonly schema: ZodType<unknown>) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log(`\n--- [ZodValidationPipe] Validating ${metadata.type} ---`);
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

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


