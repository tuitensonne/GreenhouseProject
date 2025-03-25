import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('send')
  async sendEmail(
    @Query('to') to: string,
    @Query('subject') subject: string,
    @Query('text') text: string
  ) {
    return this.emailService.sendEmail(to, subject, text);
  }
}
