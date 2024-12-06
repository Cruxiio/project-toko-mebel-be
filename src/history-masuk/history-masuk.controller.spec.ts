import { Test, TestingModule } from '@nestjs/testing';
import { HistoryMasukController } from './history-masuk.controller';
import { HistoryMasukService } from './history-masuk.service';

describe('HistoryMasukController', () => {
  let controller: HistoryMasukController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryMasukController],
      providers: [HistoryMasukService],
    }).compile();

    controller = module.get<HistoryMasukController>(HistoryMasukController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
