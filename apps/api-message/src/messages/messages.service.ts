import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ICreateMessageDto,
  IGetAllMessageQuery,
} from 'libs/core/models/message.model';
import { CreateMessageCommand } from './commands/create-message/create-message.command';
import { GetAllMessageQuery } from './queries/get-all/get-all-message.query';

@Injectable()
export class MessagesService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  create(createMessageDto: ICreateMessageDto) {
    return this.commandBus.execute<CreateMessageCommand>(
      new CreateMessageCommand(createMessageDto),
    );
  }

  findAll(authorId: IGetAllMessageQuery) {
    return this.queryBus.execute<GetAllMessageQuery>(
      new GetAllMessageQuery(authorId),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  typing() {
    return true;
  }
}
