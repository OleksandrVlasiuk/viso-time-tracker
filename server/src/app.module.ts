import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeEntryModule } from './time-entry/time-entry.module';

@Module({
  imports: [TimeEntryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
