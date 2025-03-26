import { Controller, Get, Sse, MessageEvent, Query, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MqttService } from 'src/mqtt/mqtt.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sse')
export class MqttController {
    constructor(private readonly mqttService: MqttService) {}

    @UseGuards(AuthGuard)
    @Get('data')
    @Sse()
    async sendEvents(
        @Query("greenhouse") greenhouseId: string
    ): Promise<Observable<MessageEvent>> { 
        return await this.mqttService. sendSensorDataStream(greenhouseId);
    }

    @UseGuards(AuthGuard)
    @Get('notification')
    @Sse()
    async sendNotification(
        @Query("userId") userId: string,
        @Query("limit") limit: number
    ): Promise<Observable<MessageEvent>> {
        return await this.mqttService.sendNotification(+userId, limit);
    }
}
