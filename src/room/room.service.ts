import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { BaseService } from '../base/base.service';
import { rooms } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoomService extends BaseService {
  async create(createRoomDto: CreateRoomDto) {
    const [room] = await this.db
      .insert(rooms)
      .values(createRoomDto)
      .returning();
    return room;
  }

  findAll() {
    return this.db.query.rooms.findMany();
  }

  findOne(id: string) {
    return this.db.query.rooms.findFirst({
      where: eq(rooms.id, id),
    });
  }
}
