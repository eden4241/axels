import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { BATCH_ROLLBACK, BATCH_TOP_PRODUCT, BATCH_TOP_SELLER, } from './lib/config';

@Injectable()
export class BatchScheduler {
  constructor(private readonly batchService: BatchService) {}

  @Timeout(1000)
  handleTimeout() {
    // Use .log (not .debug) so it shows up in terminal by default.
    new Logger('BatchScheduler').log('Batch Server Ready!');
  }

  @Cron('00 00 01 * * *', { name: BATCH_ROLLBACK })
  public async batchRollback() {
    const logger = new Logger(BATCH_ROLLBACK);
    try {
      logger.log('EXECUTED');
      await this.batchService.batchRollback();
    } catch (err) {
      logger.error(err);
    }
  }

  @Cron('20 00 01 * * *', { name: BATCH_TOP_PRODUCT })
  public async batchTopProducts() {
    const logger = new Logger(BATCH_TOP_PRODUCT);
    try {
      logger.log('EXECUTED');
      await this.batchService.batchTopProducts();
    } catch (err) {
      logger.error(err);
    }
  }

  @Cron('40 00 01 * * *', { name: BATCH_TOP_SELLER })
  public async batchTopSellers() {
    const logger = new Logger(BATCH_TOP_SELLER);
    try {
      logger.log('EXECUTED');
      await this.batchService.batchTopSellers();
    } catch (err) {
      logger.error(err);
    }
  }
}
