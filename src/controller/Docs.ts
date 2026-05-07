import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiExcludeController()
@Controller('documentacao')
export class DocsController {
  @Get()
  getDocs(@Res() res: Response) {
    const htmlPath = path.join(process.cwd(), 'docs.html');
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.status(404).send('Documentação HTML não encontrada no servidor.');
    }
  }
}
