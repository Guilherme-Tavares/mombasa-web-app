import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  home(): object {
    return { titulo: 'Agroware Mombasa' };
  }
}
