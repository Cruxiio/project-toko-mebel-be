import { Test, TestingModule } from '@nestjs/testing';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';

describe('HistoryBahanKeluarService', () => {
  let service: HistoryBahanKeluarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryBahanKeluarService],
    }).compile();

    service = module.get<HistoryBahanKeluarService>(HistoryBahanKeluarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
