import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from "@nestjs/common";


@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    console.log('\n--- [ParsePositiveIntPipe Triggered] ---');
    console.log(`Param Name   : ${metadata.data}`);
    console.log(`Param Source : ${metadata.type}`); // 'param' | 'query' | 'body'
    console.log(`Target Type  : ${metadata.metatype?.name}`);
    console.log(`Raw Value    : "${value}"`);
    console.log('----------------------------------------\n');

    const parsed = parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(
        `Validation failed for parameter "${metadata.data}". Expected an integer, received "${value}".`
      )
    }

    if (parsed <= 0) {
      throw new BadRequestException(
        `Validation failed for parameter "${metadata.data}". Expected a positive integer (> 0), received ${parsed}.`,
      );
    }

    return parsed;
  }
}