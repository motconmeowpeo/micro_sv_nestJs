import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from './create-message.command';
import { CacheService } from 'libs/core/cache/cache.service';
import { MessageRepository } from '../../message.repository';
import { ICreateMessageDto } from 'libs/core/models/message.model';
import { Observable, from, lastValueFrom } from 'rxjs';
import { Message } from '@prisma/client';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandle implements ICommandHandler {
  constructor(private readonly repository: MessageRepository) {}
  execute({ payload }: CreateMessageCommand): Promise<Message> {
    return lastValueFrom(this.create(payload));
  }

  create({
    content,
    authorId,
    replyFor,
    receivedId,
  }: ICreateMessageDto): Observable<Message> {
    return from(
      this.repository.message.create({
        data: {
          content,
          authorId,
          receivedId,
          replyForId: replyFor,
        },
        include: {
          author: {
            select: { id: true, username: true },
          },
        },
      }),
    );
  }
}
