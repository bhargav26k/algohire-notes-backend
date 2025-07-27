import { Controller } from '@nestjs/common';
import { TaggedMessagesService } from './tagged-messages.service';

@Controller('tagged-messages')
export class TaggedMessagesController {
  constructor(private readonly taggedMessagesService: TaggedMessagesService) {}
}
