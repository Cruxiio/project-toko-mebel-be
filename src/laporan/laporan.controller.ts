import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { CreateLaporanHPPDto } from './dto/create-laporan.dto';
import { LaporanStokBahanKeluarDto } from 'src/history-bahan-keluar/dto/create-history-bahan-keluar.dto';
import { FindAllNotaDto } from 'src/nota/dto/create-nota.dto';
import { FindAllStokDto } from 'src/history-masuk/dto/create-history-masuk.dto';

@Controller('api/laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Post('hpp')
  laporanHpp(@Body() createLaporanDto: CreateLaporanHPPDto) {
    return this.laporanService.saveHppToFile(createLaporanDto);
    // return this.laporanService.laporanHPPKayu(createLaporanDto);
  }

  @Post('bahan-keluar')
  laporanBahanKeluar(
    @Body() createLaporanBahanKeluarDto: LaporanStokBahanKeluarDto,
  ) {
    return this.laporanService.saveLaporanBahanKeluar(
      createLaporanBahanKeluarDto,
    );
  }

  @Post('bahan-masuk')
  laporanBahanMasuk(@Body() createLaporanBahanMasukDto: FindAllStokDto) {
    return this.laporanService.saveLaporanBahanMasuk(
      createLaporanBahanMasukDto,
    );
  }

  @Post('nota')
  laporanNota(@Body() createLaporanNotaDto: FindAllNotaDto) {
    return this.laporanService.saveLaporanNota(createLaporanNotaDto);
  }
}
