import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from "argon2"
import { UpdatePasswordDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor (private readonly prisma: PrismaService) {}

  async updatePassword(email: string, updateUserDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    });
  
    if (!user) {
      throw new ForbiddenException("Email incorrect");
    }
  
    const checkUser = await argon.verify(user.password, updateUserDto.oldPassword); // ⬅️ thêm await
  
    if (!checkUser) {
      throw new ForbiddenException("Password incorrect");
    }
  
    const newPassword = await argon.hash(updateUserDto.newPassword);
  
    const response = await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: newPassword
      }
    });
  
    return response;
  }  

  async getAllUserSubGreenhouse(greenhouseId: number) {
    const users = await this.prisma.user.findMany({
      where: {
				greenhouseList: {
          some: {
            greenhouseId: greenhouseId,
          }
        }
			}
    })
    return users
  }
}
