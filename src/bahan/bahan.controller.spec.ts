import { Test, TestingModule } from '@nestjs/testing';
import { BahanController } from './bahan.controller';
import { BahanService } from './bahan.service';

describe('BahanController', () => {
  let controller: BahanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BahanController],
      providers: [BahanService],
    }).compile();

    controller = module.get<BahanController>(BahanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
