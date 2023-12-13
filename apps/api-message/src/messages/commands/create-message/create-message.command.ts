import { ICreateMessageDto } from 'libs/core/models/message.model';

export class CreateMessageCommand {
  constructor(public readonly payload: ICreateMessageDto) {}
}
