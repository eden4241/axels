import { Injectable } from '@nestjs/common';

@Injectable()
export class AxelsBatchService {
  getHello(): string {
    return 'Axels Batch Server!';
  }
}
