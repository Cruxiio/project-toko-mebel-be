import { Test, TestingModule } from '@nestjs/testing';
import { HistoryBahanKeluarController } from './history-bahan-keluar.controller';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';

describe('HistoryBahanKeluarController', () => {
  let controller: HistoryBahanKeluarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryBahanKeluarController],
      providers: [HistoryBahanKeluarService],
    }).compile();

    controller = module.get<HistoryBahanKeluarController>(HistoryBahanKeluarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
