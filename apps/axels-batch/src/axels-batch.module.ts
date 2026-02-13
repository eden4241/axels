import { Module } from '@nestjs/common';
import { AxelsBatchController } from './axels-batch.controller';
import { AxelsBatchService } from './axels-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [AxelsBatchController],
	providers: [AxelsBatchService],
})
export class AxelsBatchModule {}
