import { Test, TestingModule } from '@nestjs/testing';
import { AxelsBatchController } from './axels-batch.controller';
import { AxelsBatchService } from './axels-batch.service';

describe('AxelsBatchController', () => {
  let axelsBatchController: AxelsBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AxelsBatchController],
      providers: [AxelsBatchService],
    }).compile();

    axelsBatchController = app.get<AxelsBatchController>(AxelsBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(axelsBatchController.getHello()).toBe('Hello World!');
    });
  });
});
