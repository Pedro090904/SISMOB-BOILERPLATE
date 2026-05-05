import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

/**
 * Exception thrown when a requested resource is not found.
 * Returns a 404 Not Found status.
 */
export class EntityNotFoundException extends BusinessException {
  constructor(entity: string, id: any) {
    super(
      `${entity} com identificador '${id}' não foi encontrado.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
