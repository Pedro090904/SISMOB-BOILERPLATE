import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for all business-related exceptions in the application.
 * Returns a 400 Bad Request by default.
 */
export class BusinessException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode: status,
        message: message,
        error: 'Business Error',
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}
