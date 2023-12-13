import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMessageQuery } from './get-all-message.query';
import { MessageRepository } from '../../message.repository';
import { Message } from '@prisma/client';
import { from, lastValueFrom } from 'rxjs';

@QueryHandler(GetAllMessageQuery)
export class GetAllMessageHandle implements IQueryHandler {
  constructor(private readonly repository: MessageRepository) {}
  execute({ authorId }: GetAllMessageQuery): Promise<Message[]> {
    return lastValueFrom(
      from(
        this.repository.message.findMany({
          where: { authorId: authorId.authorId },
        }),
      ),
    );
  }
}
