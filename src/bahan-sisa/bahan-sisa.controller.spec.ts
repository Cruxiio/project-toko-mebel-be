import { Test, TestingModule } from '@nestjs/testing';
import { BahanSisaController } from './bahan-sisa.controller';
import { BahanSisaService } from './bahan-sisa.service';

describe('BahanSisaController', () => {
  let controller: BahanSisaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BahanSisaController],
      providers: [BahanSisaService],
    }).compile();

    controller = module.get<BahanSisaController>(BahanSisaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
