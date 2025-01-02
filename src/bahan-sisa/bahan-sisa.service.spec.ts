import { Test, TestingModule } from '@nestjs/testing';
import { BahanSisaService } from './bahan-sisa.service';

describe('BahanSisaService', () => {
  let service: BahanSisaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BahanSisaService],
    }).compile();

    service = module.get<BahanSisaService>(BahanSisaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
