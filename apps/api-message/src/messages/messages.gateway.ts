import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import {
  ICreateMessageDto,
  IGetAllMessageQuery,
} from 'libs/core/models/message.model';
import { Server } from 'socket.io';
import { Public } from 'libs/core/decorators/public.decorator';
import { Socket } from 'dgram';

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
    this.server.emit('online', { online: true });
  }

  handleDisconnect(client: WebSocket) {
    console.log(`Client disconnected: ${client}`);
    this.server.emit('online', { online: false });
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: ICreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    this.server.emit('resMessage', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll(@MessageBody() authorId: IGetAllMessageQuery) {
    const messages = await this.messagesService.findAll(authorId);
    return messages;
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.typing();
    // client.setBroadcast('')
  }
}
