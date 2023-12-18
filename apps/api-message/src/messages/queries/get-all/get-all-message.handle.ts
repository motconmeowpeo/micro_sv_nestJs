import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMessageQuery } from './get-all-message.query';
import { MessageRepository } from '../../message.repository';
import { Message } from '@prisma/client';
import { from, lastValueFrom } from 'rxjs';

@QueryHandler(GetAllMessageQuery)
export class GetAllMessageHandle implements IQueryHandler {
  constructor(private readonly repository: MessageRepository) {}
  execute({ payload }: GetAllMessageQuery): Promise<Message[]> {
    return lastValueFrom(
      from(
        this.repository.message.findMany({
          where: {
            authorId: { in: [payload.authorId, payload.receivedId] },
            receivedId: { in: [payload.authorId, payload.receivedId] },
          },
          orderBy: {
            createAt: 'asc',
          },
          include: {
            author: {
              select: {
                username: true,
                id: true,
              },
            },
          },
        }),
      ),
    );
  }
}
