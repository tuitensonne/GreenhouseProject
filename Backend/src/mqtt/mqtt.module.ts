import { Global, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [NotificationModule, UserModule],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})

export class MqttModule {}
