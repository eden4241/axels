import { Module } from '@nestjs/common';
import { AxelsBatchController } from './axels-batch.controller';
import { AxelsBatchService } from './axels-batch.service';

@Module({
  imports: [],
  controllers: [AxelsBatchController],
  providers: [AxelsBatchService],
})
export class AxelsBatchModule {}
