import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsUUID()
  roomId: string;
}
