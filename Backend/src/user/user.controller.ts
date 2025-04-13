import { Controller, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePasswordDto } from './dto/create-user.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  update(@Req() req, @Body() updatePassword: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.email, updatePassword);
  }
}
