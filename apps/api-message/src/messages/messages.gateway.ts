import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import {
  ICreateMessageDto,
  IGetAllMessageQuery,
} from 'libs/core/models/message.model';
import { Server } from 'socket.io';
import { Public } from 'libs/core/decorators/public.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket'],
  },
  allowEIO3: true,
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;
  handleConnection(client: WebSocket) {
    console.log(`Client connected: ${client}`);
  }

  handleDisconnect(client: WebSocket) {
    console.log(`Client disconnected: ${client}`);
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: ICreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody() authorId: IGetAllMessageQuery) {
    return this.messagesService.findAll(authorId);
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
