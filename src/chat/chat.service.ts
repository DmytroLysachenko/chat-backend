import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { BaseService } from '../base/base.service';
import { messages } from '../drizzle/schema';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService extends BaseService {
  async create(
    createMessageDto: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    const [message] = await this.db
      .insert(messages)
      .values({ ...createMessageDto, userId })
      .returning();

    return message;
  }

  findAll(roomId: string): Promise<Message[]> {
    return this.db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.roomId, roomId),
    });
  }
}
