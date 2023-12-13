export interface ICreateMessageDto {
  content: string;
  authorId: string;
  replyFor?: string;
}

export interface IGetAllMessageQuery {
  authorId: string;
}
