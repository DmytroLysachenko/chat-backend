import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import ws from 'ws';

export const DRIZZLE = Symbol('drizzle-connection');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        neonConfig.webSocketConstructor = ws;

        const databaseUrl = config.get<string>('DATABASE_URL');

        const pool = new Pool({ connectionString: databaseUrl });

        return drizzle(pool, { schema }) as NeonDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
