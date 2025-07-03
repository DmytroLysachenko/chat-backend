import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../base/common.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, CommonModule, JwtModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
