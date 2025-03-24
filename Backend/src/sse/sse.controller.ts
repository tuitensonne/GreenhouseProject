import { Controller, Get, Sse, MessageEvent, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
    constructor(private readonly sseService: SseService) {}

    @Get('data')
    @Sse()
    async sendEvents(@Query("greenhouse") greenhouseId: string): Promise<Observable<MessageEvent>> { 
        return await this.sseService.sendEvents(greenhouseId);
    } 
}
