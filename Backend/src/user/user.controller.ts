import { Controller, Get, Body, Patch, Param, UseGuards, Req, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePasswordDto } from './dto/create-user.dto';

@Controller('user')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  update(@Req() req, @Body() updatePassword: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.email, updatePassword);
  }

  @Post(':id') 
  subscribeToGreenhouse(
    @Param('id') userId: number,
    @Body() greenhouseID: number[]
  ) {
    return this.userService.subscribeToGreenhouse(userId, greenhouseID)
  }

  @Patch(':id') 
  changeEmailNotiOption(
    @Param('id') userId: number,
    @Query('mail') mailOption: boolean
  ) {
    return this.userService.changeEmailNotiOption(userId, mailOption)
  }
}
