import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async index(@Res() res: Response, @Req() req: Request) {
    const { accessToken } = req.cookies;
    const authStoreInitialState =
      await this.appService.getInitialState(accessToken);

    const filePath = join(__dirname, '..', 'public', 'index.html');
    const htmlContent = await readFile(filePath, 'utf-8');

    const modifiedHtml = this.appService.injectInitialStateIntoHtml(
      htmlContent,
      authStoreInitialState,
    );
    res.send(modifiedHtml);
  }
}
