import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { BaseService } from './base/base.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DrizzleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, BaseService],
})
export class AppModule {}
