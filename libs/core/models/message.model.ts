export interface ICreateMessageDto {
  content: string;
  authorId: string;
  replyFor?: string;
}
