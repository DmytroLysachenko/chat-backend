import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

@Global()
@Module({
  imports: [ConfigModule.forRoot()], // Import ConfigModule
  providers: [
    {
      provide: 'drizzle-connection',
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }

        const sql = neon(databaseUrl); // Create a connection pool
        return drizzle(sql); // Wrap the connection with Drizzle ORM
      },
      inject: [ConfigService], // Inject ConfigService
    },
  ],
  exports: ['drizzle-connection'], // Export the provider
})
export class DrizzleModule {}
