import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUserQuery } from './get-all-user.query';
import { User } from '@prisma/client';
import { from, lastValueFrom } from 'rxjs';
import { UserRepository } from '../../user.repository';

@QueryHandler(GetAllUserQuery)
export class GetAllUserHandle implements IQueryHandler {
  constructor(private repo: UserRepository) {}
  execute(): Promise<{ id: string; username: string }[]> {
    return lastValueFrom(
      from(
        this.repo.user.findMany({
          where: {
            active: { equals: true },
          },
          select: { id: true, username: true, avatar: true },
        }),
      ),
    );
  }
}
