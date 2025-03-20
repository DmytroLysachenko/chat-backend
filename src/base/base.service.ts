import { Inject, Injectable } from '@nestjs/common';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from '../base/base.service';

@Injectable()
export class BaseService {
  constructor(
    @Inject('drizzle-connection')
    protected readonly db: NeonDatabase<typeof schema>,
  ) {}
}
