import { Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { filter, map, mergeMap, Observable, startWith, Subject } from 'rxjs';
import { EmailService } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MqttService implements OnModuleDestroy {
	private client: mqtt.MqttClient;
	private dataSubject = new Subject<any>();
	private notificationSubject = new Subject<any>();

	constructor(
		private readonly prisma: PrismaService,
		private readonly notificationService: NotificationService,
		private readonly userService: UserService,
		private readonly emailService: EmailService
	) {
		this.initializeMQTTClient();
	}

	private initializeMQTTClient() {
		this.client = mqtt.connect('mqtts://io.adafruit.com', {
			port: Number(process.env.MQTT_PORT),
			username: process.env.MQTT_USERNAME,
			password: process.env.MQTT_PASSWORD,
		});

		this.client.on('connect', () => console.log('Connected to Adafruit IO MQTT'));
		this.client.on('error', (err) => console.error('MQTT Error:', err));
		this.client.on('message', async (topic, message) => this.handleMQTTMessage(topic, message));
	}

	private async handleMQTTMessage(topic: string, message: Buffer) {
		const data = Number(message.toString());
		const device = await this.getDeviceByTopic(topic);
		if (device) {
			try {
				const record = await this.prisma.sensorRecord.create({
					data: {
						value: data,
						dateCreated: new Date(),
						device: {
							connect: { SID: device.SID }
						}
					}
				})

				this.prisma.sensor.update({
					where: {SID: device.SID},
					data: {
						value: data
					}
				})

				record['sensorType'] = device.sensorType;
				record['greenhouseID'] = device.greenHouseID;
				this.dataSubject.next([record]);
			} catch (err) {
				console.error(err);
				throw new InternalServerErrorException("An error occurred! Please try again.");
			}
			
			// This is for notification
			if (device.maxValue && data > device.maxValue) {
				const users = await this.userService.getAllUserSubGreenhouse(device.greenHouseID)
				const greenhouse = await this.prisma.greenHouse.findUnique({
					where: {
						GID: device.greenHouseID
					}
				})

				const content = {
					greenhouseName: greenhouse?.name,
					greenhouseLocation: greenhouse?.location,
					greenhouseId: greenhouse?.GID,
					sensorId: device.SID,
					sensorType: device.sensorType,
					maxValue: device.maxValue,
					value: data
				}
				
				for (const user of users) {
					await this.notificationService.createNotification(device, user.ID, data) 
					if (user.useEmail4Noti){
						this.emailService.sendEmail(user.email,'⚠️ Alert: Sensor Value Exceeded Threshold' ,content)
					}
				}
				this.notificationSubject.next({device, data})
			}
		}
	}

	private getData() {
		return this.dataSubject.asObservable();
	}

	private getNotification() {
		return this.notificationSubject.asObservable();
	}

	public subscribeToTopic(topic: string) {
		this.client.subscribe(topic, (err) => {
			if (err) {
				console.error('Error subscribing:', err);
			} else {
				console.log(`Subscribed to ${topic}`);
			}
		});
	}

	async getDeviceByTopic(topic: string) {
		const device = await this.prisma.sensor.findUnique({
			where: { topic: topic }
		});
		if(!device) throw new NotFoundException('Device not found');
		return device;
	}

	async sendSensorDataStream(greenhouseId: string): Promise<Observable<MessageEvent>> { 
        const sensorTypes = ["earth", "light", "humidity", "temperature"];
        
        const records = await Promise.all(
            sensorTypes.map(async (type) => { 
                const record = await this.prisma.sensorRecord.findFirst({
                    where: {
                        device: {
                            greenHouseID: +greenhouseId,
                            sensorType: type
                        }
                    },
                    orderBy: { dateCreated: "desc" }
                });
                
                return record ? { ...record, sensorType: type } : null;
            })
        );
		
        const filteredRecords = records.filter(record => record !== null);
        return this.getData().pipe(	
            filter((data) => this.checkGreenhouse(data, +greenhouseId)),
			map((data) => {
				const { greenhouseID, ...rest } = data;
				return new MessageEvent('message', { data: JSON.stringify(rest) });
			}),
			startWith(new MessageEvent('message', { data: JSON.stringify(filteredRecords) }))
        );
    }

    private checkGreenhouse(data: any, greenhouseId: number) {
        if (data[0].greenhouseID === greenhouseId) {
            return true
        }
        return false
    }

    async sendNotification(userId: number , limit: number = 15): Promise<Observable<MessageEvent>> {
		// Take those latest notification in database 
		const notification = await this.getUserNotifications(userId, limit)
		return this.getNotification().pipe(
			// Check whether the user subscribe to the notification of specific greenhouse
			mergeMap(async ({ device, value }) => {
				const isSubscribed = await this.isUserSubscribedToGreenhouse(userId, device.greenHouseID);
				return isSubscribed ? { device, value } : null;
			}),

			filter((data) => data !== null), 
			mergeMap(async ({ device, value }) => {
				const notification = await this.prisma.notification.findFirst({
					orderBy: {
						dateCreated: "desc"
					}
				})
				return new MessageEvent('message', { data: JSON.stringify([notification]) });
			}),
			startWith(new MessageEvent('message', { data: JSON.stringify(notification) }))
		);			  
    }

	private isUserSubscribedToGreenhouse(userId: number, greenhouseId: number) {
		return this.prisma.userGreenhouse.findFirst({
		  where: { userId, greenhouseId },
		});
	}

	private async getUserNotifications(userId: number, limit: number = 10) {
		const notifications = await this.prisma.notification.findMany({
			where: {
				userID : userId
			},
			take: limit,
			orderBy: {
				dateCreated: "desc"
			}
		})        
		if (!notifications) throw new NotFoundException("User ID is not existed")
		return notifications
	}

	async sendDataToAdafruit(topic: string, value: number) {
		return this.client.publish(topic, `${value}`, (err) => {
			if (err) {
				console.error('Error publishing to MQTT:', err);
			} else {
				console.log(`Published to ${topic}: ${value}`);
			}
		});
	}

	onModuleDestroy() {
		this.client.end();
	}
}
