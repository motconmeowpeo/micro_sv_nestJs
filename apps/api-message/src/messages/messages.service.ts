import { Injectable } from '@nestjs/common';
import { ICreateMessageDto } from 'libs/core/models/message.model';

@Injectable()
export class MessagesService {
  create(createMessageDto: ICreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all messages`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  typing() {
    return true;
  }
}
