import { IGetAllMessageQuery } from 'libs/core/models/message.model';

export class GetAllMessageQuery {
  constructor(public readonly authorId: IGetAllMessageQuery) {}
}
