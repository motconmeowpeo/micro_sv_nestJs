export interface ICreateMessageDto {
  content: string;
  authorId: string;
  replyFor?: string;
  receivedId: string;
}

export interface IGetAllMessageQuery {
  authorId: string;
  receivedId: string;
}
