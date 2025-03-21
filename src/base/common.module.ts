import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { DrizzleModule } from '../drizzle/drizzle.module'; // Import DrizzleModule

@Module({
  imports: [DrizzleModule], // Import DrizzleModule
  providers: [BaseService], // Provide BaseService
  exports: [BaseService, DrizzleModule], // Export BaseService
})
export class CommonModule {}
