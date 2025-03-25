import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DevicesModule } from './devices/devices.module';
import { MqttModule } from './mqtt/mqtt.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { SseModule } from './sse/sse.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './email/email.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DevicesModule,
    MqttModule,
    AuthModule,
    PrismaModule, 
    UserModule, 
    SseModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6060,
      },
    }),
    EmailModule,
  ],

})
export class AppModule { }
