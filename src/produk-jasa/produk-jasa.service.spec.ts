import { Test, TestingModule } from '@nestjs/testing';
import { ProdukJasaService } from './produk-jasa.service';

describe('ProdukJasaService', () => {
  let service: ProdukJasaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdukJasaService],
    }).compile();

    service = module.get<ProdukJasaService>(ProdukJasaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
