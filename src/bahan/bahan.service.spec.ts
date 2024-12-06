import { Test, TestingModule } from '@nestjs/testing';
import { BahanService } from './bahan.service';

describe('BahanService', () => {
  let service: BahanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BahanService],
    }).compile();

    service = module.get<BahanService>(BahanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
