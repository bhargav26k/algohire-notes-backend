import { Module } from '@nestjs/common';
import { TaggedMessagesService } from './tagged-messages.service';
import { TaggedMessagesController } from './tagged-messages.controller';

@Module({
  controllers: [TaggedMessagesController],
  providers: [TaggedMessagesService],
})
export class TaggedMessagesModule {}
