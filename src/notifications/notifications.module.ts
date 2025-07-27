import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaggedMessage } from 'src/tagged-messages/entities/tagged-message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaggedMessage])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
