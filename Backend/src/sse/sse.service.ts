import { MessageEvent, Query, Injectable } from '@nestjs/common';
import { MqttService } from 'src/mqtt/mqtt.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SseService {
    constructor(private readonly mqttService: MqttService,
                private readonly prisma: PrismaService
    ) {}

    async sendEvents(greenhouseId: string): Promise<Observable<MessageEvent>> { 
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
    
        return this.mqttService.getEvents(+greenhouseId).pipe(
            map((data) => ({
                data: JSON.stringify(data)
            })),
            startWith({
                data: JSON.stringify(filteredRecords)
            })
        );
    }
    
}
