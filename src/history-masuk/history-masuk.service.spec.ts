import { Test, TestingModule } from '@nestjs/testing';
import { HistoryMasukService } from './history-masuk.service';

describe('HistoryMasukService', () => {
  let service: HistoryMasukService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryMasukService],
    }).compile();

    service = module.get<HistoryMasukService>(HistoryMasukService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
