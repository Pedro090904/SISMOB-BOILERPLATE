import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './Business';

/**
 * Exception thrown when an attempt is made to create a resource that already exists.
 * Returns a 409 Conflict status.
 */
export class EntityAlreadyExistsException extends BusinessException {
  constructor(entity: string, field: string, value: any) {
    super(
      `${entity} com ${field} '${value}' já existe no sistema.`,
      HttpStatus.CONFLICT,
    );
  }
}
