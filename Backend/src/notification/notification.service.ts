import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) {}

    async createNotification(device: any, userId: number, data: number) {
		try {
			const notification = await this.prisma.notification.create({
			  data: {
				message: `Device ID: ${device.SID} of type ${device.sensorType} from greenhouse ${device.greenHouseID} has value ${data} exceeded the maximum value ${device.maxValue}`,
				dateCreated: new Date(),
				isRead: false,
				user: {
					connect: { 
						ID: userId 
					}
				}
			  }
			});
			return notification
		  } catch (err) {
			console.error(err);
			throw new InternalServerErrorException("Error happenned when creating notification in the database");
		}
	}

	async updateIsRead(id: number, isRead: boolean) {
		const notification = await this.prisma.notification.update({
			where: {NID: id},
			data: {
				isRead: isRead
			}
		})
		return notification
    }
}
