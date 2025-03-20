import { Injectable } from '@nestjs/common';
import * as schema from './drizzle/schema';
import { BaseService } from './base/base.service';

@Injectable()
export class AppService extends BaseService {
  async getAll() {
    const results = await this.db.select().from(schema.users);

    return results;
  }
}
