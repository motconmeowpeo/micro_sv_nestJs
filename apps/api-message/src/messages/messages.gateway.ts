import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { ICreateMessageDto } from 'libs/core/models/message.model';
import { Server } from 'socket.io';
import { Public } from 'libs/core/decorators/public.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}
  server: Server;

  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: ICreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Public()
  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('typing')
  async typing() {
    return this.messagesService.typing();
  }
}
