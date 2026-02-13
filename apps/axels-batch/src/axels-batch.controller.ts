import { Controller, Get } from '@nestjs/common';
import { AxelsBatchService } from './axels-batch.service';

@Controller()
export class AxelsBatchController {
  constructor(private readonly axelsBatchService: AxelsBatchService) {}

  @Get()
  getHello(): string {
    return this.axelsBatchService.getHello();
  }
}
