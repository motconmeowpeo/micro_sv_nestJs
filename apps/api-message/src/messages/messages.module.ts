import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';
import { MessageRepository } from './message.repository';

@Module({
  imports: [CqrsModule],
  providers: [
    MessagesGateway,
    MessageRepository,
    MessagesService,
    ...COMMANDS,
    ...QUERIES,
  ],
})
export class MessagesModule {}
