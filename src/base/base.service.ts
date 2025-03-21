import { Inject, Injectable } from '@nestjs/common';

import * as schema from '../drizzle/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

@Injectable()
export class BaseService {
  constructor(
    @Inject('drizzle-connection')
    protected readonly db: NeonHttpDatabase<typeof schema>,
  ) {}
}
