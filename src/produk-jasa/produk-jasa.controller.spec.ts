import { Test, TestingModule } from '@nestjs/testing';
import { ProdukJasaController } from './produk-jasa.controller';
import { ProdukJasaService } from './produk-jasa.service';

describe('ProdukJasaController', () => {
  let controller: ProdukJasaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdukJasaController],
      providers: [ProdukJasaService],
    }).compile();

    controller = module.get<ProdukJasaController>(ProdukJasaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
