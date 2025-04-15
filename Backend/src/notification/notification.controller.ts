import { Controller, Param, Patch, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notification')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Patch(':id')
  async updateIsRead(
    @Param('id') id: string,
    @Query('isRead') isRead: boolean
  ) {
    return this.notificationService.updateIsRead(+id, isRead)
  }
}
