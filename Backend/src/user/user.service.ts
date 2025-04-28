import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from "argon2"
import { UpdatePasswordDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor (private readonly prisma: PrismaService) {}
  
  async subscribeToGreenhouse(userId: number, greenhouseID: number[], option: boolean) {
    try {
      for (const i of greenhouseID) {
        if (option) { // create
          await this.prisma.userGreenhouse.createMany({
            data: [
              {userId: userId, greenhouseId: i}
            ]
          })
        } else {
          await this.prisma.userGreenhouse.deleteMany({
            where: {userId: userId, greenhouseId: i}
          })
        }
      } 
      return {
        message: "User successfully subscribes to Greenhouses"
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Fail to subscribe")
    }
  }

  async changeEmailNotiOption(userId: number, mailOptions: boolean) {
    try {
      await this.prisma.user.update({
        where: {ID: userId},
        data: {
          useEmail4Noti: mailOptions
        }
      })
      return {
        message: "User successfully turns on getting email notification"
      }
    } catch (error) {

    }
  }

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
