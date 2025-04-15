import { Controller, Get, Sse, MessageEvent, Query, UseGuards, Req } from '@nestjs/common';
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
        return await this.mqttService.sendSensorDataStream(greenhouseId);
    }

    @UseGuards(AuthGuard)
    @Get('notification')
    @Sse()
    async sendNotification(
        @Req() req, 
        @Query("limit") limit: string
    ): Promise<Observable<MessageEvent>> {
        return await this.mqttService.sendNotification(req.user.sub, +limit);
    }
}
