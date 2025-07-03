import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedSocket } from '../auth/authenticated-socket.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const user = client.handshake.auth.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const message = await this.chatService.create(createMessageDto, user.id);
    this.server.to(createMessageDto.roomId).emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody() roomId: string) {
    return this.chatService.findAll(roomId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: AuthenticatedSocket) {
    await client.join(roomId);
  }
}
