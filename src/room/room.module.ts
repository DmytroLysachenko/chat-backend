import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { CommonModule } from '../base/common.module';

@Module({
  imports: [CommonModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
