import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { Subject } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MqttService implements OnModuleDestroy {
	private client: mqtt.MqttClient;
	private eventSubject = new Subject<any>();
	private greenhouseId: number;

	constructor(private readonly prisma: PrismaService
	) {
		this.client = mqtt.connect('mqtts://io.adafruit.com', {
			port: Number(process.env.MQTT_PORT),
			username: process.env.MQTT_USERNAME,
			password: process.env.MQTT_PASSWORD,
		});

		this.client.on('connect', () => {
			console.log('Connected to Adafruit IO MQTT');
		});

		this.client.on('error', (err) => {
			console.error('MQTT Error:', err);
		});

		// Listen to device
		this.client.on('message', async (topic, message) => {
			const data = Number(message.toString());
			const {device, flag} = await this.getDevice(topic, this.greenhouseId);
			if (device) {
				device['value']=data
				
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
					record['sensorType'] = device.sensorType;
					if(flag) {
						this.eventSubject.next([record]);
					}
				} catch (err) { 
					console.error(err);
					throw new InternalServerErrorException("An error occurred! Please try again.");
				}
			}
		});
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

	public subscribeToDeviceData(topic: string) {
		this.client.subscribe(topic, (err) => {
			if (err) {
				console.error('Error subscribing:', err);
			} else {
				console.log(`Subscribed to ${topic}`);
			}
		});
	}

	onModuleDestroy() {
		this.client.end();
	}
	
	getEvents(greenhouseId: number) {
		this.greenhouseId = greenhouseId;
		return this.eventSubject.asObservable();
	}

	async getDevice(topic: string, greenhouseId: number) {
		try {
			const device = await this.prisma.sensor.findUnique({
				where: { 
					topic: topic,
				},
			});

			if (device && device.greenHouseID !== greenhouseId) {
				return { device: device , flag: false}
			} else {
				return { device: device , flag: true}
			}
		} catch (error) {
			console.error(error);
			throw new NotFoundException('Device not found');
		}
    }
}
