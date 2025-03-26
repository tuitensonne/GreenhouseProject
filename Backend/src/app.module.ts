import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DevicesModule } from './devices/devices.module';
import { MqttModule } from './mqtt/mqtt.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({ 
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DevicesModule,
    MqttModule,
    AuthModule,
    PrismaModule, 
    UserModule, 
    EmailModule,
    SchedulerModule,
  ],

})
export class AppModule { }
